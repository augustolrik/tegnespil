import test from "node:test";
import assert from "node:assert/strict";
import { requirePin, safeStudentId, validateBundle } from "../src/validation.js";

function bundle(overrides = {}) {
  return { version: 2, tracks: [{ id: "track_1", config: { trackImage: "Tracks/track_1.png", figureImage: "Figures/figure_1.png" } }], ...overrides };
}

test("normalizes a student name to a safe ID", () => {
  assert.equal(safeStudentId("Åse Nørgaard!"), "Ase_N_rgaard");
  assert.equal(safeStudentId("../bad"), "bad");
});

test("requires exactly four numeric PIN digits", () => {
  assert.equal(requirePin("1234"), "1234");
  assert.throws(() => requirePin("123"));
  assert.throws(() => requirePin("abcd"));
});

test("accepts a small normal DGM bundle", () => {
  assert.deepEqual(validateBundle(bundle(), 250), bundle());
});

test("rejects data URLs and script-like image sources", () => {
  assert.throws(() => validateBundle(bundle({ tracks: [{ id: "x", config: { trackImage: "data:image/png;base64,AA" } }] }), 250));
  assert.throws(() => validateBundle(bundle({ tracks: [{ id: "x", config: { figureImage: "javascript:alert(1)" } }] }), 250));
});
