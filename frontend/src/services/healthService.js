import apiClient from './apiClient';

/**
 * Health Service to check backend availability.
 * Calls GET /api/health
 */
export const checkBackendHealth = async () => {
  const response = await apiClient.get('/api/health');
  return response.data;
};

export default {
  checkBackendHealth,
};
