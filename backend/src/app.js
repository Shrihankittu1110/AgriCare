import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://agri-care-sand.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');
      const isAllowed =
        allowedOrigins.some((o) => o && o.replace(/\/+$/, '') === cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Rate Limiting (150 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Body parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Static file serving for uploaded crop images
app.use('/uploads', express.static(config.uploadDir));

// Health check endpoints
const healthCheckHandler = async (req, res) => {
  let userCount = 0;
  try {
    userCount = await mongoose.connection.db?.collection('users')?.countDocuments() ?? 0;
  } catch (e) {
    // ignore
  }

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AgriCare AI Backend API',
    version: '1.0.0',
    environment: config.nodeEnv,
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      userCount,
      isAtlas: mongoose.connection.host?.includes('mongodb.net') || false,
    },
    providers: {
      weather: config.weatherApiKey ? 'OpenWeatherMap API' : 'Open-Meteo (Free Meteorological Service)',
      ai: config.aiProviderApiKey ? `Gemini (${config.aiModel})` : 'AgriCare Agronomy Demo Engine',
      vision: config.aiProviderApiKey ? `Gemini Vision (${config.aiModel})` : 'AgriCare Pathology Demo Engine',
    },
  });
};

app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

// Mount API routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/users', userRoutes);

// Also mount without /api prefix for flexibility with deployed frontend URLs
app.use('/auth', authRoutes);
app.use('/scans', scanRoutes);
app.use('/weather', weatherRoutes);
app.use('/assistant', assistantRoutes);
app.use('/users', userRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
