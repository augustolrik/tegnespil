import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

// Real SQLite exercises the D1 queries and atomic quota reservations locally.
export class LocalD1 {
  constructor() {
    this.db = new DatabaseSync(":memory:");
    this.db.exec(readFileSync(new URL("../../schema.sql", import.meta.url), "utf8"));
  }
  prepare(sql) {
    const statement = this.db.prepare(sql);
    return {
      bind(...values) {
        return {
          first: async () => statement.get(...values) || null,
          all: async () => ({ results: statement.all(...values) }),
          run: async () => ({ meta: statement.run(...values) }),
        };
      },
      first: async () => statement.get() || null,
      all: async () => ({ results: statement.all() }),
      run: async () => ({ meta: statement.run() }),
    };
  }
}

export class MemoryR2 {
  objects = new Map();
  async head(key) { return this.objects.get(key) || null; }
  async put(key, bytes, metadata) {
    const row = { ...metadata, bytes: new Uint8Array(bytes), size: bytes.byteLength, httpEtag: '"test-etag"' };
    this.objects.set(key, row);
    return row;
  }
  async get(key) {
    const row = await this.head(key);
    return row ? { ...row, body: new Blob([row.bytes]).stream() } : null;
  }
}

export const PNG = new Uint8Array(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==", "base64"));

// Storage tests isolate the network and paid Images service. Wrangler's local
// Images implementation is used separately to verify actual decoding/WebP.
export function environment() {
  return {
    DB: new LocalD1(), ASSETS: new MemoryR2(), RATE_LIMIT_SECRET: "local-test-secret",
    ALLOWED_ORIGINS: "http://localhost:8787,https://augustolrik.github.io",
    IMAGES: {
      info: async () => ({ width: 1, height: 1, format: "image/png" }),
      input(stream) {
        return {
          transform() { return this; },
          async output() {
            const bytes = await new Response(stream).arrayBuffer();
            return { response: () => new Response(bytes, { headers: { "Content-Type": "image/webp" } }) };
          },
        };
      },
    },
  };
}
