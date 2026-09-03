import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "../src/asset-pipeline.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.resolve(process.env.TEGNE_SPIL_DATA || path.join(projectRoot, "Klasser"));
const host = process.env.TEGNE_SPIL_HOST || "0.0.0.0";
const port = Number(process.env.TEGNE_SPIL_PORT || 8787);
// A saved game may contain several student drawings as data URLs. Keep a
// generous limit while still bounding the request that the teacher computer
// will accept.
const maxGameBytes = 64 * 1024 * 1024;
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const libraryKinds = new Map([
  ["tracks", { directory: "Baner", extensions: allowedImageExtensions }],
  ["figures", { directory: "Figurer", extensions: allowedImageExtensions }],
]);
const maxLibraryEntries = 5000;
const maxLibraryDepth = 16;
const allowedStaticRoots = new Set(["src", "Configs", "Tracks", "Figures", "Music", "Spil", "assets"]);
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"],
  [".gif", "image/gif"],
  [".mp3", "audio/mpeg"],
  [".dgm", "application/json; charset=utf-8"],
]);

function safeSegment(value) {
  const decoded = String(value || "");
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,47}$/.test(decoded) ? decoded : null;
}

function safeStudentId(value) {
  const normalized = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return safeSegment(normalized);
}

function insideRoot(root, target) {
  const relative = path.relative(root, target);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function safeLibrarySegment(value) {
  const segment = String(value || "");
  if (!segment || segment === "." || segment === ".." || segment.length > 128) return false;
  if (/[/\\\0]/.test(segment) || /[<>:"|?*]/.test(segment)) return false;
  if (/[\u0000-\u001f\u007f]/.test(segment) || /[. ]$/.test(segment)) return false;
  return true;
}

function safeLibraryId(value) {
  const id = String(value || "");
  if (!id || id.length > 1024 || id.includes("\\")) return null;
  const segments = id.split("/");
  if (segments.some((segment) => !safeLibrarySegment(segment))) return null;
  return segments.join("/");
}

function libraryFileUrl(classId, kind, id) {
  const params = new URLSearchParams({ class: classId, kind, id });
  return `/api/library/file?${params.toString()}`;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.TEGNE_SPIL_ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
  };
}

function sendJson(response, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    ...corsHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  response.end(body);
}

function sendText(response, status, message) {
  response.writeHead(status, {
    ...corsHeaders(),
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(message);
}

async function readBody(request) {
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > maxGameBytes) throw new Error("Spillet er for stort.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function validateImageSource(value, fieldName) {
  if (globalThis.TegneSpilAssets.isReference(value)) return;
  if (value === null || value === undefined || value === "") return;
  if (typeof value !== "string" || value.length > 8 * 1024 * 1024) {
    throw new Error(`${fieldName} er ugyldig eller for stort.`);
  }
  if (/^data:image\/svg\+xml/i.test(value) || /^javascript:/i.test(value)) {
    throw new Error(`${fieldName} må ikke indeholde script eller SVG.`);
  }
  if (/^data:image\/(?:png|jpe?g|webp);base64,/i.test(value)) return;
  if (/^(?:https?:\/\/|\/|[A-Za-z0-9_.~%+:/?&=-]+$)/.test(value)) return;
  // Older locally saved games can refer to bundled images whose filenames
  // contain spaces (for example "Tracks/track_1 - Kopi.JPEG"). These are
  // still plain relative image paths, never executable content.
  if (/^[A-Za-z0-9][A-Za-z0-9 _./()%-]*$/.test(value)
    && !value.split("/").some((part) => part === ".." || part === ".")) return;
  throw new Error(`${fieldName} har en ugyldig billedadresse.`);
}

function scanJson(value, depth = 0) {
  if (depth > 24) throw new Error("Spillet har for mange indlejrede niveauer.");
  if (typeof value === "string") {
    if (value.length > 8 * 1024 * 1024) throw new Error("En tekstværdi er for stor.");
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 50000) throw new Error("Spillet indeholder for mange elementer.");
    value.forEach((entry) => scanJson(entry, depth + 1));
    return;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length > 200) throw new Error("Spillet indeholder for mange felter.");
    keys.forEach((key) => {
      if (key.startsWith("__")) throw new Error("Spillet indeholder et ugyldigt felt.");
      scanJson(value[key], depth + 1);
    });
  }
}

function validateBundle(bundle) {
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) {
    throw new Error("Spillet skal være et objekt.");
  }
  if (!Array.isArray(bundle.tracks) || bundle.tracks.length < 1 || bundle.tracks.length > 64) {
    throw new Error("Spillet skal indeholde mellem 1 og 64 baner.");
  }
  scanJson(bundle);
  bundle.tracks.forEach((track, index) => {
    if (!track || typeof track !== "object" || !track.config || typeof track.config !== "object") {
      throw new Error(`Bane ${index + 1} har et ugyldigt format.`);
    }
    validateImageSource(track.trackImageData, `Baggrund på bane ${index + 1}`);
    validateImageSource(track.figureImageData, `Figur på bane ${index + 1}`);
    validateImageSource(track.config.trackImage, `Baggrundsreference på bane ${index + 1}`);
    validateImageSource(track.config.figureImage, `Figurreference på bane ${index + 1}`);
  });
  return bundle;
}

async function listClassFolders() {
  await fs.mkdir(dataRoot, { recursive: true });
  const entries = await fs.readdir(dataRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && safeSegment(entry.name))
    .map((entry) => ({ id: entry.name, name: entry.name }))
    .sort((left, right) => left.name.localeCompare(right.name, "da", { sensitivity: "base" }));
}

async function listLibraryFiles(classId, kind) {
  const libraryKind = libraryKinds.get(kind);
  const libraryRoot = path.resolve(dataRoot, classId, libraryKind.directory);
  const files = [];

  async function visit(directory, relativeDirectory, depth) {
    if (depth > maxLibraryDepth) throw new Error("Biblioteket har for mange undermappeniveauer.");
    let entries;
    try {
      entries = await fs.readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    entries.sort((left, right) => left.name.localeCompare(right.name, "da", { sensitivity: "base" }));
    for (const entry of entries) {
      if (!safeLibrarySegment(entry.name)) continue;
      const relativeId = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      const entryPath = path.resolve(directory, entry.name);
      if (!insideRoot(libraryRoot, entryPath)) continue;
      if (entry.isDirectory()) {
        await visit(entryPath, relativeId, depth + 1);
        continue;
      }
      if (!entry.isFile() || !libraryKind.extensions.has(path.extname(entry.name).toLowerCase())) continue;
      const details = await fs.stat(entryPath);
      if (files.length >= maxLibraryEntries) throw new Error("Biblioteket indeholder for mange filer.");
      files.push({
        id: relativeId,
        name: entry.name,
        displayName: relativeId,
        url: libraryFileUrl(classId, kind, relativeId),
        type: mimeTypes.get(path.extname(entry.name).toLowerCase()) || "application/octet-stream",
        size: details.size,
      });
    }
  }

  await visit(libraryRoot, "", 0);
  return files;
}

async function listClassLibrary(classId) {
  const [tracks, figures] = await Promise.all([
    listLibraryFiles(classId, "tracks"),
    listLibraryFiles(classId, "figures"),
  ]);
  return { tracks, figures };
}

async function serveLibraryFile(response, classId, kind, id) {
  const libraryKind = libraryKinds.get(kind);
  const safeId = safeLibraryId(id);
  if (!safeId) {
    sendJson(response, 400, { error: "Ugyldigt biblioteks-id." });
    return;
  }
  const extension = path.extname(safeId).toLowerCase();
  if (!libraryKind.extensions.has(extension)) {
    sendJson(response, 400, { error: "Filtypen understøttes ikke i dette bibliotek." });
    return;
  }
  const libraryRoot = path.resolve(dataRoot, classId, libraryKind.directory);
  const filePath = path.resolve(libraryRoot, ...safeId.split("/"));
  if (!insideRoot(libraryRoot, filePath)) {
    sendJson(response, 400, { error: "Ugyldig bibliotekssti." });
    return;
  }
  let details;
  try {
    details = await fs.lstat(filePath);
    if (!details.isFile()) throw new Error("not-file");
  } catch (error) {
    if (error.code === "ENOENT") sendJson(response, 404, { error: "Biblioteksfilen findes ikke." });
    else sendJson(response, 404, { error: "Biblioteksfilen kunne ikke læses." });
    return;
  }
  response.writeHead(200, {
    ...corsHeaders(),
    "Content-Type": mimeTypes.get(extension) || "application/octet-stream",
    "Content-Length": details.size,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  createReadStream(filePath).on("error", () => {
    if (!response.headersSent) sendText(response, 404, "Biblioteksfilen kunne ikke læses.");
    else response.end();
  }).pipe(response);
}

async function handleLibraryApi(request, response, parsedUrl, isFileRoute) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Biblioteket understøtter kun GET." }, { Allow: "GET" });
    return true;
  }
  const expectedKeys = new Set(isFileRoute ? ["class", "kind", "id"] : ["class", "kind"]);
  if ([...parsedUrl.searchParams.keys()].some((key) => !expectedKeys.has(key))) {
    sendJson(response, 400, { error: "Ugyldige biblioteksparametre." });
    return true;
  }
  const classValues = parsedUrl.searchParams.getAll("class");
  const kindValues = parsedUrl.searchParams.getAll("kind");
  const classId = classValues.length === 1 ? safeSegment(classValues[0]) : null;
  const kind = kindValues.length === 1 ? kindValues[0] : null;
  if (!classId || !libraryKinds.has(kind)) {
    sendJson(response, 400, { error: "Ugyldig klasse eller bibliotekstype." });
    return true;
  }
  if (isFileRoute) {
    const idValues = parsedUrl.searchParams.getAll("id");
    if (idValues.length !== 1) {
      sendJson(response, 400, { error: "Biblioteksfilen mangler et id." });
      return true;
    }
    await serveLibraryFile(response, classId, kind, idValues[0]);
    return true;
  }
  const classRoot = path.join(dataRoot, classId);
  try {
    const details = await fs.stat(classRoot);
    if (!details.isDirectory()) throw new Error("not-directory");
  } catch {
    sendJson(response, 404, { error: "Klassen findes ikke endnu." });
    return true;
  }
  try {
    sendJson(response, 200, { class: classId, kind, files: await listLibraryFiles(classId, kind) });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Biblioteket kunne ikke læses." });
  }
  return true;
}

async function handleClassLibraryApi(request, response, classId) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Biblioteket understøtter kun GET." }, { Allow: "GET" });
    return true;
  }
  const safeClassId = safeSegment(classId);
  if (!safeClassId) {
    sendJson(response, 400, { error: "Ugyldig klasse." });
    return true;
  }
  const classRoot = path.join(dataRoot, safeClassId);
  try {
    const details = await fs.stat(classRoot);
    if (!details.isDirectory()) throw new Error("not-directory");
  } catch {
    sendJson(response, 404, { error: "Klassen findes ikke endnu." });
    return true;
  }
  try {
    sendJson(response, 200, await listClassLibrary(safeClassId));
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Biblioteket kunne ikke læses." });
  }
  return true;
}

