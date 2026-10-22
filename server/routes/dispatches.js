import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper to format ISO timestamp into human friendly relative time
function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const created = new Date(dateString);
  const diffMs = Date.now() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// GET /api/dispatches - Get all municipal dispatches, optionally filtered by city and status
router.get('/', (req, res) => {
  try {
    const { city, status } = req.query;
    let query = 'SELECT * FROM dispatches';
    const conditions = [];
    const params = [];

    if (city && city !== 'All') {
      conditions.push('city = ?');
      params.push(city);
    }

    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY priority_rank ASC, id DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const formatted = rows.map((row) => ({
      id: `zone-${row.id}`,
      numericId: row.id,
      dispatchId: row.dispatch_number,
      city: row.city,
      zoneName: row.zone_name,
      taskType: row.task_type,
      targetSaplings: row.target_saplings,
      canopyDeficit: row.canopy_deficit,
      currentCanopy: row.current_canopy,
      surfaceTemp: row.surface_temp,
      priorityRank: row.priority_rank,
      complaintCount: 1,
      status: row.status,
      dispatchedAt: row.dispatched_at ? formatTimeAgo(row.dispatched_at) : null,
      lastReported: row.created_at ? formatTimeAgo(row.created_at) : 'Just now',
      createdAt: row.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching dispatches:', err);
    res.status(500).json({ message: 'Failed to fetch dispatches.' });
  }
});

// GET /api/dispatches/summary - Summary statistics for city municipal planning
router.get('/summary', (req, res) => {
  try {
    const { city } = req.query;
    const cityParam = city || 'Delhi';

    const totalStmt = db.prepare(
      'SELECT COUNT(*) as count, SUM(target_saplings) as totalSaplings, AVG(canopy_deficit) as avgDeficit FROM dispatches WHERE city = ?'
    );
    const totals = totalStmt.get(cityParam);

    const dispatchedStmt = db.prepare(
      "SELECT COUNT(*) as count FROM dispatches WHERE city = ? AND status = 'Task Dispatched'"
    );
    const dispatchedRow = dispatchedStmt.get(cityParam);

    const reportsCountStmt = db.prepare(
      'SELECT COUNT(*) as count FROM reports WHERE city = ?'
    );
    const reportsRow = reportsCountStmt.get(cityParam);

    res.json({
      city: cityParam,
      totalHotspots: totals?.count ?? 0,
      totalSaplingsTargeted: totals?.totalSaplings ?? 0,
      avgCanopyDeficit: Math.round(totals?.avgDeficit ?? -22),
      activeDispatches: dispatchedRow?.count ?? 0,
      verifiedComplaints: reportsRow?.count ?? 0,
    });
  } catch (err) {
    console.error('Error fetching dispatch summary:', err);
    res.status(500).json({ message: 'Failed to fetch summary.' });
  }
});

// POST /api/dispatches - Create or dispatch a new urban planting task
router.post('/', (req, res) => {
  try {
    const {
      city,
      zoneName,
      taskType,
      targetSaplings,
      canopyDeficit,
      currentCanopy,
      surfaceTemp,
    } = req.body;

    if (!city || !zoneName) {
      return res.status(400).json({ message: 'City and zoneName are required.' });
    }

    const cityPrefix = city.slice(0, 3).toUpperCase();
    const randomCode = Math.floor(100 + Math.random() * 900);
    const dispatchNumber = `ORD-${cityPrefix}-2026-${randomCode}`;

    const stmt = db.prepare(`
      INSERT INTO dispatches (dispatch_number, city, zone_name, task_type, target_saplings, canopy_deficit, current_canopy, surface_temp, status, dispatched_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Task Dispatched', CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      dispatchNumber,
      city,
      zoneName.trim(),
      taskType || 'Urban Canopy Squad',
      targetSaplings ? Number(targetSaplings) : 150,
      canopyDeficit ? Number(canopyDeficit) : -24,
      currentCanopy ? Number(currentCanopy) : 14,
      surfaceTemp ? Number(surfaceTemp) : 43.5
    );

    const newDispatch = {
      id: `zone-${result.lastInsertRowid}`,
      numericId: Number(result.lastInsertRowid),
      dispatchId: dispatchNumber,
      city,
      zoneName,
      taskType: taskType || 'Urban Canopy Squad',
      targetSaplings: targetSaplings ? Number(targetSaplings) : 150,
      status: 'Task Dispatched',
      dispatchedAt: 'Just now',
    };

    res.status(201).json({
      message: `Tree-Planting Task Dispatched! Order #${dispatchNumber} logged for field squad.`,
      dispatch: newDispatch,
    });
  } catch (err) {
    console.error('Error creating dispatch:', err);
    res.status(500).json({ message: 'Failed to create dispatch.' });
  }
});

// PATCH /api/dispatches/:id/status - Update dispatch status
router.patch('/:id/status', (req, res) => {
  try {
    const id = req.params.id.replace('zone-', '');
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const isDispatching = status === 'Task Dispatched';
    const updateStmt = isDispatching
      ? db.prepare('UPDATE dispatches SET status = ?, dispatched_at = CURRENT_TIMESTAMP WHERE id = ?')
      : db.prepare('UPDATE dispatches SET status = ? WHERE id = ?');

    const result = updateStmt.run(status, Number(id));

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Dispatch zone not found.' });
    }

    res.json({ message: `Status updated to "${status}".`, status });
  } catch (err) {
    console.error('Error updating dispatch status:', err);
    res.status(500).json({ message: 'Failed to update dispatch status.' });
  }
});

// GET /api/dispatches/actions - Get citizen's completed climate actions & eco-points
router.get('/actions', (req, res) => {
  try {
    const { email, city } = req.query;
    if (!email) {
      return res.json({ completedActions: [], totalEcoPoints: 0 });
    }

    let query = 'SELECT * FROM citizen_actions WHERE user_email = ?';
    const params = [email.trim().toLowerCase()];

    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }

    const rows = db.prepare(query).all(...params);
    const totalEcoPoints = rows.reduce((sum, r) => sum + (r.eco_points || 0), 0);
    const completedKeys = rows.map((r) => r.action_key);

    res.json({
      email,
      completedKeys,
      totalEcoPoints,
      actionsCount: rows.length,
    });
  } catch (err) {
    console.error('Error fetching citizen actions:', err);
    res.status(500).json({ message: 'Failed to fetch actions.' });
  }
});

