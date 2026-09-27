import apiClient from './apiClient';

export const serviceRequestService = {
  /**
   * Customer creates a service request
   */
  createRequest: async (data) => {
    const response = await apiClient.post('/api/service-requests', data);
    return response.data;
  },

  /**
   * Customer retrieves their service requests
   */
  getMyCustomerRequests: async () => {
    const response = await apiClient.get('/api/service-requests/my');
    return response.data;
  },

  /**
   * Technician retrieves requests assigned to them
   */
  getMyTechnicianRequests: async () => {
    const response = await apiClient.get('/api/service-requests/technician');
    return response.data;
  },

  /**
   * Get request details by ID
   */
  getRequestById: async (id) => {
    const response = await apiClient.get(`/api/service-requests/${id}`);
    return response.data;
  },

  /**
   * Technician accepts request
   */
  acceptRequest: async (id) => {
    const response = await apiClient.put(`/api/service-requests/${id}/accept`);
    return response.data;
  },

  /**
   * Technician rejects request
   */
  rejectRequest: async (id) => {
    const response = await apiClient.put(`/api/service-requests/${id}/reject`);
    return response.data;
  },

  /**
   * Technician starts job (IN_PROGRESS)
   */
  startRequest: async (id) => {
    const response = await apiClient.put(`/api/service-requests/${id}/start`);
    return response.data;
  },

  /**
   * Technician marks job completed with final cost & resolution summary
   */
  completeRequest: async (id, data) => {
    const response = await apiClient.put(`/api/service-requests/${id}/complete`, data);
    return response.data;
  },

  /**
   * Customer cancels request
   */
  cancelRequest: async (id) => {
    const response = await apiClient.put(`/api/service-requests/${id}/cancel`);
    return response.data;
  },
};

export default serviceRequestService;
