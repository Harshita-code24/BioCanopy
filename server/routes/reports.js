import express from 'express';
import { db } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'biocanopy_jwt_secret_dev_key_2026';

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

// GET /api/reports - Fetch all citizen reports (filterable by city and category)
router.get('/', (req, res) => {
  try {
    const { city, category } = req.query;

    let query = 'SELECT * FROM reports';
    const params = [];
    const conditions = [];

    if (city && city !== 'All') {
      conditions.push('city = ?');
      params.push(city);
    }

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const formattedReports = rows.map((row) => ({
      id: `rep-${row.id}`,
      city: row.city,
      locationName: row.location_name,
      coordinates: [row.latitude, row.longitude],
      category: row.category,
      description: row.description,
      photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      status: row.status,
      source: row.source,
      upvotes: row.upvotes || 1,
      submittedAt: formatTimeAgo(row.created_at),
    }));

    res.json(formattedReports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Failed to fetch hazard reports.' });
  }
});

// POST /api/reports - Create a new community hazard report
router.post('/', (req, res) => {
  try {
    const { city, locationName, coordinates, category, description, photoUrl } = req.body;

    if (!city || !locationName || !coordinates || !category) {
      return res.status(400).json({
        message: 'City, locationName, coordinates ([lat, lng]), and category are required.',
      });
    }

    const latitude = Number(coordinates[0]);
    const longitude = Number(coordinates[1]);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid coordinates provided.' });
    }

    // Optional user ID extraction if JWT token is passed in header
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        userId = decoded.id;
      } catch {
        // Continue as anonymous citizen if invalid token
      }
    }

    const finalDescription =
      description && description.trim()
        ? description.trim()
        : `Observed severe ${category.toLowerCase()} condition reported by citizen.`;

    const finalPhoto =
      photoUrl && photoUrl.trim()
        ? photoUrl.trim()
        : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80';

    const insertStmt = db.prepare(`
      INSERT INTO reports (city, location_name, latitude, longitude, category, description, photo_url, status, source, upvotes, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Review', 'Citizen Mobile', 1, ?)
    `);

    const result = insertStmt.run(
      city,
      locationName.trim(),
      latitude,
      longitude,
      category,
      finalDescription,
      finalPhoto,
      userId
    );

    const newId = Number(result.lastInsertRowid);

    const createdReport = {
      id: `rep-${newId}`,
      city,
      locationName: locationName.trim(),
      coordinates: [latitude, longitude],
      category,
      description: finalDescription,
      photoUrl: finalPhoto,
      status: 'Pending Review',
      source: 'Citizen Mobile',
      upvotes: 1,
      submittedAt: 'Just now',
    };

    res.status(201).json({
      message: 'Hazard report submitted successfully!',
      report: createdReport,
    });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ message: 'Failed to submit hazard report.' });
  }
});

// PATCH /api/reports/:id/upvote - Upvote a community report
router.patch('/:id/upvote', (req, res) => {
  try {
    const rawId = req.params.id;
    const numericId = Number(rawId.replace(/^rep-/, ''));

    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid report ID.' });
    }

    const getStmt = db.prepare('SELECT upvotes FROM reports WHERE id = ?');
    const existing = getStmt.get(numericId);

    if (!existing) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const newUpvotes = (existing.upvotes || 0) + 1;
    const updateStmt = db.prepare('UPDATE reports SET upvotes = ? WHERE id = ?');
    updateStmt.run(newUpvotes, numericId);

    res.json({
      message: 'Report upvoted successfully!',
      id: `rep-${numericId}`,
      upvotes: newUpvotes,
    });
  } catch (err) {
    console.error('Error upvoting report:', err);
    res.status(500).json({ message: 'Failed to upvote report.' });
  }
});

// DELETE /api/reports/:id - Remove a community report
router.delete('/:id', (req, res) => {
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

    res.json({ message: 'Report deleted successfully.', id: `rep-${numericId}` });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ message: 'Failed to delete report.' });
  }
});

export default router;
