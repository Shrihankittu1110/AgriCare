import api from './api';

export const assistantService = {
  async sendMessage({ message, language, cropScanId, weatherContext }) {
    const res = await api.post('/assistant/chat', {
      message,
      language,
      cropScanId,
      weatherContext,
    });
    return res.data;
  },

  async getConversation() {
    const res = await api.get('/assistant/conversation');
    return res.data;
  },

  async clearConversation() {
    const res = await api.delete('/assistant/conversation');
    return res.data;
  },
};
