import {
  MAX_BUNDLE_BYTES,
  MAX_GAME_COUNT_PER_CLASS,
  requirePin,
  safeSegment,
  safeStudentId,
  validateBundle,
} from "./validation.js";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function allowedOrigins(env) {
  return new Set(String(env.ALLOWED_ORIGINS || "https://augustolrik.github.io")
    .split(",").map((value) => value.trim()).filter(Boolean));
}

function cors(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || !allowedOrigins(env).has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-TegneSpil-Pin",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

function json(request, env, status, payload) {
  return Response.json(payload, {
    status,
    headers: { ...cors(request, env), "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
}

function randomHex(byteLength = 16) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function pinHash(pin, salt) {
  return digest(`tegnespil-pin-v1:${salt}:${pin}`);
}

async function clientTag(request, env) {
  if (!env.RATE_LIMIT_SECRET) throw new Error("Serveren mangler sin rate-limit-hemmelighed.");
  return digest(`tegnespil-client-v1:${env.RATE_LIMIT_SECRET}:${clientIp(request)}`);
}

async function isLocked(db, classId, studentId, tag, now) {
  const attempt = await db.prepare(
    "SELECT window_started_at, attempts FROM pin_attempts WHERE class_id = ? AND student_id = ? AND client_tag = ?",
  ).bind(classId, studentId, tag).first();
  return attempt && now - attempt.window_started_at < WINDOW_MS && attempt.attempts >= MAX_FAILED_ATTEMPTS;
}

async function recordFailure(db, classId, studentId, tag, now) {
  const current = await db.prepare(
    "SELECT window_started_at, attempts FROM pin_attempts WHERE class_id = ? AND student_id = ? AND client_tag = ?",
  ).bind(classId, studentId, tag).first();
  if (!current || now - current.window_started_at >= WINDOW_MS) {
    await db.prepare(
      "INSERT OR REPLACE INTO pin_attempts (class_id, student_id, client_tag, window_started_at, attempts) VALUES (?, ?, ?, ?, 1)",
    ).bind(classId, studentId, tag, now).run();
    return;
  }
  await db.prepare(
    "UPDATE pin_attempts SET attempts = attempts + 1 WHERE class_id = ? AND student_id = ? AND client_tag = ?",
  ).bind(classId, studentId, tag).run();
}

async function clearFailures(db, classId, studentId, tag) {
  await db.prepare("DELETE FROM pin_attempts WHERE class_id = ? AND student_id = ? AND client_tag = ?")
    .bind(classId, studentId, tag).run();
}

async function readLimitedJsonText(request) {
  const declaredLength = Number(request.headers.get("Content-Length") || "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BUNDLE_BYTES) {
    throw new Error("Spillet er for stort til onlinelagring. Fjern store billeder og prøv igen.");
  }
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BUNDLE_BYTES) {
      await reader.cancel();
      throw new Error("Spillet er for stort til onlinelagring. Fjern store billeder og prøv igen.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function decodedPathSegment(value) {
  try { return decodeURIComponent(value); }
  catch { return null; }
}

async function assertKnownClass(db, classId) {
  const row = await db.prepare("SELECT id FROM classes WHERE id = ?").bind(classId).first();
  if (!row) throw new Response(JSON.stringify({ error: "Klassen findes ikke." }), { status: 404 });
}

async function readGame(request, env, classId, studentId) {
  const pin = requirePin(request.headers.get("X-TegneSpil-Pin"));
  const tag = await clientTag(request, env);
  const now = Date.now();
  if (await isLocked(env.DB, classId, studentId, tag, now)) {
    return json(request, env, 429, { error: "For mange forkerte forsøg. Vent 10 minutter og prøv igen." });
  }
  const game = await env.DB.prepare(
    "SELECT pin_salt, pin_hash, bundle_json, revision FROM games WHERE class_id = ? AND student_id = ?",
  ).bind(classId, studentId).first();
  if (!game) return json(request, env, 404, { error: "Der er ikke gemt et spil med dette navn endnu." });
  if ((await pinHash(pin, game.pin_salt)) !== game.pin_hash) {
    await recordFailure(env.DB, classId, studentId, tag, now);
    return json(request, env, 401, { error: "Navn eller kode passer ikke." });
  }
  await clearFailures(env.DB, classId, studentId, tag);
  return new Response(game.bundle_json, {
    headers: { ...cors(request, env), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-TegneSpil-Revision": String(game.revision) },
  });
}

async function saveGame(request, env, classId, studentId) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return json(request, env, 415, { error: "Spillet skal sendes som JSON." });
  const pin = requirePin(request.headers.get("X-TegneSpil-Pin"));
  const raw = await readLimitedJsonText(request);
  const rawBytes = new TextEncoder().encode(raw).byteLength;
  let bundle;
  try { bundle = validateBundle(JSON.parse(raw), rawBytes); }
  catch (error) { return json(request, env, 400, { error: error.message || "Spillet kunne ikke læses." }); }
  const tag = await clientTag(request, env);
  const now = Date.now();
  if (await isLocked(env.DB, classId, studentId, tag, now)) {
    return json(request, env, 429, { error: "For mange forkerte forsøg. Vent 10 minutter og prøv igen." });
  }
  const existing = await env.DB.prepare(
    "SELECT pin_salt, pin_hash, revision FROM games WHERE class_id = ? AND student_id = ?",
  ).bind(classId, studentId).first();
  const timestamp = new Date(now).toISOString();
  if (!existing) {
    const gameCount = await env.DB.prepare("SELECT COUNT(*) AS total FROM games WHERE class_id = ?").bind(classId).first();
    if (gameCount.total >= MAX_GAME_COUNT_PER_CLASS) return json(request, env, 429, { error: "Klassen har nået grænsen for gemte spil. Spørg læreren." });
    const salt = randomHex();
    await env.DB.prepare(
      "INSERT INTO games (class_id, student_id, pin_salt, pin_hash, bundle_json, byte_length, revision, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)",
    ).bind(classId, studentId, salt, await pinHash(pin, salt), JSON.stringify(bundle), rawBytes, timestamp, timestamp).run();
    return json(request, env, 201, { saved: true, file: `${studentId}.dgm`, revision: 1 });
  }
  if ((await pinHash(pin, existing.pin_salt)) !== existing.pin_hash) {
    await recordFailure(env.DB, classId, studentId, tag, now);
    return json(request, env, 401, { error: "Navn eller kode passer ikke." });
  }
  const revision = Number(existing.revision) + 1;
  await env.DB.prepare(
    "UPDATE games SET bundle_json = ?, byte_length = ?, revision = ?, updated_at = ? WHERE class_id = ? AND student_id = ?",
  ).bind(JSON.stringify(bundle), rawBytes, revision, timestamp, classId, studentId).run();
  await clearFailures(env.DB, classId, studentId, tag);
  return json(request, env, 200, { saved: true, file: `${studentId}.dgm`, revision });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      if (!cors(request, env)["Access-Control-Allow-Origin"]) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors(request, env) });
    }
    if (url.pathname === "/api/health" && request.method === "GET") return json(request, env, 200, { ok: true });
    if (url.pathname === "/api/classes" && request.method === "GET") {
      const result = await env.DB.prepare("SELECT id, name FROM classes ORDER BY id").all();
      return json(request, env, 200, { classes: result.results });
    }
    const library = url.pathname.match(/^\/api\/classes\/([^/]+)\/library$/);
    if (library && request.method === "GET") {
      const classId = safeSegment(decodedPathSegment(library[1]));
      if (!classId) return json(request, env, 400, { error: "Ugyldig klasse." });
      try { await assertKnownClass(env.DB, classId); }
      catch (response) { return response; }
      return json(request, env, 200, { tracks: [], figures: [] });
    }
    const gamePath = url.pathname.match(/^\/api\/classes\/([^/]+)\/games\/([^/]+)$/);
    if (gamePath) {
      const classId = safeSegment(decodedPathSegment(gamePath[1]));
      const studentId = safeStudentId(decodedPathSegment(gamePath[2]));
      if (!classId || !studentId) return json(request, env, 400, { error: "Ugyldig klasse eller elev." });
      try { await assertKnownClass(env.DB, classId); }
      catch (response) { return response; }
      try {
        if (request.method === "GET") return await readGame(request, env, classId, studentId);
        if (request.method === "PUT") return await saveGame(request, env, classId, studentId);
      } catch (error) {
        return json(request, env, 400, { error: error.message || "Serverfejl." });
      }
      return json(request, env, 405, { error: "Metoden understøttes ikke." });
    }
    return json(request, env, 404, { error: "API-stien findes ikke." });
  },
};
