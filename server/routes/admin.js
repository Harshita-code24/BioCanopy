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

// GET /api/admin/stats - High-level metrics for admin dashboard cards
router.get('/stats', (req, res) => {
  try {
    const totalReportsRow = db.prepare('SELECT COUNT(*) as count FROM reports').get();
    const pendingReportsRow = db
      .prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'Pending Review'")
      .get();
    const dispatchedReportsRow = db
      .prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'Task Dispatched'")
      .get();
    const resolvedReportsRow = db
      .prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'Resolved'")
      .get();
    const totalUsersRow = db.prepare('SELECT COUNT(*) as count FROM users').get();

    res.json({
      totalReports: totalReportsRow?.count ?? 0,
      pendingReports: pendingReportsRow?.count ?? 0,
      dispatchedReports: dispatchedReportsRow?.count ?? 0,
      resolvedReports: resolvedReportsRow?.count ?? 0,
      totalUsers: totalUsersRow?.count ?? 0,
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
});

// GET /api/admin/reports - Get all reports with reporter identity joined from users table
router.get('/reports', (req, res) => {
  try {
    const { city, status, category } = req.query;

    let query = `
      SELECT r.*, u.name as reporter_name, u.email as reporter_email
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
    `;
    const conditions = [];
    const params = [];

    if (city && city !== 'All') {
      conditions.push('r.city = ?');
      params.push(city);
    }

    if (status && status !== 'All') {
      conditions.push('r.status = ?');
      params.push(status);
    }

    if (category && category !== 'All') {
      conditions.push('r.category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY r.created_at DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const formattedReports = rows.map((row) => ({
      id: `rep-${row.id}`,
      numericId: row.id,
      city: row.city,
      locationName: row.location_name,
      coordinates: [row.latitude, row.longitude],
      category: row.category,
      description: row.description,
      photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      status: row.status,
      source: row.source,
      upvotes: row.upvotes || 1,
      reporterName: row.reporter_name || 'Anonymous Citizen',
      reporterEmail: row.reporter_email || 'Not provided',
      submittedAt: formatTimeAgo(row.created_at),
      createdAt: row.created_at,
    }));

    res.json(formattedReports);
  } catch (err) {
    console.error('Error fetching admin reports:', err);
    res.status(500).json({ message: 'Failed to fetch admin reports.' });
  }
});

// PATCH /api/admin/reports/:id/status - Update report status (e.g. Reviewed, Task Dispatched, Resolved)
router.patch('/reports/:id/status', (req, res) => {
  try {
    const rawId = req.params.id;
    const numericId = Number(rawId.replace(/^rep-/, ''));
    const { status } = req.body;

    const validStatuses = ['Pending Review', 'Reviewed', 'Task Dispatched', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid report ID.' });
    }

    const checkStmt = db.prepare('SELECT id FROM reports WHERE id = ?');
    const existing = checkStmt.get(numericId);

    if (!existing) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const updateStmt = db.prepare('UPDATE reports SET status = ? WHERE id = ?');
    updateStmt.run(status, numericId);

    res.json({
      message: `Report status updated to "${status}".`,
      id: `rep-${numericId}`,
      status,
    });
  } catch (err) {
    console.error('Error updating report status:', err);
    res.status(500).json({ message: 'Failed to update report status.' });
  }
});

// DELETE /api/admin/reports/:id - Delete / Reject report
router.delete('/reports/:id', (req, res) => {
  try {
    const rawId = req.params.id;
    const numericId = Number(rawId.replace(/^rep-/, ''));

    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid report ID.' });
    }

    const checkStmt = db.prepare('SELECT id FROM reports WHERE id = ?');
    const existing = checkStmt.get(numericId);

    if (!existing) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const deleteStmt = db.prepare('DELETE FROM reports WHERE id = ?');
    deleteStmt.run(numericId);

    res.json({ message: 'Report deleted successfully by admin.', id: `rep-${numericId}` });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ message: 'Failed to delete report.' });
  }
});

export default router;
