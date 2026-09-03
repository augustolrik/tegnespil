export const MAX_BUNDLE_BYTES = 1_800_000;
export const MAX_GAME_COUNT_PER_CLASS = 80;
import "../../src/asset-pipeline.js";

export function safeSegment(value) {
  if (typeof value !== "string") return null;
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,47}$/.test(value) ? value : null;
}

export function safeStudentId(value) {
  if (typeof value !== "string") return null;
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return safeSegment(normalized);
}

export function requirePin(value) {
  const pin = String(value || "").trim();
  if (!/^\d{4}$/.test(pin)) throw new Error("Skriv en 4-cifret kode.");
  return pin;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function scanJson(value, depth = 0) {
  if (depth > 24) throw new Error("Spillet har for mange indlejrede niveauer.");
  if (value === null || typeof value === "boolean" || typeof value === "number") return;
  if (typeof value === "string") {
    if (value.length > 200_000) throw new Error("En tekstværdi er for stor.");
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 50_000) throw new Error("Spillet indeholder for mange elementer.");
    value.forEach((entry) => scanJson(entry, depth + 1));
    return;
  }
  if (!isPlainObject(value)) throw new Error("Spillet indeholder en ugyldig værdi.");
  const keys = Object.keys(value);
  if (keys.length > 200) throw new Error("Spillet indeholder for mange felter.");
  for (const key of keys) {
    if (key.startsWith("__")) throw new Error("Spillet indeholder et ugyldigt felt.");
    scanJson(value[key], depth + 1);
  }
}

export function validateBundle(bundle, rawBytes) {
  if (!Number.isInteger(rawBytes) || rawBytes < 2 || rawBytes > MAX_BUNDLE_BYTES) {
    throw new Error("Spillet er for stort til onlinelagring. Fjern store billeder og prøv igen.");
  }
  if (!isPlainObject(bundle)) throw new Error("Spillet skal være et objekt.");
  if (bundle.version !== 3) throw new Error("Opdatér TegneSpil og gem igen, så alle billeder kommer med.");
  if (!Array.isArray(bundle.tracks) || bundle.tracks.length < 1 || bundle.tracks.length > 64) {
    throw new Error("Spillet skal indeholde mellem 1 og 64 baner.");
  }
  scanJson(bundle);
  bundle.tracks.forEach((track, index) => {
    if (!isPlainObject(track) || !isPlainObject(track.config)) {
      throw new Error(`Bane ${index + 1} har et ugyldigt format.`);
    }
    for (const field of ["trackImage", "figureImage"]) {
      if (!globalThis.TegneSpilAssets.isReference(track.config[field])) {
        throw new Error(`Bane ${index + 1} mangler en permanent billedreference.`);
      }
    }
  });
  globalThis.TegneSpilAssets.assetIds(bundle);
  return bundle;
}
