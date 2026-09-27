import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'biocanopy_jwt_secret_dev_key_2026';

// POST /api/auth/register - Create a new user account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const checkEmailStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existingUser = checkEmailStmt.get(trimmedEmail);

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into SQLite database
    const insertStmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    const result = insertStmt.run(name.trim(), trimmedEmail, hashedPassword, 'citizen');

    const newUser = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: trimmedEmail,
      role: 'citizen',
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: newUser,
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login - Log in with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user in database
    const getUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = getUserStmt.get(trimmedEmail);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Logged in successfully!',
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me - Verify token and get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const getUserStmt = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    const user = getUserStmt.get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('Error in /me endpoint:', err);
    return res.status(500).json({ message: 'Failed to retrieve user profile.' });
  }
});

export default router;
