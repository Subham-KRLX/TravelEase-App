import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
    // Register new user
    signup: async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            if (response.data.status === 'success') {
                const { token, user } = response.data.data;
                await AsyncStorage.setItem('auth_token', token);
                await AsyncStorage.setItem('travelease_user', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            console.error('Signup Error Details:', error.response ? error.response.data : error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Signup failed'
            };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.status === 'success') {
                const { token, user } = response.data.data;
                await AsyncStorage.setItem('auth_token', token);
                await AsyncStorage.setItem('travelease_user', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            console.error('Login Error Details:', error.response ? error.response.data : error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    },

    // Mock Google Login (Demo Login)
    googleLogin: async () => {
        try {
            const response = await api.post('/auth/demo-login', {});
            if (response.data.status === 'success') {
                const { token, user } = response.data.data;
                await AsyncStorage.setItem('auth_token', token);
                await AsyncStorage.setItem('travelease_user', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Google Auth failed'
            };
        }
    },

    // Logout user
    logout: async () => {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('travelease_user');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: 'Logout failed' };
        }
    },

    // Get current user profile
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.status === 'success') {
                const { user } = response.data.data;
                await AsyncStorage.setItem('travelease_user', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, error: 'Failed to fetch profile' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update profile
    updateProfile: async (data) => {
        try {
            const response = await api.put('/auth/profile', data);
            if (response.data.status === 'success') {
                const { user } = response.data.data;
                await AsyncStorage.setItem('travelease_user', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Update failed'
            };
        }
    }
};

export default authService;
