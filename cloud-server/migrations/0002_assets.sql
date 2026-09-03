-- Run once against the existing production D1 database before deploying the
-- Worker version that includes permanent image assets.
CREATE TABLE IF NOT EXISTS asset_upload_limits (
  client_tag TEXT PRIMARY KEY,
  window INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS asset_storage (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  used_bytes INTEGER NOT NULL DEFAULT 0 CHECK (used_bytes >= 0)
);
INSERT OR IGNORE INTO asset_storage (id, used_bytes) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS stored_assets (
  asset_id TEXT PRIMARY KEY,
  byte_length INTEGER NOT NULL CHECK (byte_length > 0),
  created_at TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS stored_assets_reserve_before_insert
BEFORE INSERT ON stored_assets
WHEN (SELECT used_bytes + NEW.byte_length > 9600000000 FROM asset_storage WHERE id = 1)
BEGIN
  SELECT RAISE(ABORT, 'ASSET_STORAGE_LIMIT');
END;

CREATE TRIGGER IF NOT EXISTS stored_assets_count_after_insert
AFTER INSERT ON stored_assets
BEGIN
  UPDATE asset_storage SET used_bytes = used_bytes + NEW.byte_length WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS stored_assets_count_after_delete
AFTER DELETE ON stored_assets
BEGIN
  UPDATE asset_storage SET used_bytes = used_bytes - OLD.byte_length WHERE id = 1;
END;

CREATE TABLE IF NOT EXISTS class_assets (
  class_id TEXT NOT NULL REFERENCES classes(id),
  kind TEXT NOT NULL CHECK (kind IN ('track', 'figure')),
  asset_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (class_id, kind, name)
);

CREATE INDEX IF NOT EXISTS class_assets_by_class ON class_assets(class_id, kind, name);
