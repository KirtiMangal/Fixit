import apiClient from './apiClient';

export const expertService = {
  searchExperts: async (params = {}) => {
    const response = await apiClient.get('/api/experts', { params });
    return response.data;
  },

  getExpertById: async (id) => {
    const response = await apiClient.get(`/api/experts/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await apiClient.get('/api/experts/me');
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await apiClient.put('/api/experts/me', data);
    return response.data;
  },

  bookSession: async (data) => {
    const response = await apiClient.post('/api/learning-sessions', data);
    return response.data;
  },

  getMyCustomerSessions: async () => {
    const response = await apiClient.get('/api/learning-sessions/my');
    return response.data;
  },

  getMyExpertSessions: async () => {
    const response = await apiClient.get('/api/learning-sessions/expert');
    return response.data;
  },

  completeSession: async (id, data) => {
    const response = await apiClient.put(`/api/learning-sessions/${id}/complete`, data);
    return response.data;
  },
};

export default expertService;
