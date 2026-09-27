import apiClient from './apiClient';

export const recommendationService = {
  getRecommendations: async () => {
    const response = await apiClient.get('/api/recommendations');
    return response.data;
  },
};

export default recommendationService;
