import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabaseIfEmpty } from './seed.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import programRoutes from './routes/programRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/programs', programRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'Sri Amman Biocare API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend build (if present)
const possibleDistPaths = [
  path.join(__dirname, '..', 'frontend', 'dist'),
  path.join(process.cwd(), 'frontend', 'dist'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'public'),
];

const frontendDist = possibleDistPaths.find(p => fs.existsSync(path.join(p, 'index.html')));

if (frontendDist) {
  console.log(`[Frontend] Serving production build from: ${frontendDist}`);
  app.use(express.static(frontendDist));

  // SPA fallback for React Router (supports Express 4 & Express 5 safely)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
} else {
  console.warn('[Frontend WARNING] frontend/dist not found! Looked in:', possibleDistPaths);
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>🌿 Sri Amman Biocare API is Running</h2>
        <p>The backend server is online and connected.</p>
        <p style="color: #666;">Note: Frontend build was not found in <code>frontend/dist</code>.</p>
        <p><a href="/api/health" style="color: #15803d; font-weight: bold;">Check API Health Endpoint</a></p>
      </div>
    `);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize Database & Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabaseIfEmpty();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🌱 Sri Amman Biocare Backend Server Running`);
      console.log(`🚀 Port: http://localhost:${PORT}`);
      console.log(`📡 API Endpoints: http://localhost:${PORT}/api/`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
