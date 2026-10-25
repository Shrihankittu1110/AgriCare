import request from 'supertest';
import app from '../src/app.js';

describe('Authentication API Tests', () => {
  const sampleUser = {
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@example.com',
    password: 'secureFarmPassword123',
    confirmPassword: 'secureFarmPassword123',
    preferredLanguage: 'hi',
    location: {
      name: 'Indore, Madhya Pradesh',
      latitude: 22.7196,
      longitude: 75.8577,
    },
  };

  it('should successfully register a new farmer account', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(sampleUser.email);
    expect(res.body.user.preferredLanguage).toBe('hi');
  });

  it('should reject registration when password is shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        ...sampleUser,
        email: 'invalid.pwd@example.com',
        password: '123',
        confirmPassword: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should prevent duplicate registration with the same email', async () => {
    await request(app).post('/api/auth/register').send(sampleUser);

    const duplicateRes = await request(app).post('/api/auth/register').send(sampleUser);

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
  });

  it('should successfully log in an existing user and return a JWT', async () => {
    await request(app).post('/api/auth/register').send(sampleUser);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: sampleUser.email,
      password: sampleUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.name).toBe(sampleUser.name);
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(sampleUser);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: sampleUser.email,
      password: 'wrongPassword',
    });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.success).toBe(false);
  });

  it('should access protected profile route /api/auth/me with valid Bearer token', async () => {
    const regRes = await request(app).post('/api/auth/register').send(sampleUser);
    const token = regRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.user.email).toBe(sampleUser.email);
  });

  it('should reject /api/auth/me without an authentication token', async () => {
    const meRes = await request(app).get('/api/auth/me');

    expect(meRes.status).toBe(401);
    expect(meRes.body.success).toBe(false);
  });
});
