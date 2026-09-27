import apiClient from './apiClient';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data { name, email, password, phone, role }
   */
  register: async (data) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  /**
   * Login user with credentials
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Fetch currently authenticated user profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  /**
   * Test role-based authorization endpoint
   * @param {string} role ('customer', 'technician', 'expert', 'admin')
   */
  testRoleAccess: async (role) => {
    const response = await apiClient.get(`/api/test/${role.toLowerCase()}`);
    return response.data;
  },
};

export default authService;
