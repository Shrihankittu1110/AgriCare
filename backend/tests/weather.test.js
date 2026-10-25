import request from 'supertest';
import app from '../src/app.js';

describe('Weather API Tests', () => {
  it('should return current weather, 7-day forecast, and agronomic alerts', async () => {
    const res = await request(app)
      .get('/api/weather/current')
      .query({ lat: 16.3067, lon: 80.4365, locationName: 'Guntur' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.weather).toBeDefined();
    expect(res.body.weather.current).toBeDefined();
    expect(typeof res.body.weather.current.temperature).toBe('number');
    expect(typeof res.body.weather.current.humidity).toBe('number');
    expect(Array.isArray(res.body.weather.forecast)).toBe(true);
    expect(res.body.weather.forecast.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.weather.agronomyAlerts)).toBe(true);
  });

  it('should search for locations matching query', async () => {
    const res = await request(app)
      .get('/api/weather/search')
      .query({ q: 'Hyderabad' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.locations)).toBe(true);
  });

  it('should return 400 for too short search queries', async () => {
    const res = await request(app)
      .get('/api/weather/search')
      .query({ q: 'a' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
