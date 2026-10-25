import { connectDB, disconnectDB } from '../src/config/db.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  // Clean up collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
