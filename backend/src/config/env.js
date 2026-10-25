import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agricare',
  jwtSecret: process.env.JWT_SECRET || 'agricare-super-secret-jwt-key-2026-production-ready',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Weather
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  weatherProvider: process.env.WEATHER_PROVIDER || 'open-meteo', // 'open-meteo' or 'openweather'
  
  // AI Provider (Gemini / OpenAI)
  aiProviderApiKey: process.env.AI_PROVIDER_API_KEY || process.env.GEMINI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gemini-1.5-flash',
  
  // Crop detection
  cropDetectionProvider: process.env.CROP_DETECTION_PROVIDER || 'auto', // 'auto', 'gemini', 'demo'
  
  // Storage
  uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
};
