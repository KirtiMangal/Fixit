import apiClient from './apiClient';

export const maintenanceService = {
  getMyReminders: async () => {
    const response = await apiClient.get('/api/maintenance-reminders');
    return response.data;
  },

  createReminder: async (data) => {
    const response = await apiClient.post('/api/maintenance-reminders', data);
    return response.data;
  },

  completeReminder: async (id) => {
    const response = await apiClient.put(`/api/maintenance-reminders/${id}/complete`);
    return response.data;
  },

  deleteReminder: async (id) => {
    const response = await apiClient.delete(`/api/maintenance-reminders/${id}`);
    return response.data;
  },
};

export default maintenanceService;
