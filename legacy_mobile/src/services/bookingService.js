import api from '../config/api';

const bookingService = {
    // Create booking
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
                error: error.response?.data?.message || 'Booking failed'
            };
        }
    },

    // Get all user bookings
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

    // Get booking details
    getBookingDetails: async (id) => {
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

    // Cancel booking
    cancelBooking: async (id, reason) => {
        try {
            const response = await api.put(`/bookings/${id}/cancel`, { reason });
            return {
                success: true,
                booking: response.data.data.booking
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Cancellation failed'
            };
        }
    }
};

export default bookingService;
