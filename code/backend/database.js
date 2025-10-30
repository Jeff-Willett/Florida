const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'florida.sqlite'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    options TEXT,
    decision TEXT,
    rationale TEXT,
    owner TEXT,
    date_needed TEXT,
    dependencies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    owner TEXT,
    due_date TEXT,
    dependencies TEXT,
    notes TEXT,
    on_critical_path BOOLEAN DEFAULT 0,
    estimated_hours INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_decisions_timestamp
  AFTER UPDATE ON decisions
  BEGIN
    UPDATE decisions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_actions_timestamp
  AFTER UPDATE ON actions
  BEGIN
    UPDATE actions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

module.exports = db;
