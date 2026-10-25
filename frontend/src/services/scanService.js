import api from './api';

export const scanService = {
  async analyzeCrop(formData) {
    const res = await api.post('/scans/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000,
    });
    return res.data;
  },

  async getScans(params = {}) {
    const res = await api.get('/scans', { params });
    return res.data;
  },

  async getScanById(id) {
    const res = await api.get(`/scans/${id}`);
    return res.data;
  },

  async deleteScan(id) {
    const res = await api.delete(`/scans/${id}`);
    return res.data;
  },

  async translateScan(id, language) {
    const res = await api.post(`/scans/${id}/translate`, { language });
    return res.data;
  },
};
