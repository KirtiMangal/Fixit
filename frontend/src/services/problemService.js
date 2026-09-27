import apiClient from './apiClient';

export const problemService = {
  /**
   * Create / Report a new problem
   * @param {Object} data { title, description, category, subcategory, severity }
   */
  createProblem: async (data) => {
    const response = await apiClient.post('/api/problems', data);
    return response.data;
  },

  /**
   * Get problems reported by the currently authenticated user
   */
  getMyProblems: async () => {
    const response = await apiClient.get('/api/problems/my');
    return response.data;
  },

  /**
   * Get all platform problems (Admin only)
   */
  getAllProblems: async () => {
    const response = await apiClient.get('/api/problems');
    return response.data;
  },

  /**
   * Get specific problem by ID
   * @param {number|string} id
   */
  getProblemById: async (id) => {
    const response = await apiClient.get(`/api/problems/${id}`);
    return response.data;
  },

  /**
   * Update problem details
   * @param {number|string} id
   * @param {Object} data
   */
  updateProblem: async (id, data) => {
    const response = await apiClient.put(`/api/problems/${id}`, data);
    return response.data;
  },

  /**
   * Delete problem
   * @param {number|string} id
   */
  deleteProblem: async (id) => {
    const response = await apiClient.delete(`/api/problems/${id}`);
    return response.data;
  },

  /**
   * Request AI Diagnosis for a problem
   * @param {number|string} id
   */
  diagnoseProblem: async (id) => {
    const response = await apiClient.post(`/api/problems/${id}/diagnose`);
    return response.data;
  },

  /**
   * Get similar historical problems and community resolutions
   * @param {number|string} id
   */
  getSimilarProblems: async (id) => {
    const response = await apiClient.get(`/api/problems/${id}/similar`);
    return response.data;
  },
};

export default problemService;
