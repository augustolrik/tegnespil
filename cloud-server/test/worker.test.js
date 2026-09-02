import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

test("health endpoint only reflects an allowed browser origin", async () => {
  const allowed = await worker.fetch(new Request("https://example.workers.dev/api/health", {
    headers: { Origin: "https://augustolrik.github.io" },
  }), { ALLOWED_ORIGINS: "https://augustolrik.github.io" });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.headers.get("Access-Control-Allow-Origin"), "https://augustolrik.github.io");

  const other = await worker.fetch(new Request("https://example.workers.dev/api/health", {
    headers: { Origin: "https://evil.example" },
  }), { ALLOWED_ORIGINS: "https://augustolrik.github.io" });
  assert.equal(other.status, 200);
  assert.equal(other.headers.get("Access-Control-Allow-Origin"), null);
});

test("preflight rejects a browser origin outside the allow-list", async () => {
  const response = await worker.fetch(new Request("https://example.workers.dev/api/classes", {
    method: "OPTIONS",
    headers: { Origin: "https://evil.example" },
  }), { ALLOWED_ORIGINS: "https://augustolrik.github.io" });
  assert.equal(response.status, 403);
});
