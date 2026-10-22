import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import reportsRoutes from './routes/reports.js';
import telemetryRoutes from './routes/telemetry.js';
import adminRoutes from './routes/admin.js';
import dispatchesRoutes from './routes/dispatches.js';
import advisorRoutes from './routes/advisor.js';
import routesRoutes from './routes/routes.js';
import './db.js'; // Ensure database initialization

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dispatches', dispatchesRoutes);
app.use('/api/advisor', advisorRoutes);
app.use('/api/routes', routesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'BioCanopy Backend API',
    database: 'SQLite',
    services: {
      advisor: 'Gemini AI & Clinical Rules Engine v2.4',
      routing: 'OSRM Walking & Canopy Optimization',
      telemetry: 'Open-Meteo Live API',
      reports: 'SQLite Geotagged Hazards',
      dispatches: 'Municipal Planting Queue',
    },
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`\n🌿 ==========================================`);
  console.log(`🚀 BioCanopy Backend Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🧠 AI Advisor API: http://localhost:${PORT}/api/advisor`);
  console.log(`🗺️ Routing & Heat Map API: http://localhost:${PORT}/api/routes`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: SQLite (server/database.sqlite)`);
  console.log(`==========================================\n`);
});
