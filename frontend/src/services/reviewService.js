import apiClient from './apiClient';

export const reviewService = {
  submitReview: async (data) => {
    const response = await apiClient.post('/api/reviews', data);
    return response.data;
  },

  getReviewsForUser: async (userId) => {
    const response = await apiClient.get(`/api/reviews/user/${userId}`);
    return response.data;
  },
};

export default reviewService;
