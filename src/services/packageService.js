import api from './api';

const packageService = {
    // Search packages with filters
    searchPackages: async (params = {}) => {
        try {
            const response = await api.get('/packages/search', { params });
            return {
                success: true,
                packages: response.data.data.packages,
                results: response.data.results
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to search packages'
            };
        }
    },

    // Get package details by ID
    getPackageById: async (id) => {
        try {
            const response = await api.get(`/packages/${id}`);
            return {
                success: true,
                package: response.data.data.package
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch package details'
            };
        }
    },

    // Get popular packages
    getPopularPackages: async () => {
        try {
            const response = await api.get('/packages/popular');
            return {
                success: true,
                packages: response.data.data.packages
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch popular packages'
            };
        }
    }
};

export default packageService;
