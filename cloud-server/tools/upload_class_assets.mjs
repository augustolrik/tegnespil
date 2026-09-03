/* Uploads existing local class-library files through the same public asset
 * endpoint used by the browser, then registers immutable asset IDs in D1. */
import { readdir, readFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const classesRoot = path.join(root, "Klasser");
const workerUrl = String(process.env.TEGNESPIL_API_URL || "https://tegnespil-api.augustolrik.workers.dev").replace(/\/+$/, "");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const mimeByExtension = new Map([[".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".png", "image/png"], [".webp", "image/webp"], [".gif", "image/gif"]]);

async function filesIn(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch { return []; }
  return entries.filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()));
}

function runWrangler(args) {
  const cli = path.join(root, "cloud-server", "node_modules", "wrangler", "bin", "wrangler.js");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: path.join(root, "cloud-server"), stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`Wrangler sluttede med kode ${code}.`)));
  });
}

function sql(value) { return `'${String(value).replaceAll("'", "''")}'`; }

async function uploadOne(classId, kind, folder, entry) {
  const filePath = path.join(classesRoot, classId, folder, entry.name);
  const bytes = await readFile(filePath);
  const response = await fetch(`${workerUrl}/api/assets?source=upload`, {
    method: "POST",
    headers: { Origin: "https://augustolrik.github.io", "Content-Type": mimeByExtension.get(path.extname(entry.name).toLowerCase()) },
    body: bytes,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !/^img_[a-f0-9]{64}$/.test(payload.assetId || "")) {
    throw new Error(`${classId}/${folder}/${entry.name}: ${payload.error || "upload fejlede"}`);
  }
  const statement = `INSERT INTO class_assets (class_id, kind, asset_id, name, created_at) VALUES (${sql(classId)}, ${sql(kind)}, ${sql(payload.assetId)}, ${sql(entry.name)}, ${sql(new Date().toISOString())}) ON CONFLICT(class_id, kind, name) DO UPDATE SET asset_id = excluded.asset_id, created_at = excluded.created_at`;
  await runWrangler(["d1", "execute", "tegnespil", "--remote", "--command", statement]);
  console.log(`✓ ${classId} ${kind}: ${entry.name}`);
}

const classEntries = await readdir(classesRoot, { withFileTypes: true });
let total = 0;
for (const classEntry of classEntries.filter((entry) => entry.isDirectory() && /^[A-Za-z0-9_-]+$/.test(entry.name))) {
  const classId = classEntry.name;
  for (const [folder, kind] of [["Baner", "track"], ["Figurer", "figure"], ["Figure", "figure"]]) {
    for (const entry of await filesIn(path.join(classesRoot, classId, folder))) {
      const details = await stat(path.join(classesRoot, classId, folder, entry.name));
      if (details.size > 12 * 1024 * 1024) throw new Error(`${classId}/${folder}/${entry.name} er større end 12 MB.`);
      await uploadOne(classId, kind, folder, entry);
      total += 1;
    }
  }
}
console.log(`Færdig: ${total} klassebilleder er lagt i R2 og registreret i D1.`);
