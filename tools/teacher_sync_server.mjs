import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.resolve(process.env.TEGNE_SPIL_DATA || path.join(projectRoot, "Klasser"));
const host = process.env.TEGNE_SPIL_HOST || "0.0.0.0";
const port = Number(process.env.TEGNE_SPIL_PORT || 8787);
// A saved game may contain several student drawings as data URLs. Keep a
// generous limit while still bounding the request that the teacher computer
// will accept.
const maxGameBytes = 64 * 1024 * 1024;
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
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
  if (value === null || value === undefined || value === "") return;
  if (typeof value !== "string" || value.length > 8 * 1024 * 1024) {
    throw new Error(`${fieldName} er ugyldig eller for stort.`);
  }
  if (/^data:image\/svg\+xml/i.test(value) || /^javascript:/i.test(value)) {
    throw new Error(`${fieldName} må ikke indeholde script eller SVG.`);
  }
  if (/^data:image\/(?:png|jpe?g|webp);base64,/i.test(value)) return;
  if (/^(?:https?:\/\/|\/|[A-Za-z0-9_.~%+:/?&=-]+$)/.test(value)) return;
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

async function listBackgrounds(classId) {
  const backgroundsRoot = path.join(dataRoot, classId, "Baggrunde");
  try {
    const entries = await fs.readdir(backgroundsRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && allowedImageExtensions.has(path.extname(entry.name).toLowerCase()))
      .sort((left, right) => left.name.localeCompare(right.name, "da", { sensitivity: "base" }))
      .map((entry) => ({
        id: entry.name,
        name: entry.name,
        url: `/api/classes/${encodeURIComponent(classId)}/backgrounds/${encodeURIComponent(entry.name)}`,
      }));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
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
  const parts = parsedUrl.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
  if (parts[0] !== "api") return false;
  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders());
    response.end();
    return true;
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
  if (parts.length === 4 && parts[3] === "backgrounds" && request.method === "GET") {
    sendJson(response, 200, { backgrounds: await listBackgrounds(classId) });
    return true;
  }
  if (parts[3] === "backgrounds" && parts.length === 5 && request.method === "GET") {
    const fileName = parts[4];
    if (fileName.includes("/") || !allowedImageExtensions.has(path.extname(fileName).toLowerCase())) {
      sendText(response, 400, "Ugyldigt baggrundsbillede.");
      return true;
    }
    const filePath = path.resolve(classRoot, "Baggrunde", fileName);
    if (!insideRoot(path.resolve(classRoot, "Baggrunde"), filePath)) {
      sendText(response, 400, "Ugyldig sti.");
      return true;
    }
    try {
      const details = await fs.stat(filePath);
      if (!details.isFile()) throw new Error("not-file");
      response.writeHead(200, {
        ...corsHeaders(),
        "Content-Type": mimeTypes.get(path.extname(fileName).toLowerCase()),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      });
      createReadStream(filePath).pipe(response);
    } catch {
      sendText(response, 404, "Baggrundsbilledet findes ikke.");
    }
    return true;
  }
  if (parts[3] !== "games") {
    sendJson(response, 404, { error: "API-stien findes ikke." });
    return true;
  }
  const studentId = safeStudentId(parts[4]);
  if (!studentId || (parts.length !== 5 && !(parts.length === 6 && parts[5] === "download"))) {
    sendJson(response, 400, { error: "Ugyldigt elevnavn." });
    return true;
  }
  const gamesRoot = path.join(classRoot, "Spil");
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
  console.log("Opret fx Klasser\\4A\\Baggrunde og Klasser\\4A\\Spil for at begynde.");
});
