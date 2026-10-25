import mongoose from 'mongoose';
import fs from 'fs';
import { config } from './env.js';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    // Attempt standard connection to configured URI
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2000, // Quick timeout to fallback if local mongod is not running
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Primary MongoDB connection failed (${err.message}).`);

    // In development or test, fall back to in-memory MongoDB server so the app runs out-of-the-box
    if (config.nodeEnv !== 'production') {
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
