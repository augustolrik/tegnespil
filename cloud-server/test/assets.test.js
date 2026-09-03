import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { importAsset, publicImageUrl, readBytes, MAX_IMAGE_BYTES, ASSET_STORAGE_LIMIT_BYTES } from "../src/assets.js";
import { validateBundle } from "../src/validation.js";
import { environment, PNG } from "./helpers/storage.js";
import "../../src/asset-pipeline.js";

const ORIGIN = "http://localhost:8787";
const API = "https://tegnespil-api.example";
const PAGE = `${ORIGIN}/online`;
const WEB = "https://pictures.example/student.png";
const GAME = "/api/classes/4A/games/student";
const { createClient, assetIds } = globalThis.TegneSpilAssets;

function apiRequest(path, options = {}) {
  return new Request(`${API}${path}`, { ...options, headers: { Origin: ORIGIN, "CF-Connecting-IP": "203.0.113.2", ...options.headers } });
}
function client(env, extra = {}) {
  return createClient({ apiBase: API, pageUrl: PAGE, fetch: (url, options) => {
    if (!url.startsWith(API)) return fetch(url, options);
    return worker.fetch(apiRequest(url.slice(API.length), options), env);
  }, ...extra });
}
function bundle(image = { builtin: "default-track" }) {
  return { version: 2, name: "Elevens spil", tracks: [{ id: "track_1", figureId: "figure_1", config: {
    trackImage: image, figureImage: "assets/default-figure.svg", walkable: ["0,0", "1,0"],
  } }] };
}
async function save(env, body) {
  return worker.fetch(apiRequest(GAME, { method: "PUT", headers: { "Content-Type": "application/json", "X-TegneSpil-Pin": "1234" }, body: JSON.stringify(body) }), env);
}

test("web import → save → lost source → fresh client opens all images from R2", async (t) => {
  const env = environment();
  let sourceAvailable = true;
  let downloads = 0;
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url, WEB);
    downloads += 1;
    return new Response(sourceAvailable ? PNG : "deleted", { status: sourceAvailable ? 200 : 404 });
  });
  const firstComputer = client(env);
  const url = await firstComputer.importImage(WEB, "web");
  assert.match(url, /\/api\/assets\/img_[a-f0-9]{64}$/);
  const game = bundle(url);
  game.tracks[0].config.figureImage = url;
  game.tracks[0].config.clues = [{ imageData: url, text: "Find vejen" }];
  game.tracks[0].config.pro = { frames: [{ imageData: url, imagePath: WEB }] };
  const saved = await firstComputer.prepareBundle(game);
  assert.equal((await save(env, saved)).status, 201);
  assert.equal(JSON.stringify(saved).includes(WEB), false);
  assert.equal(JSON.stringify(saved).includes(API), false);
  assert.equal(saved.version, 3);
  assert.equal(assetIds(saved).length, 1);
  sourceAvailable = false;

  for (let reopen = 0; reopen < 2; reopen += 1) {
    // Neither the imported-source map nor browser storage survives.
    const fresh = client(env);
    const opened = await worker.fetch(apiRequest(GAME, { headers: { "X-TegneSpil-Pin": "1234" } }), env);
    assert.equal(opened.status, 200);
    const data = await opened.json();
    const hydrated = fresh.hydrate(data);
    const restored = hydrated.tracks[0].config;
    for (const image of [restored.trackImage, restored.figureImage, restored.clues[0].imageData, restored.pro.frames[0].imageData]) {
      const response = await worker.fetch(apiRequest(image.slice(API.length)), env);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("Content-Type"), "image/webp");
      assert.deepEqual(new Uint8Array(await response.arrayBuffer()), PNG);
    }
    assert.deepEqual(await fresh.prepareBundle(hydrated), data);
  }
  assert.equal(downloads, 1);
  assert.equal([...env.ASSETS.objects.values()][0].customMetadata.originalUrl, WEB);
});

for (const source of ["upload", "photodrop", "web"]) {
  test(`${source} uses the same immutable R2 storage`, async () => {
    const env = environment();
    const result = await worker.fetch(apiRequest(`/api/assets?source=${source}`, { method: "POST", body: PNG }), env);
    assert.equal(result.status, 201);
    const ref = await result.json();
    const stored = env.ASSETS.objects.get(`images/${ref.assetId}.webp`);
    assert.equal(stored.customMetadata.source, source);
    assert.equal(stored.httpMetadata.contentType, "image/webp");
    assert.equal((await worker.fetch(apiRequest(`/api/assets/${ref.assetId}`), env)).status, 200);
  });
}

