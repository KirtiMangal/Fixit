import apiClient from './apiClient';

export const technicianService = {
  /**
   * Search verified technicians with optional category, area, availability filters
   */
  searchTechnicians: async (params = {}) => {
    const response = await apiClient.get('/api/technicians', { params });
    return response.data;
  },

  /**
   * Get specific technician profile by ID
   */
  getTechnicianById: async (id) => {
    const response = await apiClient.get(`/api/technicians/${id}`);
    return response.data;
  },

  /**
   * Get own profile (for logged in Technician)
   */
  getMyProfile: async () => {
    const response = await apiClient.get('/api/technicians/me');
    return response.data;
  },

  /**
   * Update own profile (for logged in Technician)
   */
  updateMyProfile: async (data) => {
    const response = await apiClient.put('/api/technicians/me', data);
    return response.data;
  },

  /**
   * Admin: get all technician profiles
   */
  getAllProfilesForAdmin: async () => {
    const response = await apiClient.get('/api/admin/technicians');
    return response.data;
  },

  /**
   * Admin: verify technician
   */
  verifyTechnician: async (id) => {
    const response = await apiClient.put(`/api/admin/technicians/${id}/verify`);
    return response.data;
  },

  /**
   * Admin: reject technician
   */
  rejectTechnician: async (id) => {
    const response = await apiClient.put(`/api/admin/technicians/${id}/reject`);
    return response.data;
  },
};

export default technicianService;
