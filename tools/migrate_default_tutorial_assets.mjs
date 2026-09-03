import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "../src/asset-pipeline.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tutorialPath = path.join(projectRoot, "Spil", "Toturial_ny.dgm");
const temporaryPath = `${tutorialPath}.tmp`;
const apiBase = "https://tegnespil-api.augustolrik.workers.dev";
const imageFields = new Set(["trackImageData", "figureImageData", "trackImage", "figureImage", "imageData", "imagePath"]);

function imageSlots(value, slots = []) {
  if (!value || typeof value !== "object") return slots;
  for (const [key, entry] of Object.entries(value)) {
    if (imageFields.has(key)) slots.push([value, key]);
    else if (entry && typeof entry === "object") imageSlots(entry, slots);
  }
  return slots;
}

function dataUrlToImage(value) {
  const match = String(value).match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (!bytes.length || bytes.length > 12 * 1024 * 1024) {
    throw new Error("Et tutorial-billede er tomt eller større end 12 MB.");
  }
  return { mimeType: match[1], bytes };
}

async function uploadImage(value, uploads) {
  if (globalThis.TegneSpilAssets.isReference(value)) return value;
  const image = dataUrlToImage(value);
  if (!image) throw new Error("Tutorialspillet indeholder et billede uden en permanent reference eller data-URL.");
  const fingerprint = createHash("sha256").update(image.bytes).digest("hex");
  if (!uploads.has(fingerprint)) {
    uploads.set(fingerprint, (async () => {
      const response = await fetch(`${apiBase}/api/assets?source=upload`, {
        method: "POST",
        headers: {
          "Content-Type": image.mimeType,
          Origin: "https://augustolrik.github.io",
        },
        body: image.bytes,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !globalThis.TegneSpilAssets.ASSET_ID.test(result.assetId || "")) {
        throw new Error(result.error || "Tutorial-billedet kunne ikke gemmes i R2.");
      }
      return { assetId: result.assetId };
    })());
  }
  return uploads.get(fingerprint);
}

const tutorial = JSON.parse(await readFile(tutorialPath, "utf8"));
for (const track of tutorial.tracks || []) {
  for (const frame of track.config?.pro?.frames || []) {
    if (!frame.imageData && frame.imagePath) frame.imageData = frame.imagePath;
    frame.imagePath = "";
  }
}

const uploads = new Map();
for (const [object, key] of imageSlots(tutorial)) {
  if (object[key]) object[key] = await uploadImage(object[key], uploads);
}
tutorial.version = 3;
globalThis.TegneSpilAssets.assetIds(tutorial);

await writeFile(temporaryPath, `${JSON.stringify(tutorial, null, 2)}\n`);
await rename(temporaryPath, tutorialPath);
console.log(`Tutorial klar: ${uploads.size} unikke billeder er gemt i R2.`);