test("legacy embedded images, all tracks, clues and Pro frames migrate without losing game data", async () => {
  const env = environment();
  const fresh = client(env);
  const data = `data:image/png;base64,${Buffer.from(PNG).toString("base64")}`;
  const game = bundle(data);
  game.tracks[0].trackImageData = data;
  game.tracks[0].config.clues = [{ imageData: data, text: "https://example.com is just clue text" }];
  game.tracks[0].config.pro = { frames: [{ imageData: data, imagePath: "old filename.png" }] };
  game.tracks.push(structuredClone(game.tracks[0]));
  const original = structuredClone(game);
  const saved = await fresh.prepareBundle(game);
  assert.deepEqual(game, original);
  assert.equal(JSON.stringify(saved).includes("data:image"), false);
  assert.equal(JSON.stringify(saved).includes("old filename.png"), false);
  assert.deepEqual(saved.tracks[1].config.walkable, ["0,0", "1,0"]);
  assert.equal(env.ASSETS.objects.size, 1);
  assert.equal((await save(env, saved)).status, 201);
});

test("upload failure leaves original bundle intact and retry works", async () => {
  const env = environment();
  const fresh = client(env);
  const oldPut = env.ASSETS.put;
  env.ASSETS.put = async () => { throw new Error("R2 unavailable"); };
  const data = `data:image/png;base64,${Buffer.from(PNG).toString("base64")}`;
  const game = bundle(data);
  await assert.rejects(() => fresh.prepareBundle(game), /R2 unavailable/);
  assert.equal(game.tracks[0].config.trackImage, data);
  assert.equal(env.DB.db.prepare("SELECT COUNT(*) AS count FROM games").get().count, 0);
  assert.equal(env.DB.db.prepare("SELECT used_bytes FROM asset_storage WHERE id = 1").get().used_bytes, 0);
  env.ASSETS.put = oldPut;
  assert.equal((await save(env, await fresh.prepareBundle(game))).status, 201);
});

test("hard storage ceiling rejects a new asset before R2 receives it", async () => {
  const env = environment();
  env.DB.db.prepare("UPDATE asset_storage SET used_bytes = ? WHERE id = 1")
    .run(ASSET_STORAGE_LIMIT_BYTES - PNG.byteLength + 1);
  const response = await worker.fetch(apiRequest("/api/assets", { method: "POST", body: PNG }), env);
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /9,6 GB/);
  assert.equal(env.ASSETS.objects.size, 0);
  assert.equal(env.DB.db.prepare("SELECT COUNT(*) AS count FROM stored_assets").get().count, 0);
});

test("storage usage reports the fixed 9.6 GB ceiling and deduplication counts once", async () => {
  const env = environment();
  const first = await importAsset(apiRequest("/api/assets", { method: "POST", body: PNG }), env);
  await importAsset(apiRequest("/api/assets", { method: "POST", body: PNG }), env);
  const usage = await worker.fetch(apiRequest("/api/assets/usage"), env);
  assert.deepEqual(await usage.json(), { usedBytes: PNG.byteLength, limitBytes: ASSET_STORAGE_LIMIT_BYTES, remainingBytes: ASSET_STORAGE_LIMIT_BYTES - PNG.byteLength });
  assert.equal(env.DB.db.prepare("SELECT COUNT(*) AS count FROM stored_assets WHERE asset_id = ?").get(first.assetId).count, 1);
});

test("missing asset cannot replace a previously saved game", async () => {
  const env = environment();
  const good = await client(env).prepareBundle(bundle());
  assert.equal((await save(env, good)).status, 201);
  const bad = structuredClone(good);
  bad.tracks[0].config.trackImage = { assetId: `img_${"a".repeat(64)}` };
  const result = await save(env, bad);
  assert.equal(result.status, 400);
  assert.match((await result.json()).error, /mangler/);
  const row = env.DB.db.prepare("SELECT revision, bundle_json FROM games").get();
  assert.equal(row.revision, 1);
  assert.deepEqual(JSON.parse(row.bundle_json), good);
});

test("raw image references are rejected even in nested clues and frames", async () => {
  const base = await client(environment()).prepareBundle(bundle());
  for (const value of [WEB, "data:image/png;base64,AA", "blob:https://example.com/1", "Tracks/local.png", { assetId: "img_bad" }, { assetId: `img_${"a".repeat(64)}`, url: WEB }]) {
    for (const configField of ["clues", "pro"]) {
      const game = structuredClone(base);
      game.tracks[0].config[configField] = configField === "clues" ? [{ imageData: value }] : { frames: [{ imagePath: value }] };
      assert.throws(() => validateBundle(game, 1024));
    }
  }
  assert.throws(() => validateBundle({ ...base, version: 2 }, 1024), /Opdatér/);
});