async function serveStatic(response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendText(response, 400, "Ugyldig sti.");
    return;
  }
  if (decodedPath === "/online/") {
    response.writeHead(302, { Location: "/online", ...corsHeaders(), "Cache-Control": "no-store" });
    response.end();
    return;
  }
  const requested = decodedPath === "/" || decodedPath === "/online"
    ? "index.html"
    : decodedPath.replace(/^\/online\//, "").replace(/^\//, "");
  const [rootName] = requested.split(/[\\/]/);
  if (requested !== "index.html" && !allowedStaticRoots.has(rootName)) {
    sendText(response, 404, "Ikke fundet.");
    return;
  }
  const target = path.resolve(projectRoot, requested);
  if (!insideRoot(projectRoot, target)) {
    sendText(response, 400, "Ugyldig sti.");
    return;
  }
  let details;
  try {
    details = await fs.stat(target);
  } catch (error) {
    if (error.code === "ENOENT") sendText(response, 404, "Ikke fundet.");
    else sendText(response, 500, "Filen kunne ikke læses.");
    return;
  }
  if (!details.isFile()) {
    sendText(response, 404, "Ikke fundet.");
    return;
  }
  const extension = path.extname(target).toLowerCase();
  response.writeHead(200, {
    ...corsHeaders(),
    "Content-Type": mimeTypes.get(extension) || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  createReadStream(target).pipe(response);
}

async function handleApi(request, response, parsedUrl) {
  let parts;
  try {
    parts = parsedUrl.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
  } catch {
    sendJson(response, 400, { error: "Ugyldig API-sti." });
    return true;
  }
  if (parts[0] !== "api") return false;
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders());
    response.end();
    return true;
  }
  if (parts.length === 2 && parts[1] === "library") {
    return handleLibraryApi(request, response, parsedUrl, false);
  }
  if (parts.length === 3 && parts[1] === "library" && parts[2] === "file") {
    return handleLibraryApi(request, response, parsedUrl, true);
  }
  if (parts.length === 4 && parts[1] === "classes" && parts[3] === "library") {
    return handleClassLibraryApi(request, response, parts[2]);
  }
  if (parts.length === 2 && parts[1] === "classes" && request.method === "GET") {
    sendJson(response, 200, { classes: await listClassFolders() });
    return true;
  }
  const classId = safeSegment(parts[2]);
  if (!classId) {
    sendJson(response, 400, { error: "Ugyldig klasse." });
    return true;
  }
  const classRoot = path.join(dataRoot, classId);
  try {
    const classDetails = await fs.stat(classRoot);
    if (!classDetails.isDirectory()) throw new Error("Klassen findes ikke.");
  } catch {
    sendJson(response, 404, { error: "Klassen findes ikke endnu." });
    return true;
  }
  if (parts[3] !== "games") {
    sendJson(response, 404, { error: "API-stien findes ikke." });
    return true;
  }
  const gamesRoot = path.join(classRoot, "Spil");
  if (parts.length === 4 && request.method === "GET") {
    try {
      const entries = await fs.readdir(gamesRoot, { withFileTypes: true });
      const games = (await Promise.all(entries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".dgm"))
        .map(async (entry) => {
          const studentId = entry.name.slice(0, -4);
          if (safeStudentId(studentId) !== studentId) return null;
          const details = await fs.stat(path.join(gamesRoot, entry.name));
          return { studentId, file: entry.name, updatedAt: details.mtime.toISOString() };
        }))).filter(Boolean)
        .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt) || first.studentId.localeCompare(second.studentId));
      sendJson(response, 200, { games });
    } catch (error) {
      if (error.code === "ENOENT") sendJson(response, 200, { games: [] });
      else sendJson(response, 500, { error: "Spillisten kunne ikke læses." });
    }
    return true;
  }
  const studentId = safeStudentId(parts[4]);
  if (!studentId || (parts.length !== 5 && !(parts.length === 6 && parts[5] === "download"))) {
    sendJson(response, 400, { error: "Ugyldigt elevnavn." });
    return true;
  }
  const gamePath = path.resolve(gamesRoot, `${studentId}.dgm`);
  if (!insideRoot(path.resolve(gamesRoot), gamePath)) {
    sendJson(response, 400, { error: "Ugyldig filsti." });
    return true;
  }
  if (request.method === "GET") {
    try {
      const body = await fs.readFile(gamePath, "utf8");
      if (parts.length === 6) {
        response.writeHead(200, {
          ...corsHeaders(),
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${studentId}.dgm"`,
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store",
        });
        response.end(body);
      } else {
        sendJson(response, 200, JSON.parse(body));
      }
    } catch (error) {
      if (error.code === "ENOENT") sendJson(response, 404, { error: "Der er ikke gemt et spil med dette navn endnu." });
      else sendJson(response, 500, { error: "Det gemte spil kunne ikke læses." });
    }
    return true;
  }
  if (request.method === "PUT" && parts.length === 5) {
    try {
      const bundle = validateBundle(JSON.parse(await readBody(request)));
      await fs.mkdir(gamesRoot, { recursive: true });
      const tempPath = `${gamePath}.${process.pid}.tmp`;
      await fs.writeFile(tempPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
      await fs.rename(tempPath, gamePath);
      sendJson(response, 200, { saved: true, file: `${studentId}.dgm` });
    } catch (error) {
      sendJson(response, 400, { error: error.message || "Spillet kunne ikke gemmes." });
    }
    return true;
  }
  sendJson(response, 405, { error: "Metoden understøttes ikke." });
  return true;
}

const server = http.createServer(async (request, response) => {
  const parsedUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  try {
    if (parsedUrl.pathname.startsWith("/api/")) {
      await handleApi(request, response, parsedUrl);
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      sendText(response, 405, "Metoden understøttes ikke.");
      return;
    }
    await serveStatic(response, parsedUrl.pathname);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) sendText(response, 500, "Serverfejl.");
    else response.end();
  }
});

await fs.mkdir(dataRoot, { recursive: true });
server.listen(port, host, () => {
  console.log(`Tegne Spil online-server kører på http://localhost:${port}/online`);
  console.log(`Klassemapper: ${dataRoot}`);
  console.log("Opret fx Klasser\\4A\\Baner, Klasser\\4A\\Figurer og Klasser\\4A\\Spil for at begynde.");
});
