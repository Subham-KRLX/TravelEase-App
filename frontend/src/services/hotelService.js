import api from '../config/api';

const hotelService = {
    // Search hotels
    searchHotels: async (params) => {
        try {
            console.log('🔍 Searching hotels with params:', params);

            // Validate params
            // Removed client-side validation to allow "explore all" functionality
            // if (!params.city) {
            //     return {
            //         success: false,
            //         error: 'Please provide a city name'
            //     };
            // }

            const response = await api.get('/hotels/search', { params });

            console.log('✅ Hotel search response:', response.data);

            const hotels = response.data.data?.hotels || [];

            return {
                success: true,
                hotels: hotels,
                results: response.data.results || 0,
                message: response.data.message
            };
        } catch (error) {
            console.error('❌ Hotel search failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Hotel search failed';
            return {
                success: false,
                hotels: [],
                error: errorMsg
            };
        }
    },

    // Get hotel details
    getHotelDetails: async (id) => {
        try {
            const response = await api.get(`/hotels/${id}`);
            return {
                success: true,
                hotel: response.data.data.hotel
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch hotel details'
            };
        }
    },

    // Get nearby hotels
    getNearbyHotels: async (latitude, longitude) => {
        try {
            const response = await api.get('/hotels/nearby', {
                params: { latitude, longitude }
            });
            return {
                success: true,
                hotels: response.data.data.hotels
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get popular destinations
    getPopularDestinations: async () => {
        try {
            const response = await api.get('/hotels/popular-destinations');
            return {
                success: true,
                destinations: response.data.data.destinations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Debug: Get all hotels
    getAllHotels: async () => {
        try {
            const response = await api.get('/hotels/debug/all');
            return {
                success: true,
                hotels: response.data.data?.hotels || []
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export default hotelService;
