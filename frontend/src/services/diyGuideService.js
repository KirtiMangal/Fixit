import apiClient from './apiClient';

export const diyGuideService = {
  getGuides: async (params = {}) => {
    const response = await apiClient.get('/api/diy-guides', { params });
    return response.data;
  },

  getGuideById: async (id) => {
    const response = await apiClient.get(`/api/diy-guides/${id}`);
    return response.data;
  },

  completeGuide: async (id, assetId = null) => {
    const url = assetId ? `/api/diy-guides/${id}/complete?assetId=${assetId}` : `/api/diy-guides/${id}/complete`;
    const response = await apiClient.post(url);
    return response.data;
  },
};

export default diyGuideService;
