import mongoose from 'mongoose';
import fs from 'fs';
import dns from 'dns';
import { config } from './env.js';

// Ensure DNS SRV records resolve reliably on Windows for MongoDB Atlas
if (config.mongodbUri.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    console.warn('[Database] Could not set custom DNS servers:', dnsErr.message);
  }
}

let mongodInstance = null;

export const connectDB = async () => {
  try {
    console.log(`[Database] Connecting to MongoDB: ${config.mongodbUri.replace(/:([^:@]+)@/, ':****@')}...`);
    // Attempt standard connection to configured URI
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Primary MongoDB connection failed (${err.message}).`);

    // In local development or test ONLY (never on Render production), fall back to in-memory MongoDB
    if (config.nodeEnv !== 'production' && !process.env.RENDER) {
      try {
        console.log('[Database] Starting in-memory MongoDB server fallback...');
        const systemBinaryPaths = [
          'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
          'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe',
        ];

        for (const binaryPath of systemBinaryPaths) {
          if (fs.existsSync(binaryPath)) {
            process.env.MONGOMS_SYSTEM_BINARY = binaryPath;
            break;
          }
        }

        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create({
          instance: {
            dbName: 'agricare_dev',
          },
        });
        const memoryUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] In-memory MongoDB Connected successfully: ${memoryUri}`);
        return conn;
      } catch (memoryErr) {
        console.error('[Database] In-memory MongoDB failed to start:', memoryErr.message);
        throw memoryErr;
      }
    } else {
      throw err;
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[Database] Disconnected cleanly');
  } catch (err) {
    console.error('[Database] Error disconnecting:', err.message);
  }
};
