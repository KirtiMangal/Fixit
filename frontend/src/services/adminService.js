import apiClient from './apiClient';

export const adminService = {
  getMetrics: async () => {
    const response = await apiClient.get('/api/admin/metrics');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await apiClient.put(`/api/admin/users/${id}/role?role=${role}`);
    return response.data;
  },

  getAllExperts: async () => {
    const response = await apiClient.get('/api/admin/experts');
    return response.data;
  },

  verifyExpert: async (id) => {
    const response = await apiClient.put(`/api/admin/experts/${id}/verify`);
    return response.data;
  },

  rejectExpert: async (id) => {
    const response = await apiClient.put(`/api/admin/experts/${id}/reject`);
    return response.data;
  },
};

export default adminService;
