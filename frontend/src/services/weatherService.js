import api from './api';

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
    const res = await api.get('/weather/search', { params: { q: query } });
    return res.data;
  },
};
