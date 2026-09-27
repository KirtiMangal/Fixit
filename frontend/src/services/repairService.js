import apiClient from './apiClient';

export const repairService = {
  getMyRepairs: async () => {
    const response = await apiClient.get('/api/repair-records/my');
    return response.data;
  },

  getAssetRepairs: async (assetId) => {
    const response = await apiClient.get(`/api/repair-records/asset/${assetId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/api/repair-records/stats');
    return response.data;
  },
};

export default repairService;
