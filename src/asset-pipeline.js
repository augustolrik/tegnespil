/* Shared by the classic browser app, the Worker and Node regression tests. */
(() => {
  const ASSET_ID = /^img_[a-f0-9]{64}$/;
  const BUILTINS = Object.freeze({
    "default-track": "assets/default-track.svg",
    "default-figure": "assets/default-figure.svg",
    blank: "assets/blank.svg",
  });
  const IMAGE_FIELDS = new Set(["trackImageData", "figureImageData", "trackImage", "figureImage", "imageData", "imagePath"]);

  function isReference(value) {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length !== 1) return false;
    return ASSET_ID.test(value.assetId || "") || Object.hasOwn(BUILTINS, value.builtin || "");
  }

  // All image-bearing fields, including clues, animation frames and future
  // nested assets, pass through this one traversal. Text is never treated as a URL.
  function imageSlots(value, visit) {
    if (!value || typeof value !== "object") return;
    for (const [key, entry] of Object.entries(value)) {
      if (IMAGE_FIELDS.has(key) || isReference(entry)) visit(value, key);
      else if (entry && typeof entry === "object") imageSlots(entry, visit);
    }
  }

  function assetIds(bundle) {
    const ids = new Set();
    imageSlots(bundle, (object, key) => {
      const value = object[key];
      if (value === null || value === undefined || value === "") return;
      if (!isReference(value)) throw new Error("Et billede mangler en permanent asset-reference. Importér billedet og gem igen.");
      if (value.assetId) ids.add(value.assetId);
    });
    return [...ids];
  }

  function createClient({ apiBase, pageUrl, fetch: request = globalThis.fetch, onStatus = () => {} }) {
    const base = apiBase.replace(/\/+$/, "");
    const imported = new Map();
    const pending = new Set();
    const urlFor = (reference) => reference.assetId
      ? `${base}/api/assets/${reference.assetId}` : BUILTINS[reference.builtin];

    function referenceFor(value) {
      if (isReference(value)) return value;
      if (typeof value !== "string") return null;
      for (const [builtin, path] of Object.entries(BUILTINS)) {
        if (value === path || value === new URL(path, pageUrl).href) return { builtin };
      }
      try {
        const url = new URL(value, pageUrl);
        const api = new URL(base || "/", pageUrl);
        const match = url.pathname.match(/^\/api\/assets\/(img_[a-f0-9]{64})$/);
        if (url.origin === api.origin && match && !url.search && !url.hash) return { assetId: match[1] };
      } catch { /* A legacy filename will be imported below. */ }
      return null;
    }

    async function upload(input, source) {
      onStatus("Gemmer billedet i skyen…");
      let response;
      if (typeof input === "string" && /^https:\/\//i.test(input)) {
        response = await request(`${base}/api/assets`, {
          signal: AbortSignal.timeout(60000),
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: input, source: source || "web" }),
        });
      } else {
        let blob = input;
        if (typeof input === "string") {
          const local = await request(new URL(input, pageUrl).href);
          if (!local.ok) throw new Error("Det gamle billede kunne ikke hentes. Vælg billedfilen igen.");
          blob = await local.blob();
        }
        if (!(blob instanceof Blob) || !blob.size || blob.size > 12 * 1024 * 1024) {
          throw new Error("Vælg en billedfil på højst 12 MB.");
        }
        response = await request(`${base}/api/assets?source=${encodeURIComponent(source || "upload")}`, {
          signal: AbortSignal.timeout(60000),
          method: "POST", headers: { "Content-Type": blob.type || "application/octet-stream" }, body: blob,
        });
      }
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !ASSET_ID.test(result.assetId || "")) {
        throw new Error(result.error || "Billedet kunne ikke gemmes i skyen. Prøv igen; dit tidligere billede er bevaret.");
      }
      onStatus("Billedet er gemt i skyen.");
      return { assetId: result.assetId };
    }

    async function importReference(input, source) {
      const existing = referenceFor(input);
      if (existing) return existing;
      if (typeof input === "string" && imported.has(input)) return imported.get(input);
      const operation = upload(input, source);
      pending.add(operation);
      if (typeof input === "string") imported.set(input, operation);
      try { return await operation; }
      catch (error) { imported.delete(input); throw error; }
      finally { pending.delete(operation); }
    }

    async function prepareBundle(bundle) {
      await Promise.all([...pending]);
      const copy = JSON.parse(JSON.stringify(bundle));
      copy.version = 3;
      for (const track of copy.tracks || []) {
        for (const kind of ["track", "figure"]) {
          const field = `${kind}ImageData`;
          const configField = `${kind}Image`;
          const value = track[field] || track.config[configField] || { builtin: `default-${kind}` };
          const ref = await importReference(value);
          track[field] = ref;
          track.config[configField] = ref;
        }
        for (const frame of track.config.pro?.frames || []) {
          // imagePath used to be both a fallback URL and the display filename.
          if (!frame.imageData && frame.imagePath) frame.imageData = frame.imagePath;
          frame.imagePath = "";
        }
      }
      const slots = [];
      imageSlots(copy, (object, key) => { if (object[key]) slots.push([object, key]); });
      for (const [object, key] of slots) object[key] = await importReference(object[key]);
      assetIds(copy);
      return copy;
    }

    function hydrate(bundle) {
      const copy = JSON.parse(JSON.stringify(bundle));
      imageSlots(copy, (object, key) => {
        const value = object[key];
        if (isReference(value)) object[key] = urlFor(value);
        else if (typeof value === "string" && value.startsWith("/api/")) object[key] = `${base}${value}`;
      });
      return copy;
    }

    function serializeKnown(bundle) {
      const copy = JSON.parse(JSON.stringify(bundle));
      imageSlots(copy, (object, key) => {
        const reference = referenceFor(object[key]);
        if (reference) object[key] = reference;
      });
      return copy;
    }

    return {
      importImage: async (input, source) => urlFor(await importReference(input, source)),
      prepareBundle, hydrate, serializeKnown, referenceFor, urlFor,
      whenIdle: () => Promise.all([...pending]),
    };
  }

  globalThis.TegneSpilAssets = Object.freeze({ ASSET_ID, BUILTINS, isReference, imageSlots, assetIds, createClient });
})();