test("rejects SVG, scripts, empty, oversized and corrupt image uploads", async () => {
  const env = environment();
  for (const body of ["<svg/>", "<script>alert(1)</script>", "", "not an image"]) {
    const result = await worker.fetch(apiRequest("/api/assets", { method: "POST", body }), env);
    assert.equal(result.status, 400);
  }
  env.IMAGES.info = async () => { throw new Error("Decode failed"); };
  assert.equal((await worker.fetch(apiRequest("/api/assets", { method: "POST", body: PNG }), env)).status, 400);
  const chunks = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_IMAGE_BYTES)); controller.enqueue(new Uint8Array(1)); controller.close(); } });
  await assert.rejects(() => readBytes(new Response(chunks)), /for stort/);
  assert.equal(env.ASSETS.objects.size, 0);
});

test("bounds pixel dimensions and does not claim success without R2", async () => {
  const env = environment();
  env.IMAGES.info = async () => ({ width: 10000, height: 10000 });
  await assert.rejects(() => importAsset(apiRequest("/api/assets", { method: "POST", body: PNG }), env), /megapixel/);
  env.ASSETS = null;
  await assert.rejects(() => importAsset(apiRequest("/api/assets", { method: "POST", body: PNG }), env), /ikke klar/);
});

test("redirects are checked and a disappearing web source aborts import", async () => {
  const env = environment();
  const request = () => apiRequest("/api/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: WEB }) });
  await assert.rejects(() => importAsset(request(), env, async () => new Response(null, { status: 302, headers: { Location: "https://127.0.0.1/private" } })), /offentlig HTTPS/);
  await assert.rejects(() => importAsset(request(), env, async () => new Response(null, { status: 404 })), /tillader ikke/);
  await assert.rejects(() => importAsset(request(), env, async () => new Response(null, { status: 302, headers: { Location: WEB } })), /for mange/);
  assert.equal(env.ASSETS.objects.size, 0);
});

test("web import refuses local addresses, credentials and unsafe schemes", () => {
  for (const url of ["file:///private", "http://example.com/a", "https://localhost/a", "https://127.0.0.1/a", "https://2130706433/a", "https://[::1]/a", "https://foo.local/a", "https://user:secret@example.com/a", "https://example.com:8000/a"]) {
    assert.throws(() => publicImageUrl(url));
  }
});

test("origin rejection does not block allowed image imports", async () => {
  const env = environment();
  const bad = apiRequest("/api/assets", { method: "POST", headers: { Origin: "https://evil.example" }, body: PNG });
  assert.equal((await worker.fetch(bad, env)).status, 403);
  const first = await worker.fetch(apiRequest("/api/assets", { method: "POST", body: PNG }), env);
  assert.equal(first.status, 201);
  assert.equal((await worker.fetch(apiRequest("/api/assets", { method: "POST", body: PNG }), env)).status, 201);
});

test("deduplicates imports without overwriting original metadata", async () => {
  const env = environment();
  const first = await importAsset(apiRequest("/api/assets?source=photodrop", { method: "POST", body: PNG }), env);
  const second = await importAsset(apiRequest("/api/assets?source=upload", { method: "POST", body: PNG }), env);
  assert.equal(first.assetId, second.assetId);
  assert.equal(env.ASSETS.objects.size, 1);
  assert.equal([...env.ASSETS.objects.values()][0].customMetadata.source, "photodrop");
});

test("class library exposes only the class's permanent R2 asset references", async () => {
  const env = environment();
  const track = `img_${"b".repeat(64)}`;
  const figure = `img_${"c".repeat(64)}`;
  env.DB.db.prepare("INSERT INTO class_assets (class_id, kind, asset_id, name, created_at) VALUES (?, ?, ?, ?, ?)")
    .run("4A", "track", track, "Skov.jpg", "2026-09-03T00:00:00.000Z");
  env.DB.db.prepare("INSERT INTO class_assets (class_id, kind, asset_id, name, created_at) VALUES (?, ?, ?, ?, ?)")
    .run("4A", "figure", figure, "Ræv.png", "2026-09-03T00:00:00.000Z");
  const response = await worker.fetch(apiRequest("/api/classes/4A/library"), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    tracks: [{ id: track, assetId: track, name: "Skov.jpg", displayName: "Skov.jpg", source: "upload", url: `/api/assets/${track}` }],
    figures: [{ id: figure, assetId: figure, name: "Ræv.png", displayName: "Ræv.png", source: "upload", url: `/api/assets/${figure}` }],
  });
});
