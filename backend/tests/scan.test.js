import request from 'supertest';
import app from '../src/app.js';
import path from 'path';
import fs from 'fs';

describe('Crop Scan API Tests', () => {
  let authToken = '';

  beforeEach(async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Scan Tester',
      email: 'scantester@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    authToken = regRes.body.token;
  });

  it('should reject scan analysis when no image file is provided', async () => {
    const res = await request(app)
      .post('/api/scans/analyze')
      .set('Authorization', `Bearer ${authToken}`)
      .field('language', 'en');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should retrieve scans list for authenticated user', async () => {
    const res = await request(app)
      .get('/api/scans')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.scans)).toBe(true);
  });
});
