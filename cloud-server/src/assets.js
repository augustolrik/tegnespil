import "../../src/asset-pipeline.js";

const { ASSET_ID, assetIds } = globalThis.TegneSpilAssets;
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const ASSET_STORAGE_LIMIT_BYTES = 9_600_000_000;
const SOURCE_NAMES = new Set(["photodrop", "upload", "web"]);
const keyFor = (id) => `images/${id}.webp`;

export async function readBytes(message, limit = MAX_IMAGE_BYTES) {
  if (Number(message.headers.get("Content-Length")) > limit) throw new Error("Billedet er for stort (højst 12 MB).");
  if (!message.body) throw new Error("Billedet er tomt.");
  const reader = message.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw new Error("Billedet er for stort (højst 12 MB).");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  if (!size) throw new Error("Billedet er tomt.");
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

export function publicImageUrl(value) {
  if (typeof value !== "string" || value.length > 2048) throw new Error("Billedadressen er ugyldig.");
  const url = new URL(value);
  const host = url.hostname.replace(/\.$/, "").toLowerCase();
  // Only public HTTPS hostnames. Reject IP literals (including URL-normalized
  // decimal/octal addresses), credentials, local names and unusual ports.
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")
      || !host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":")
      || /(?:^|\.)(?:localhost|local|internal|test|invalid|lan|home|arpa)$/.test(host)) {
    throw new Error("Brug en offentlig HTTPS-adresse til et billede.");
  }
  url.hash = "";
  return url.href;
}

async function downloadImage(input, request) {
  let url = publicImageUrl(input);
  const signal = AbortSignal.timeout(15000);
  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const response = await request(url, { redirect: "manual", signal, headers: { Accept: "image/*" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await response.body?.cancel();
      const location = response.headers.get("Location");
      if (!location) throw new Error("Billedadressen viderestiller uden en ny adresse.");
      url = publicImageUrl(new URL(location, url).href);
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error("Webstedet tillader ikke, at billedet hentes. Download billedet og vælg filen i stedet.");
    }
    return readBytes(response);
  }
  throw new Error("Billedadressen viderestiller for mange gange.");
}

function rasterSignature(bytes) {
  const start = [...bytes.slice(0, 12)];
  const text = String.fromCharCode(...start);
  return (start[0] === 0xff && start[1] === 0xd8 && start[2] === 0xff)
    || (text.startsWith("\x89PNG\r\n\x1a\n"))
    || (text.startsWith("RIFF") && text.slice(8) === "WEBP")
    || text.startsWith("GIF87a") || text.startsWith("GIF89a");
}

async function reserveStorage(env, assetId, byteLength) {
  try {
    const result = await env.DB.prepare(
      "INSERT OR IGNORE INTO stored_assets (asset_id, byte_length, created_at) VALUES (?, ?, ?)",
    ).bind(assetId, byteLength, new Date().toISOString()).run();
    return Number(result.meta?.changes || 0) > 0;
  } catch (error) {
    if (String(error.message || error).includes("ASSET_STORAGE_LIMIT")) {
      throw new Error("Billedlageret er næsten fyldt (9,6 GB). Nye billeder kan ikke gemmes, før læreren frigør plads.");
    }
    throw error;
  }
}

async function releaseStorageReservation(env, assetId) {
  await env.DB.prepare("DELETE FROM stored_assets WHERE asset_id = ?").bind(assetId).run();
}

export async function importAsset(request, env, fetchImage = fetch) {
  if (!env.ASSETS || !env.IMAGES) throw new Error("Billedlageret er ikke klar på serveren. Prøv igen senere.");
  const type = (request.headers.get("Content-Type") || "").split(";")[0].toLowerCase();
  let source = new URL(request.url).searchParams.get("source") || "upload";
  let originalUrl = "";
  let bytes;
  if (type === "application/json") {
    const input = JSON.parse(new TextDecoder().decode(await readBytes(request, 4096)));
    source = input.source || "web";
    originalUrl = publicImageUrl(input.url);
    if (!SOURCE_NAMES.has(source)) throw new Error("Ukendt billedkilde.");
    bytes = await downloadImage(originalUrl, fetchImage);
  } else {
    if (!SOURCE_NAMES.has(source)) throw new Error("Ukendt billedkilde.");
    bytes = await readBytes(request);
  }
  if (!rasterSignature(bytes)) throw new Error("Vælg et rigtigt JPG-, PNG-, WebP- eller GIF-billede. SVG og andre filer understøttes ikke.");
  const info = await env.IMAGES.info(new Blob([bytes]).stream());
  if (!info.width || !info.height || info.width * info.height > 40_000_000) throw new Error("Billedets opløsning er for stor (højst 40 megapixel).");
  const scale = Math.min(1, 4096 / Math.max(info.width, info.height));
  const width = Math.max(1, Math.round(info.width * scale));
  const height = Math.max(1, Math.round(info.height * scale));
  const output = await env.IMAGES.input(new Blob([bytes]).stream())
    .transform({ width, height, fit: "contain" })
    .output({ format: "image/webp", quality: 90, anim: false });
  const processed = await readBytes(output.response());
  const hash = await crypto.subtle.digest("SHA-256", processed);
  const id = `img_${[...new Uint8Array(hash)].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  const key = keyFor(id);
  // Content-addressed, immutable bytes. Re-imports reuse the original metadata.
  if (!await env.ASSETS.head(key)) {
    const reserved = await reserveStorage(env, id, processed.byteLength);
    try {
      const saved = await env.ASSETS.put(key, processed, {
        httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" },
        customMetadata: { source, originalUrl, width: String(width), height: String(height), createdAt: new Date().toISOString() },
      });
      if (!saved) throw new Error("Billedet kunne ikke gemmes. Prøv igen.");
    } catch (error) {
      if (reserved) await releaseStorageReservation(env, id);
      throw error;
    }
  }
  return { assetId: id, width, height };
}

export async function storageUsage(env) {
  const row = await env.DB.prepare("SELECT used_bytes FROM asset_storage WHERE id = 1").first();
  const usedBytes = Number(row?.used_bytes || 0);
  return { usedBytes, limitBytes: ASSET_STORAGE_LIMIT_BYTES, remainingBytes: Math.max(0, ASSET_STORAGE_LIMIT_BYTES - usedBytes) };
}

export async function readAsset(id, env, headers) {
  if (!ASSET_ID.test(id) || !env.ASSETS) return new Response("Billedet findes ikke.", { status: 404, headers });
  const object = await env.ASSETS.get(keyFor(id));
  if (!object) return new Response("Billedet findes ikke.", { status: 404, headers });
  return new Response(object.body, { headers: {
    ...headers, "Content-Type": "image/webp", "Content-Length": String(object.size),
    "Cache-Control": "public, max-age=31536000, immutable", ETag: object.httpEtag,
    "X-Content-Type-Options": "nosniff", "Cross-Origin-Resource-Policy": "cross-origin",
  } });
}

export async function assertAssetsExist(bundle, env) {
  for (const id of assetIds(bundle)) {
    if (!env.ASSETS || !await env.ASSETS.head(keyFor(id))) {
      throw new Error("Et billede mangler i cloud-lageret. Spillet blev ikke gemt. Importér billedet igen.");
    }
  }
}
