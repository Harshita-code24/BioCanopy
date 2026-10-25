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
    city TEXT DEFAULT 'Delhi',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Ensure city column exists for existing databases
try {
  db.exec("ALTER TABLE users ADD COLUMN city TEXT DEFAULT 'Delhi'");
} catch {
  // column already exists
}

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

db.exec(`
  CREATE TABLE IF NOT EXISTS report_upvotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    user_identifier TEXT NOT NULL COLLATE NOCASE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_id, user_identifier),
    FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE
  )
`);

// Pre-seed initial community hazard reports
try {
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
      city: 'Delhi',
      location_name: 'Connaught Place Radial 3 Outer Circle Island',
      latitude: 28.6328,
      longitude: 77.2195,
      category: 'Unshaded Hotspot',
      description: 'Direct solar radiation exposure on broad paved island; pavement temperature measured 49°C.',
      photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      status: 'Pending Review',
      source: 'Citizen Mobile',
      upvotes: 31,
    },
    {
      city: 'Delhi',
      location_name: 'Anand Vihar ISBT Transit Island',
      latitude: 28.6502,
      longitude: 77.3155,
      category: 'Illegal Burning',
      description: 'Open burning of municipal dry refuse and leaf litter behind bus depot creating dense smog.',
      photo_url: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&auto=format&fit=crop&q=80',
      status: 'Task Dispatched',
      source: 'Field Observer',
      upvotes: 54,
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
      city: 'Mumbai',
      location_name: 'Bandra Kurla Complex (BKC) G-Block Avenue',
      latitude: 19.0657,
      longitude: 72.8688,
      category: 'Construction Dust',
      description: 'Uncovered metro flyover excavation causing airborne particulate dust plumes during peak pedestrian commuting hours.',
      photo_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      status: 'Reviewed',
      source: 'Verified Geotag',
      upvotes: 27,
    },
    {
      city: 'Mumbai',
      location_name: 'Lower Parel Flyover Footpath Underpass',
      latitude: 18.9950,
      longitude: 72.8301,
      category: 'No Tree Cover',
      description: 'Extensive concrete expanse with zero vegetative buffering. Severe thermal heat reflection onto walking path.',
      photo_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
      status: 'Task Dispatched',
      source: 'Citizen Mobile',
      upvotes: 18,
    },
    {
      city: 'Mumbai',
      location_name: 'Andheri East Western Express Highway Crossing',
      latitude: 19.1197,
      longitude: 72.8532,
      category: 'Unshaded Hotspot',
      description: 'Extreme midday surface temperatures exceeding 47°C across exposed tarmac footbridge with no canopy cover.',
      photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      status: 'Pending Review',
      source: 'Field Observer',
      upvotes: 43,
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
      city: 'Ahmedabad',
      location_name: 'Kalupur Railway Station Concourse',
      latitude: 23.0275,
      longitude: 72.5985,
      category: 'Construction Dust',
      description: 'Heavy vehicular and civil works generating airborne dust and low visibility across station exit.',
      photo_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      status: 'Reviewed',
      source: 'Verified Geotag',
      upvotes: 16,
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
    {
      city: 'Bengaluru',
      location_name: 'Whitefield ITPL Main Road Corridor',
      latitude: 12.9864,
      longitude: 77.7381,
      category: 'Unshaded Hotspot',
      description: 'Wide asphalt corridor with missing tree shade. Pedestrians forced to walk under midday solar heat.',
      photo_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80',
      status: 'Pending Review',
      source: 'Citizen Mobile',
      upvotes: 22,
    },
  ];

  const insertReportStmt = db.prepare(`
    INSERT INTO reports (city, location_name, latitude, longitude, category, description, photo_url, status, source, upvotes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let addedCount = 0;
  for (const r of seedReports) {
    const existing = db.prepare('SELECT id FROM reports WHERE location_name = ?').get(r.location_name);
    if (!existing) {
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
      addedCount++;
    }
  }
  if (addedCount > 0) {
    console.log(`✅ Pre-seeded ${addedCount} community hazard reports into SQLite.`);
  }
} catch (err) {
  console.error('Error seeding initial reports:', err);
}

// Create dispatches table for municipal tree-planting and heat response orders
db.exec(`
  CREATE TABLE IF NOT EXISTS dispatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispatch_number TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    zone_name TEXT NOT NULL,
    task_type TEXT NOT NULL DEFAULT 'Urban Tree Planting Squad',
    target_saplings INTEGER DEFAULT 150,
    canopy_deficit INTEGER DEFAULT -22,
    current_canopy INTEGER DEFAULT 14,
    surface_temp REAL DEFAULT 43.5,
    priority_rank INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Needs Dispatch',
    dispatched_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Pre-seed initial municipal tree-planting and heat response dispatches
try {
  const checkDispatches = db.prepare('SELECT COUNT(*) as count FROM dispatches');
  const dCount = checkDispatches.get();

  if (dCount && dCount.count === 0) {
    const seedDispatches = [
      {
        dispatch_number: 'ORD-DEL-2026-104',
        city: 'Delhi',
        zone_name: 'Connaught Place Outer Circle Pedestrian Flank',
        task_type: 'Canopy Density Greening',
        target_saplings: 180,
        canopy_deficit: -22,
        current_canopy: 18,
        surface_temp: 44.5,
        priority_rank: 1,
        status: 'Needs Dispatch',
      },
      {
        dispatch_number: 'ORD-DEL-2026-218',
        city: 'Delhi',
        zone_name: 'ITO Vikas Minar Corridor',
        task_type: 'Heat Barrier Tree Planting',
        target_saplings: 150,
        canopy_deficit: -28,
        current_canopy: 11,
        surface_temp: 46.2,
        priority_rank: 2,
        status: 'Task Dispatched',
      },
      {
        dispatch_number: 'ORD-DEL-2026-342',
        city: 'Delhi',
        zone_name: 'Anand Vihar ISBT Transit Flank',
        task_type: 'Dust Suppression & Shade Line',
        target_saplings: 220,
        canopy_deficit: -31,
        current_canopy: 9,
        surface_temp: 47.0,
        priority_rank: 3,
        status: 'Needs Dispatch',
      },
      {
        dispatch_number: 'ORD-BOM-2026-112',
        city: 'Mumbai',
        zone_name: 'Dadar TT Circle Eastern Concourse',
        task_type: 'Pedestrian Shaded Walkway Squad',
        target_saplings: 140,
        canopy_deficit: -20,
        current_canopy: 20,
        surface_temp: 38.5,
        priority_rank: 1,
        status: 'Task Dispatched',
      },
      {
        dispatch_number: 'ORD-BOM-2026-205',
        city: 'Mumbai',
        zone_name: 'BKC G-Block Concrete Corridor',
        task_type: 'Albedo Reduction Micro-Park',
        target_saplings: 190,
        canopy_deficit: -25,
        current_canopy: 16,
        surface_temp: 41.2,
        priority_rank: 2,
        status: 'Needs Dispatch',
      },
      {
        dispatch_number: 'ORD-BLR-2026-301',
        city: 'Bengaluru',
        zone_name: 'Silk Board Central Median Verge',
        task_type: 'Avenue Plantation & Green Buffer',
        target_saplings: 130,
        canopy_deficit: -18,
        current_canopy: 26,
        surface_temp: 35.5,
        priority_rank: 1,
        status: 'Task Dispatched',
      },
      {
        dispatch_number: 'ORD-AMD-2026-401',
        city: 'Ahmedabad',
        zone_name: 'Ashram Road Commercial Footpath',
        task_type: 'High-Albedo Heat Island Mitigation',
        target_saplings: 200,
        canopy_deficit: -32,
        current_canopy: 12,
        surface_temp: 45.8,
        priority_rank: 1,
        status: 'Needs Dispatch',
      },
    ];

    const insertDispatchStmt = db.prepare(`
      INSERT INTO dispatches (dispatch_number, city, zone_name, task_type, target_saplings, canopy_deficit, current_canopy, surface_temp, priority_rank, status, dispatched_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of seedDispatches) {
      insertDispatchStmt.run(
        d.dispatch_number,
        d.city,
        d.zone_name,
        d.task_type,
        d.target_saplings,
        d.canopy_deficit,
        d.current_canopy,
        d.surface_temp,
        d.priority_rank,
        d.status,
        d.status === 'Task Dispatched' ? new Date().toISOString() : null
      );
    }
    console.log(`✅ Pre-seeded ${seedDispatches.length} municipal dispatches into SQLite.`);
  }
} catch (err) {
  console.error('Error seeding dispatches:', err);
}

// Create citizen_actions table for climate resilience action tracking
db.exec(`
  CREATE TABLE IF NOT EXISTS citizen_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL COLLATE NOCASE,
    action_key TEXT NOT NULL,
    city TEXT NOT NULL,
    eco_points INTEGER DEFAULT 25,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, action_key, city)
  )
`);

// ==========================================
// 3. THERMAL POCKETS TABLE & SEED DATA
// ==========================================
db.exec(`
  CREATE TABLE IF NOT EXISTS thermal_pockets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    intensity REAL NOT NULL,
    surface_temp REAL NOT NULL,
    sensor_source TEXT DEFAULT 'Landsat-9 TIRS Satellite',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  const checkThermal = db.prepare('SELECT COUNT(*) as count FROM thermal_pockets');
  const thermalCount = checkThermal.get();

  if (thermalCount && thermalCount.count === 0) {
    const seedThermal = [
      // Delhi
      { city: 'Delhi', name: 'ITO Flyover & Rail Yard Corridor', latitude: 28.6288, longitude: 77.2423, intensity: 0.94, surface_temp: 48.6, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Delhi', name: 'Connaught Place Outer Circle Concrete Flank', latitude: 28.632, longitude: 77.2195, intensity: 0.85, surface_temp: 45.2, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Delhi', name: 'Laxmi Nagar Vikas Marg Asphalt Choke', latitude: 28.644, longitude: 77.25, intensity: 0.88, surface_temp: 46.8, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Delhi', name: 'Anand Vihar ISBT Concrete Concourse', latitude: 28.6502, longitude: 77.3155, intensity: 0.96, surface_temp: 49.8, sensor_source: 'Sentinel-3 SLSTR' },
      { city: 'Delhi', name: 'Karol Bagh Market High-Albedo Rooftops', latitude: 28.6515, longitude: 77.1905, intensity: 0.82, surface_temp: 44.5, sensor_source: 'Landsat-9 TIRS' },

      // Mumbai
      { city: 'Mumbai', name: 'Dadar TT Circle Terminal Island', latitude: 19.0195, longitude: 72.8428, intensity: 0.89, surface_temp: 43.8, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Mumbai', name: 'BKC Central Commercial Concourse', latitude: 19.065, longitude: 72.868, intensity: 0.92, surface_temp: 45.5, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Mumbai', name: 'Kurla Junction Eastern Expressway Verge', latitude: 19.072, longitude: 72.885, intensity: 0.82, surface_temp: 42.9, sensor_source: 'Sentinel-3 SLSTR' },
      { city: 'Mumbai', name: 'Andheri East MV Road Metro Pillar Flank', latitude: 19.1197, longitude: 72.8655, intensity: 0.86, surface_temp: 44.1, sensor_source: 'Landsat-9 TIRS' },

      // Bengaluru
      { city: 'Bengaluru', name: 'Silk Board Junction Flyover Underpass', latitude: 12.9175, longitude: 77.6234, intensity: 0.87, surface_temp: 41.5, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Bengaluru', name: 'Majestic KSRTC Concrete Bus Platform', latitude: 12.977, longitude: 77.572, intensity: 0.79, surface_temp: 39.8, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Bengaluru', name: 'Whitefield ITPL Main Road Asphalt', latitude: 12.9855, longitude: 77.728, intensity: 0.84, surface_temp: 40.9, sensor_source: 'Landsat-9 TIRS' },

      // Ahmedabad
      { city: 'Ahmedabad', name: 'Ashram Road Multi-Lane Highway Verge', latitude: 23.032, longitude: 72.569, intensity: 0.95, surface_temp: 49.2, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Ahmedabad', name: 'SG Highway Prahladnagar Commercial Stretch', latitude: 23.048, longitude: 72.531, intensity: 0.91, surface_temp: 47.7, sensor_source: 'Landsat-9 TIRS' },
      { city: 'Ahmedabad', name: 'Kalupur Central Railway Apron', latitude: 23.025, longitude: 72.601, intensity: 0.89, surface_temp: 46.9, sensor_source: 'Sentinel-3 SLSTR' },
    ];

    const insertThermal = db.prepare(`
      INSERT INTO thermal_pockets (city, name, latitude, longitude, intensity, surface_temp, sensor_source)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const t of seedThermal) {
      insertThermal.run(t.city, t.name, t.latitude, t.longitude, t.intensity, t.surface_temp, t.sensor_source);
    }
    console.log(`✅ Pre-seeded ${seedThermal.length} verified satellite thermal pockets into SQLite.`);
  }
} catch (err) {
  console.error('Error seeding thermal pockets:', err);
}

// ==========================================
// 4. PRE-COMPUTED SHADE ROUTES TABLE & SEED
// ==========================================
db.exec(`
  CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    pair_id TEXT NOT NULL,
    title TEXT NOT NULL,
    origin_name TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    cool_name TEXT NOT NULL,
    cool_travel_time TEXT NOT NULL,
    cool_shade_pct INTEGER NOT NULL,
    cool_heat_reduction INTEGER NOT NULL,
    cool_distance_km REAL NOT NULL,
    cool_coordinates TEXT NOT NULL,
    cool_instructions TEXT NOT NULL,
    fastest_name TEXT NOT NULL,
    fastest_travel_time TEXT NOT NULL,
    fastest_shade_pct INTEGER NOT NULL,
    fastest_heat_exposure TEXT NOT NULL,
    fastest_distance_km REAL NOT NULL,
    fastest_coordinates TEXT NOT NULL,
    fastest_instructions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  const checkRoutes = db.prepare('SELECT COUNT(*) as count FROM routes');
  const routeCount = checkRoutes.get();

  if (routeCount && routeCount.count === 0) {
    const seedRoutes = [
      {
        city: 'Delhi',
        pair_id: 'delhi-cp-lodhi',
        title: 'Connaught Place ➔ Lodhi Garden Shaded Corridor',
        origin_name: 'Connaught Place Radial 3 (Metro Gate 2)',
        destination_name: 'Lodhi Garden Gate 2 (Canopy Walk)',
        cool_name: 'Recommended Cool Path (Janpath Canopy)',
        cool_travel_time: '14 min',
        cool_shade_pct: 82,
        cool_heat_reduction: 34,
        cool_distance_km: 1.6,
        cool_coordinates: JSON.stringify([
          [28.6315, 77.2167],
          [28.6258, 77.2185],
          [28.6189, 77.2182],
          [28.6082, 77.2168],
          [28.6015, 77.2189],
          [28.5933, 77.2197],
        ]),
        cool_instructions: JSON.stringify([
          'Start at CP Radial 3 — Walk through Central Park neem canopy (180m)',
          'Turn onto Janpath avenue shaded tree promenade (450m · 92% shade)',
          'Cross via Rajpath shaded green verge (200m)',
          'Continue through Lodhi Estate tree archway to Lodhi Garden Gate 2 (400m)',
        ]),
        fastest_name: 'Alternate Fastest Path (Barakhamba Direct)',
        fastest_travel_time: '12 min',
        fastest_shade_pct: 24,
        fastest_heat_exposure: 'High',
        fastest_distance_km: 1.4,
        fastest_coordinates: JSON.stringify([
          [28.6315, 77.2167],
          [28.6241, 77.2275],
          [28.6148, 77.2312],
          [28.6045, 77.2268],
          [28.5933, 77.2197],
        ]),
        fastest_instructions: JSON.stringify([
          'Exit CP directly via unshaded Outer Circle concrete flyover (350m)',
          'Follow Barakhamba asphalt corridor under direct midday sun (700m)',
          'Cross bare traffic intersection at Tolstoy Marg (250m)',
          'Direct asphalt approach to gate (200m · high radiant surface heat)',
        ]),
      },
      {
        city: 'Delhi',
        pair_id: 'delhi-ito-pragati',
        title: 'ITO Metro ➔ Pragati Maidan Walkway',
        origin_name: 'ITO Metro Gate 4 Concourse',
        destination_name: 'Pragati Maidan Bharat Mandapam Gate 7',
        cool_name: 'Tree-Covered Tilak Bridge Pedestrian Trail',
        cool_travel_time: '11 min',
        cool_shade_pct: 79,
        cool_heat_reduction: 29,
        cool_distance_km: 1.1,
        cool_coordinates: JSON.stringify([
          [28.6292, 77.2415],
          [28.6278, 77.2435],
          [28.6245, 77.2448],
          [28.6212, 77.2432],
        ]),
        cool_instructions: JSON.stringify([
          'Depart ITO Metro via shaded railway colony lane (250m)',
          'Walk under dense Gulmohar tree canopy along Tilak Lane (400m)',
          'Follow landscaped greenery path to Bharat Mandapam (350m)',
        ]),
        fastest_name: 'Exposed Mathura Road Flank',
        fastest_travel_time: '9 min',
        fastest_shade_pct: 18,
        fastest_heat_exposure: 'Severe',
        fastest_distance_km: 0.95,
        fastest_coordinates: JSON.stringify([
          [28.6292, 77.2415],
          [28.6255, 77.2422],
          [28.6212, 77.2432],
        ]),
        fastest_instructions: JSON.stringify([
          'Walk directly along exposed 8-lane Mathura Road highway (550m)',
          'Traverse unshaded concrete intersection with 51°C surface heat (400m)',
        ]),
      },
      {
        city: 'Mumbai',
        pair_id: 'mumbai-dadar-shivaji',
        title: 'Dadar Station ➔ Shivaji Park & Hindu Colony',
        origin_name: 'Dadar Station East Concourse',
        destination_name: 'Shivaji Park Perimeter Walkway',
        cool_name: 'Recommended Cool Path (Hindu Colony Canopies)',
        cool_travel_time: '14 min',
        cool_shade_pct: 82,
        cool_heat_reduction: 31,
        cool_distance_km: 1.3,
        cool_coordinates: JSON.stringify([
          [19.0182, 72.8432],
          [19.0205, 72.8455],
          [19.0238, 72.8482],
          [19.0265, 72.8441],
          [19.0278, 72.8398],
        ]),
        cool_instructions: JSON.stringify([
          'Exit Dadar Station via Shaded East Canopy walkway (120m)',
          'Walk along leafy Hindu Colony 1st Lane tree canopy (400m · 88% shade)',
          'Cross shaded circle at 5 Gardens rain tree stretch (350m)',
          'Enter Shivaji Park perimeter shaded path (250m)',
        ]),
        fastest_name: 'Alternate Fastest Path (Tilak Bridge Asphalt)',
        fastest_travel_time: '12 min',
        fastest_shade_pct: 19,
        fastest_heat_exposure: 'High',
        fastest_distance_km: 1.15,
        fastest_coordinates: JSON.stringify([
          [19.0182, 72.8432],
          [19.0212, 72.8415],
          [19.0245, 72.8402],
          [19.0278, 72.8398],
        ]),
        fastest_instructions: JSON.stringify([
          'Take unshaded Tilak Bridge concrete overpass directly (450m)',
          'Walk along unshaded asphalt bus terminal concourse (500m)',
          'Arrive via exposed street edge (150m)',
        ]),
      },
      {
        city: 'Bengaluru',
        pair_id: 'bengaluru-cubbon-vidhana',
        title: 'Cubbon Park ➔ Vidhana Soudha Promenade',
        origin_name: 'Cubbon Park Metro Exit 3',
        destination_name: 'Vidhana Soudha North Gate',
        cool_name: 'Recommended Cool Path (Bamboo Groves & Tree Arch)',
        cool_travel_time: '14 min',
        cool_shade_pct: 82,
        cool_heat_reduction: 36,
        cool_distance_km: 1.4,
        cool_coordinates: JSON.stringify([
          [12.9763, 77.5929],
          [12.9745, 77.5955],
          [12.9716, 77.5946],
          [12.9685, 77.5972],
        ]),
        cool_instructions: JSON.stringify([
          'Exit Cubbon Park shaded bamboo trail (300m)',
          'Walk through Vidhana Soudha tree-lined promenade (400m)',
          'Continue along shaded canopy boulevard to destination (300m)',
        ]),
        fastest_name: 'Alternate Fastest Path (Kasturba Road Direct)',
        fastest_travel_time: '12 min',
        fastest_shade_pct: 22,
        fastest_heat_exposure: 'High',
        fastest_distance_km: 1.2,
        fastest_coordinates: JSON.stringify([
          [12.9763, 77.5929],
          [12.9732, 77.5991],
          [12.9685, 77.5972],
        ]),
        fastest_instructions: JSON.stringify([
          'Direct asphalt transit along Kasturba Road traffic artery (650m)',
          'Concrete pavement exposed to peak solar radiation (350m)',
        ]),
      },
      {
        city: 'Ahmedabad',
        pair_id: 'ahmedabad-riverfront-vadaj',
        title: 'Vadaj Bus Station ➔ Sabarmati Riverfront Garden',
        origin_name: 'Vadaj BRTS Concourse',
        destination_name: 'Sabarmati Riverfront Shaded Promenade',
        cool_name: 'Recommended Cool Path (Riverfront Neem Trail)',
        cool_travel_time: '14 min',
        cool_shade_pct: 82,
        cool_heat_reduction: 35,
        cool_distance_km: 1.35,
        cool_coordinates: JSON.stringify([
          [23.0321, 72.5785],
          [23.0295, 72.5762],
          [23.0252, 72.5741],
          [23.0225, 72.5714],
        ]),
        cool_instructions: JSON.stringify([
          'Step into Riverfront Green Promenade tree border (350m)',
          'Follow planted Neem and Bougainvillea canopy arch (500m)',
          'Cross at shaded pedestrian overpass into Riverfront Garden (300m)',
        ]),
        fastest_name: 'Alternate Fastest Path (Ashram Road Highway)',
        fastest_travel_time: '12 min',
        fastest_shade_pct: 18,
        fastest_heat_exposure: 'High',
        fastest_distance_km: 1.1,
        fastest_coordinates: JSON.stringify([
          [23.0321, 72.5785],
          [23.0284, 72.5732],
          [23.0225, 72.5714],
        ]),
        fastest_instructions: JSON.stringify([
          'Ashram Road unshaded multi-lane asphalt highway (800m)',
          'Hot concrete crossing with no midday shade cover (200m)',
        ]),
      },
    ];

    const insertRouteStmt = db.prepare(`
      INSERT INTO routes (
        city, pair_id, title, origin_name, destination_name,
        cool_name, cool_travel_time, cool_shade_pct, cool_heat_reduction, cool_distance_km, cool_coordinates, cool_instructions,
        fastest_name, fastest_travel_time, fastest_shade_pct, fastest_heat_exposure, fastest_distance_km, fastest_coordinates, fastest_instructions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of seedRoutes) {
      insertRouteStmt.run(
        r.city,
        r.pair_id,
        r.title,
        r.origin_name,
        r.destination_name,
        r.cool_name,
        r.cool_travel_time,
        r.cool_shade_pct,
        r.cool_heat_reduction,
        r.cool_distance_km,
        r.cool_coordinates,
        r.cool_instructions,
        r.fastest_name,
        r.fastest_travel_time,
        r.fastest_shade_pct,
        r.fastest_heat_exposure,
        r.fastest_distance_km,
        r.fastest_coordinates,
        r.fastest_instructions
      );
    }
    console.log(`✅ Pre-seeded ${seedRoutes.length} dual cool/fastest routes into SQLite.`);
  }
} catch (err) {
  console.error('Error seeding routes:', err);
}

// ==========================================
// 5. ADVISOR CONSULTATIONS LOG TABLE
// ==========================================
db.exec(`
  CREATE TABLE IF NOT EXISTS advisor_consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    user_query TEXT,
    temperature REAL,
    humidity REAL,
    aqi REAL,
    demographic TEXT,
    advisory_level TEXT,
    response_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
