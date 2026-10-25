import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout network failure
    } finally {
      localStorage.removeItem('agricare_token');
      localStorage.removeItem('agricare_user');
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.patch('/users/profile', profileData);
    return res.data;
  },

  async getPreferences() {
    const res = await api.get('/users/preferences');
    return res.data;
  },

  async updatePreferences(prefData) {
    const res = await api.patch('/users/preferences', prefData);
    return res.data;
  },
};
