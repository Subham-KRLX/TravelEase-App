import api from '../config/api';

const flightService = {
    // Search flights
    searchFlights: async (params) => {
        try {
            const response = await api.get('/flights/search', { params });
            return {
                success: true,
                flights: response.data.data.flights,
                results: response.data.results
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Flight search failed'
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
    }
};

export default flightService;
