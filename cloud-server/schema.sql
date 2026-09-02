PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT OR IGNORE INTO classes (id, name) VALUES
  ('4A', '4.A'),
  ('4B', '4.B'),
  ('4C', '4.C'),
  ('4D', '4.D');

CREATE TABLE IF NOT EXISTS games (
  class_id TEXT NOT NULL REFERENCES classes(id),
  student_id TEXT NOT NULL,
  pin_salt TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  bundle_json TEXT NOT NULL,
  byte_length INTEGER NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (class_id, student_id)
);

CREATE INDEX IF NOT EXISTS games_by_class ON games(class_id);

CREATE TABLE IF NOT EXISTS pin_attempts (
  class_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  client_tag TEXT NOT NULL,
  window_started_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  PRIMARY KEY (class_id, student_id, client_tag)
);
