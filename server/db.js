import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

// Initialize SQLite database
export const db = new DatabaseSync(dbPath);

// Create users table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'citizen',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Pre-seed default demo citizen account if not already present
try {
  const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  const existingUser = checkStmt.get('neha.resident@biocanopy.demo');

  if (!existingUser) {
    const demoHashedPassword = bcrypt.hashSync('citizen123', 10);
    const insertStmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    insertStmt.run(
      'Neha Resident',
      'neha.resident@biocanopy.demo',
      demoHashedPassword,
      'citizen'
    );
    console.log('✅ Pre-seeded demo user: neha.resident@biocanopy.demo / citizen123');
  }
} catch (err) {
  console.error('Error checking/seeding demo user:', err);
}

export default db;
