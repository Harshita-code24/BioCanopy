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

// Pre-seed default demo citizen and admin accounts if not already present
try {
  const checkCitizen = db.prepare('SELECT id FROM users WHERE email = ?');
  const existingCitizen = checkCitizen.get('neha.resident@biocanopy.demo');

  if (!existingCitizen) {
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

  const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?');
  const existingAdmin = checkAdmin.get('admin@biocanopy.demo');

  if (!existingAdmin) {
    const adminHashedPassword = bcrypt.hashSync('admin123', 10);
    const insertAdminStmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    insertAdminStmt.run(
      'Admin (BioCanopy Team)',
      'admin@biocanopy.demo',
      adminHashedPassword,
      'admin'
    );
    console.log('✅ Pre-seeded admin user: admin@biocanopy.demo / admin123');
  }
} catch (err) {
  console.error('Error checking/seeding users:', err);
}

// Create reports table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    status TEXT DEFAULT 'Pending Review',
    source TEXT DEFAULT 'Citizen Mobile',
    upvotes INTEGER DEFAULT 1,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
  )
`);

// Pre-seed initial community hazard reports if reports table is empty
try {
  const checkReports = db.prepare('SELECT COUNT(*) as count FROM reports');
  const countRow = checkReports.get();

  if (countRow && countRow.count === 0) {
    const seedReports = [
      {
        city: 'Delhi',
        location_name: 'ITO Metro Gate 4 Pedestrian Crossing',
        latitude: 28.6292,
        longitude: 77.2415,
        category: 'Unshaded Hotspot',
        description: 'Metal railing surface measured 52°C at 2:30 PM. No overhead tree shade across 180m pedestrian waiting corridor.',
        photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
        status: 'Pending Review',
        source: 'Citizen Mobile',
        upvotes: 42,
      },
      {
        city: 'Delhi',
        location_name: 'Barakhamba Road Construction Flank',
        latitude: 28.6272,
        longitude: 77.2285,
        category: 'Construction Dust',
        description: 'Uncovered dry cement and gravel stockpiles releasing heavy PM10 dust clouds into pedestrian footpath.',
        photo_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
        status: 'Reviewed',
        source: 'Verified Geotag',
        upvotes: 28,
      },
      {
        city: 'Mumbai',
        location_name: 'Dadar TT Circle Bus Concourse',
        latitude: 19.0198,
        longitude: 72.8435,
        category: 'Unshaded Hotspot',
        description: 'Commuters waiting up to 25 mins under direct solar radiation. Zero tree canopy cover on eastern boarding island.',
        photo_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
        status: 'Pending Review',
        source: 'Citizen Mobile',
        upvotes: 35,
      },
      {
        city: 'Mumbai',
        location_name: 'Kurla West Railway Track Verge',
        latitude: 19.068,
        longitude: 72.879,
        category: 'Illegal Burning',
        description: 'Open burning of commercial plastic waste and dry debris causing thick black smoke across adjacent residential lane.',
        photo_url: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&auto=format&fit=crop&q=80',
        status: 'Task Dispatched',
        source: 'Field Observer',
        upvotes: 61,
      },
      {
        city: 'Ahmedabad',
        location_name: 'Ashram Road Vadaj Junction Stretch',
        latitude: 23.0335,
        longitude: 72.5712,
        category: 'Unshaded Hotspot',
        description: 'Reflective asphalt and low-albedo concrete creating severe micro-heat island. Ground temp exceeds 48°C.',
        photo_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
        status: 'Pending Review',
        source: 'Citizen Mobile',
        upvotes: 19,
      },
      {
        city: 'Bengaluru',
        location_name: 'Silk Board Junction Flyover Footpath',
        latitude: 12.9182,
        longitude: 77.6241,
        category: 'Construction Dust',
        description: 'Metro expansion works generating continuous fugitive dust. Air is gritty, visibility reduced at eye level.',
        photo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=600&auto=format&fit=crop&q=80',
        status: 'Task Dispatched',
        source: 'Citizen Mobile',
        upvotes: 49,
      },
    ];

    const insertReportStmt = db.prepare(`
      INSERT INTO reports (city, location_name, latitude, longitude, category, description, photo_url, status, source, upvotes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of seedReports) {
      insertReportStmt.run(
        r.city,
        r.location_name,
        r.latitude,
        r.longitude,
        r.category,
        r.description,
        r.photo_url,
        r.status,
        r.source,
        r.upvotes
      );
    }
    console.log(`✅ Pre-seeded ${seedReports.length} community hazard reports into SQLite.`);
  }
} catch (err) {
  console.error('Error seeding initial reports:', err);
}

export default db;
