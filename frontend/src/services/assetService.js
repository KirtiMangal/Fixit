import apiClient from './apiClient';

export const assetService = {
  /**
   * Register a new thing / asset
   * @param {Object} data { name, category, brand, model, purchaseDate, warrantyEndDate, notes }
   */
  createAsset: async (data) => {
    const response = await apiClient.post('/api/assets', data);
    return response.data;
  },

  /**
   * Get all things / assets owned by the currently authenticated user
   */
  getMyAssets: async () => {
    const response = await apiClient.get('/api/assets');
    return response.data;
  },

  /**
   * Get specific asset by ID
   * @param {number|string} id
   */
  getAssetById: async (id) => {
    const response = await apiClient.get(`/api/assets/${id}`);
    return response.data;
  },

  /**
   * Update an existing asset
   * @param {number|string} id
   * @param {Object} data
   */
  updateAsset: async (id, data) => {
    const response = await apiClient.put(`/api/assets/${id}`, data);
    return response.data;
  },

  /**
   * Delete an asset
   * @param {number|string} id
   */
  deleteAsset: async (id) => {
    const response = await apiClient.delete(`/api/assets/${id}`);
    return response.data;
  },
};

export default assetService;
