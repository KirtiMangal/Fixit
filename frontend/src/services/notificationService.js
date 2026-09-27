import apiClient from './apiClient';

export const notificationService = {
  getMyNotifications: async () => {
    const response = await apiClient.get('/api/notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put('/api/notifications/read-all');
    return response.data;
  },
};

export default notificationService;
