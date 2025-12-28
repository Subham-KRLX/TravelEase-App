import api from '../config/api';

const hotelService = {
    // Search hotels
    searchHotels: async (params) => {
        try {
            console.log('Searching hotels with params:', params);
            const response = await api.get('/hotels/search', { params });
            console.log('Raw response:', response.data);
            
            const hotels = response.data.data.hotels;
            console.log('Extracted hotels count:', hotels?.length || 0);
            
            return {
                success: true,
                hotels: hotels || [],
                results: response.data.results
            };
        } catch (error) {
            console.error('Hotel service error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Hotel search failed'
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
    }
};

export default hotelService;