// POST /api/dispatches/actions/toggle - Toggle a citizen daily action
router.post('/actions/toggle', (req, res) => {
  try {
    const { email, actionKey, city, ecoPoints } = req.body;
    if (!email || !actionKey) {
      return res.status(400).json({ message: 'email and actionKey are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCity = city || 'Delhi';
    const points = ecoPoints ? Number(ecoPoints) : 25;

    // Check if already completed
    const existing = db
      .prepare('SELECT id FROM citizen_actions WHERE user_email = ? AND action_key = ? AND city = ?')
      .get(cleanEmail, actionKey, cleanCity);

    let completed = false;
    if (existing) {
      db.prepare('DELETE FROM citizen_actions WHERE id = ?').run(existing.id);
      completed = false;
    } else {
      db.prepare(
        'INSERT INTO citizen_actions (user_email, action_key, city, eco_points) VALUES (?, ?, ?, ?)'
      ).run(cleanEmail, actionKey, cleanCity, points);
      completed = true;
    }

    // Recalculate total points
    const rows = db
      .prepare('SELECT eco_points FROM citizen_actions WHERE user_email = ?')
      .all(cleanEmail);
    const newTotalPoints = rows.reduce((acc, r) => acc + (r.eco_points || 0), 0);

    res.json({
      actionKey,
      completed,
      ecoPointsAwarded: completed ? points : -points,
      totalEcoPoints: newTotalPoints,
    });
  } catch (err) {
    console.error('Error toggling citizen action:', err);
    res.status(500).json({ message: 'Failed to toggle action.' });
  }
});

export default router;