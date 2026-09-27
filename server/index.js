import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'BioCanopy Backend API',
    database: 'SQLite',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`\n🌿 ==========================================`);
  console.log(`🚀 BioCanopy Backend Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: SQLite (server/database.sqlite)`);
  console.log(`==========================================\n`);
});
