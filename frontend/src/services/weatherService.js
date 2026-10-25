import api from './api';
import axios from 'axios';

export const weatherService = {
  async getWeather(lat, lon, locationName) {
    const params = {};
    if (lat) params.lat = lat;
    if (lon) params.lon = lon;
    if (locationName) params.locationName = locationName;

    const res = await api.get('/weather/current', { params });
    return res.data;
  },

  async searchLocations(query) {
    if (!query || query.trim().length < 2) {
      return { success: true, count: 0, locations: [] };
    }

    // 1. Try backend geocoding endpoint first
    try {
      const res = await api.get('/weather/search', { params: { q: query.trim() } });
      if (res.data?.success && res.data?.locations?.length > 0) {
        return res.data;
      }
    } catch (apiErr) {
      console.warn('[WeatherService] Backend search failed, using direct geocoding fallback:', apiErr.message);
    }

    // 2. Client-side direct Open-Meteo geocoding (fast, free, global, no CORS issues, no key required)
    try {
      const directRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: query.trim(),
          count: 8,
          language: 'en',
          format: 'json',
        },
        timeout: 8000,
      });

      const results = directRes.data?.results || [];
      const locations = results.map((loc) => ({
        name: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}${loc.country ? `, ${loc.country}` : ''}`,
        latitude: loc.latitude,
        longitude: loc.longitude,
        country: loc.country,
        region: loc.admin1,
      }));

      return {
        success: true,
        count: locations.length,
        locations,
      };
    } catch (directErr) {
      console.error('[WeatherService] Direct geocoding fallback failed:', directErr.message);
      return { success: false, count: 0, locations: [] };
    }
  },

  // Reverse geocode device GPS coordinates to a friendly city/district name
  async reverseGeocode(latitude, longitude) {
    try {
      const res = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        { timeout: 7000 }
      );
      const data = res.data;
      const city = data.locality || data.city || data.principalSubdivision || 'Farm Location';
      const state = data.principalSubdivision ? `, ${data.principalSubdivision}` : '';
      const country = data.countryName ? `, ${data.countryName}` : '';
      return `${city}${state}${country}`;
    } catch (err) {
      console.warn('Reverse geocode error, fallback to coordinates:', err.message);
      return `Farm Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
    }
  },
};
