import api from '../config/api';

const paymentService = {
    /**
     * Create a payment intent on the backend
     * @param {number} amount - Amount in INR
     * @param {string} bookingId - Optional booking ID
     * @returns {Promise<{success: boolean, clientSecret?: string, error?: string}>}
     */
    createPaymentIntent: async (amount, bookingId = '') => {
        try {
            const response = await api.post('/payments/create-intent', {
                amount,
                bookingId
            });

            if (response.data.status === 'success') {
                return {
                    success: true,
                    clientSecret: response.data.data.clientSecret,
                    paymentIntentId: response.data.data.paymentIntentId
                };
            }
            return {
                success: false,
                error: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to create payment intent'
            };
        }
    },

    /**
     * Confirm payment completion on the backend
     * @param {string} paymentIntentId 
     * @param {string} bookingId 
     * @returns {Promise<{success: boolean, booking?: any, error?: string}>}
     */
    confirmPayment: async (paymentIntentId, bookingId) => {
        try {
            const response = await api.post('/payments/confirm', {
                paymentIntentId,
                bookingId
            });

            if (response.data.status === 'success') {
                return {
                    success: true,
                    booking: response.data.data.booking
                };
            }
            return {
                success: false,
                error: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to confirm payment'
            };
        }
    },

    /**
     * Get status of a payment intent
     * @param {string} id - Payment intent ID
     */
    getPaymentStatus: async (id) => {
        try {
            const response = await api.get(`/payments/${id}/status`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

export default paymentService;
