import api from '../config/api';

const flightService = {
    // Search flights
    searchFlights: async (params) => {
        try {
            console.log('🔍 Searching flights with params:', params);

            // Validate params
            // Removed client-side validation to allow "explore all" functionality
            // if (!params.origin || !params.destination) {
            //     return {
            //         success: false,
            //         error: 'Please provide origin and destination cities'
            //     };
            // }

            const response = await api.get('/flights/search', { params });

            console.log('✅ Flight search response:', response.data);

            return {
                success: true,
                flights: response.data.data?.flights || [],
                results: response.data.results || 0,
                message: response.data.message
            };
        } catch (error) {
            console.error('❌ Flight search failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Flight search failed';
            return {
                success: false,
                flights: [],
                error: errorMsg
            };
        }
    },

    // Get flight details
    getFlightDetails: async (id) => {
        try {
            const response = await api.get(`/flights/${id}`);
            return {
                success: true,
                flight: response.data.data.flight
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch flight details'
            };
        }
    },

    // Get popular routes
    getPopularRoutes: async () => {
        try {
            const response = await api.get('/flights/popular-routes');
            return {
                success: true,
                routes: response.data.data.routes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Debug: Get all flights
    getAllFlights: async () => {
        try {
            const response = await api.get('/flights/debug/all');
            return {
                success: true,
                flights: response.data.data?.flights || []
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export default flightService;
