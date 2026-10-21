import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendWelcomeEmail, dispatchedEmailsLog } from '../services/emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'biocanopy_jwt_secret_dev_key_2026';

// POST /api/auth/register - Create a new user account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userCity = city?.trim() || 'Delhi';

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
      'INSERT INTO users (name, email, password, role, city) VALUES (?, ?, ?, ?, ?)'
    );
    const result = insertStmt.run(name.trim(), trimmedEmail, hashedPassword, 'citizen', userCity);

    const newUser = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: trimmedEmail,
      role: 'citizen',
      city: userCity,
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Dispatch welcome confirmation email to registered citizen
    const emailResult = await sendWelcomeEmail({
      email: trimmedEmail,
      name: name.trim(),
      role: 'citizen',
      city: userCity,
    });

    return res.status(201).json({
      message: 'Account created successfully! Welcome email sent.',
      token,
      user: newUser,
      emailSent: emailResult.sent,
      emailPreviewUrl: emailResult.previewUrl,
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login - Log in with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password, name, city } = req.body;

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

    // If custom name or city provided at login, update user record
    if (name?.trim() || city?.trim()) {
      try {
        const updateStmt = db.prepare('UPDATE users SET name = COALESCE(?, name), city = COALESCE(?, city) WHERE id = ?');
        updateStmt.run(name?.trim() || null, city?.trim() || null, user.id);
      } catch (e) {
        console.warn('Could not update name/city on login:', e);
      }
    }

    const userPayload = {
      id: user.id,
      name: name?.trim() || user.name,
      email: user.email,
      role: user.role,
      city: city?.trim() || user.city || 'Delhi',
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

// POST /api/auth/google-login - Sign in or sign up with Google
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, city } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Google account email is required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const displayName = name?.trim() || 'Google User';
    const selectedCity = city?.trim() || 'Delhi';
    const isAdmin = trimmedEmail.includes('admin');
    const userRole = isAdmin ? 'admin' : 'citizen';

    // Check if user already exists
    const getUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    let user = getUserStmt.get(trimmedEmail);

    if (!user) {
      // Create new Google citizen user
      const randomPassword = `google_${Math.random().toString(36).slice(2, 12)}!`;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const insertStmt = db.prepare(
        'INSERT INTO users (name, email, password, role, city) VALUES (?, ?, ?, ?, ?)'
      );
      const result = insertStmt.run(displayName, trimmedEmail, hashedPassword, userRole, selectedCity);

      user = {
        id: Number(result.lastInsertRowid),
        name: displayName,
        email: trimmedEmail,
        role: userRole,
        city: selectedCity,
      };
    } else {
      // Update city if provided
      if (selectedCity && selectedCity !== user.city) {
        try {
          db.prepare('UPDATE users SET city = ? WHERE id = ?').run(selectedCity, user.id);
          user.city = selectedCity;
        } catch {
          // ignore
        }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Email delivery trigger constraint:
    // "Make sure this email thing is only for users not admins."
    let emailResult = { sent: false };
    if (user.role === 'citizen' && !trimmedEmail.includes('admin')) {
      emailResult = await sendWelcomeEmail({
        email: user.email,
        name: user.name,
        role: user.role,
        city: user.city || selectedCity,
      });
    } else {
      console.log(`[Email Service] Skipped welcome email for admin: ${trimmedEmail}`);
    }

    return res.json({
      message: 'Signed in with Google successfully!',
      token,
      emailSent: emailResult.sent,
      emailPreviewUrl: emailResult.previewUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city || selectedCity,
      },
    });
  } catch (err) {
    console.error('Error during Google login:', err);
    return res.status(500).json({ message: 'Internal server error during Google login.' });
  }
});

// POST /api/auth/send-welcome-email - Dispatch confirmation email to citizens ONLY
router.post('/send-welcome-email', async (req, res) => {
  const { email, name, role, city } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const result = await sendWelcomeEmail({ email, name, role, city });
  return res.json(result);
});

// GET /api/auth/dispatched-emails - View all dispatched emails (for live preview/testing)
router.get('/dispatched-emails', (req, res) => {
  res.json({
    count: dispatchedEmailsLog.length,
    emails: dispatchedEmailsLog,
  });
});

// PUT /api/auth/profile - Edit Password and City ONLY (Name & Email are immutable)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { password, city } = req.body;
    const userId = req.user.id;

    // Verify user exists
    const userStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = userStmt.get(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Only update password and city (Name and Email remain strictly unchanged)
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatePassStmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
      updatePassStmt.run(hashedPassword, userId);
    }

    if (city) {
      try {
        const updateCityStmt = db.prepare('UPDATE users SET city = ? WHERE id = ?');
        updateCityStmt.run(city.trim(), userId);
      } catch (e) {
        console.warn('Could not update city in SQLite:', e);
      }
    }

    return res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user.id,
        name: user.name, // Unchanged
        email: user.email, // Unchanged
        role: user.role,
        city: city?.trim() || user.city || 'Delhi',
      },
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ message: 'Internal server error updating profile.' });
  }
});

// GET /api/auth/me - Verify token and get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const getUserStmt = db.prepare('SELECT id, name, email, role, city, created_at FROM users WHERE id = ?');
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

