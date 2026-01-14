import api from '../config/api';

const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return {
        success: true,
        booking: response.data.data.booking
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create booking'
      };
    }
  },

  // Get all bookings for the current user
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return {
        success: true,
        bookings: response.data.data.bookings
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch bookings'
      };
    }
  },

  // Get booking details by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return {
        success: true,
        booking: response.data.data.booking
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch booking details'
      };
    }
  },

  // Cancel a booking
  cancelBooking: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel booking'
      };
    }
  }
};

export default bookingService;
