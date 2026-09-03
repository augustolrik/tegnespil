import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

class FakeD1 {
  constructor() {
    this.games = new Map();
    this.attempts = new Map();
  }

  prepare(sql) { return new FakeStatement(this, sql); }
}

class FakeStatement {
  constructor(db, sql) { this.db = db; this.sql = sql; this.values = []; }
  bind(...values) { this.values = values; return this; }
  gameKey() { return `${this.values[0]}:${this.values[1]}`; }
  attemptKey() { return `${this.values[0]}:${this.values[1]}:${this.values[2]}`; }

  async first() {
    if (this.sql.startsWith("SELECT id FROM classes")) return ["4A", "4B", "4C", "4D"].includes(this.values[0]) ? { id: this.values[0] } : null;
    if (this.sql.startsWith("SELECT window_started_at")) return this.db.attempts.get(this.attemptKey()) || null;
    if (this.sql.startsWith("SELECT pin_salt")) return this.db.games.get(this.gameKey()) || null;
    if (this.sql.startsWith("SELECT COUNT")) return { total: 0 };
    throw new Error(`Unexpected first query: ${this.sql}`);
  }

  async all() {
    if (this.sql.startsWith("SELECT student_id, updated_at FROM games")) {
      return {
        results: [...this.db.games.entries()]
          .filter(([key]) => key.startsWith(`${this.values[0]}:`))
          .map(([key, game]) => ({ student_id: key.slice(key.indexOf(":") + 1), updated_at: game.updated_at })),
      };
    }
    return { results: ["4A", "4B", "4C", "4D"].map((id) => ({ id, name: `${id[0]}.${id[1]}` })) };
  }

  async run() {
    if (this.sql.startsWith("INSERT INTO games")) {
      const [classId, studentId, pinSalt, pinHash, bundleJson, byteLength, createdAt, updatedAt] = this.values;
      this.db.games.set(`${classId}:${studentId}`, { pin_salt: pinSalt, pin_hash: pinHash, bundle_json: bundleJson, byte_length: byteLength, revision: 1, created_at: createdAt, updated_at: updatedAt });
    } else if (this.sql.startsWith("UPDATE games")) {
      const [bundleJson, byteLength, revision, updatedAt, classId, studentId] = this.values;
      Object.assign(this.db.games.get(`${classId}:${studentId}`), { bundle_json: bundleJson, byte_length: byteLength, revision, updated_at: updatedAt });
    } else if (this.sql.startsWith("DELETE FROM pin_attempts")) {
      this.db.attempts.delete(this.attemptKey());
    } else if (this.sql.startsWith("INSERT OR REPLACE INTO pin_attempts")) {
      const [classId, studentId, clientTag, windowStartedAt] = this.values;
      this.db.attempts.set(`${classId}:${studentId}:${clientTag}`, { window_started_at: windowStartedAt, attempts: 1 });
    } else if (this.sql.startsWith("UPDATE pin_attempts")) {
      const row = this.db.attempts.get(this.attemptKey());
      row.attempts += 1;
    } else throw new Error(`Unexpected run query: ${this.sql}`);
    return { meta: { changes: 1 } };
  }
}

const game = (name = "Mit spil") => ({
  version: 3,
  name,
  tracks: [{ id: "track_1", config: { trackImage: { builtin: "default-track" }, figureImage: { builtin: "default-figure" } } }],
});

function request(path, { method = "GET", pin, body } = {}) {
  const headers = { Origin: "https://augustolrik.github.io", "CF-Connecting-IP": "203.0.113.8" };
  if (pin) headers["X-TegneSpil-Pin"] = pin;
  if (body) headers["Content-Type"] = "application/json";
  return new Request(`https://tegnespil-api.example${path}`, { method, headers, body: body && JSON.stringify(body) });
}

test("a game is PIN protected across create, load, rejection, and update", async () => {
  const env = { DB: new FakeD1(), RATE_LIMIT_SECRET: "test-secret" };
  const path = "/api/classes/4A/games/aug";
  const created = await worker.fetch(request(path, { method: "PUT", pin: "1234", body: game() }), env);
  assert.equal(created.status, 201);
  assert.deepEqual(await created.json(), { saved: true, file: "aug.dgm", revision: 1 });
  assert.equal(env.DB.games.get("4A:aug").pin_hash.includes("1234"), false);

  const opened = await worker.fetch(request(path, { pin: "1234" }), env);
  assert.equal(opened.status, 200);
  assert.equal((await opened.json()).name, "Mit spil");

  const list = await worker.fetch(request("/api/classes/4A/games"), env);
  assert.equal(list.status, 200);
  assert.deepEqual((await list.json()).games, [{
    studentId: "aug",
    file: "aug.dgm",
    updatedAt: env.DB.games.get("4A:aug").updated_at,
  }]);

  const denied = await worker.fetch(request(path, { pin: "9999" }), env);
  assert.equal(denied.status, 401);

  const updated = await worker.fetch(request(path, { method: "PUT", pin: "1234", body: game("Nyt navn") }), env);
  assert.equal(updated.status, 200);
  assert.deepEqual(await updated.json(), { saved: true, file: "aug.dgm", revision: 2 });
});
