const express = require('express');
const db = require('./database');

const router = express.Router();

// ========== DECISIONS ENDPOINTS ==========

// Get all decisions
router.get('/decisions', (req, res) => {
  try {
    const decisions = db.prepare('SELECT * FROM decisions ORDER BY created_at DESC').all();
    res.json(decisions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single decision
router.get('/decisions/:id', (req, res) => {
  try {
    const decision = db.prepare('SELECT * FROM decisions WHERE id = ?').get(req.params.id);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    res.json(decision);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create decision
router.post('/decisions', (req, res) => {
  try {
    const { title, category, status, priority, options, decision, rationale, owner, date_needed, dependencies } = req.body;
    const stmt = db.prepare(`
      INSERT INTO decisions (title, category, status, priority, options, decision, rationale, owner, date_needed, dependencies)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, category, status, priority, options, decision, rationale, owner, date_needed, dependencies);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update decision
router.put('/decisions/:id', (req, res) => {
  try {
    const { title, category, status, priority, options, decision, rationale, owner, date_needed, dependencies } = req.body;
    const stmt = db.prepare(`
      UPDATE decisions
      SET title = ?, category = ?, status = ?, priority = ?, options = ?, decision = ?, rationale = ?, owner = ?, date_needed = ?, dependencies = ?
      WHERE id = ?
    `);
    const result = stmt.run(title, category, status, priority, options, decision, rationale, owner, date_needed, dependencies, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete decision
router.delete('/decisions/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM decisions WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    res.json({ message: 'Decision deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ACTIONS ENDPOINTS ==========

// Get all actions
router.get('/actions', (req, res) => {
  try {
    const actions = db.prepare('SELECT * FROM actions ORDER BY due_date ASC').all();
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single action
router.get('/actions/:id', (req, res) => {
  try {
    const action = db.prepare('SELECT * FROM actions WHERE id = ?').get(req.params.id);
    if (!action) {
      return res.status(404).json({ error: 'Action not found' });
    }
    res.json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create action
router.post('/actions', (req, res) => {
  try {
    const { title, category, status, priority, owner, due_date, dependencies, notes, on_critical_path, estimated_hours } = req.body;
    const stmt = db.prepare(`
      INSERT INTO actions (title, category, status, priority, owner, due_date, dependencies, notes, on_critical_path, estimated_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, category, status, priority, owner, due_date, dependencies, notes, on_critical_path ? 1 : 0, estimated_hours);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update action
router.put('/actions/:id', (req, res) => {
  try {
    const { title, category, status, priority, owner, due_date, dependencies, notes, on_critical_path, estimated_hours } = req.body;
    const stmt = db.prepare(`
      UPDATE actions
      SET title = ?, category = ?, status = ?, priority = ?, owner = ?, due_date = ?, dependencies = ?, notes = ?, on_critical_path = ?, estimated_hours = ?
      WHERE id = ?
    `);
    const result = stmt.run(title, category, status, priority, owner, due_date, dependencies, notes, on_critical_path ? 1 : 0, estimated_hours, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Action not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete action
router.delete('/actions/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM actions WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Action not found' });
    }
    res.json({ message: 'Action deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== STATS ENDPOINT ==========

router.get('/stats', (req, res) => {
  try {
    const stats = {
      decisions: {
        total: db.prepare('SELECT COUNT(*) as count FROM decisions').get().count,
        pending: db.prepare('SELECT COUNT(*) as count FROM decisions WHERE status = ?').get('pending').count,
        decided: db.prepare('SELECT COUNT(*) as count FROM decisions WHERE status = ?').get('decided').count,
      },
      actions: {
        total: db.prepare('SELECT COUNT(*) as count FROM actions').get().count,
        pending: db.prepare('SELECT COUNT(*) as count FROM actions WHERE status = ?').get('pending').count,
        in_progress: db.prepare('SELECT COUNT(*) as count FROM actions WHERE status = ?').get('in_progress').count,
        completed: db.prepare('SELECT COUNT(*) as count FROM actions WHERE status = ?').get('completed').count,
        critical_path: db.prepare('SELECT COUNT(*) as count FROM actions WHERE on_critical_path = 1').get().count,
      }
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
