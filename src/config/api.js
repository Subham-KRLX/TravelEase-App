import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// In production (Vercel), EXPO_PUBLIC_API_URL will be set via environment variables
// In development, it falls back to the deployed backend
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://travelease-api-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('travelease_user');
            // You might want to trigger a redirect to login here via a navigation service or event
            console.log('Session expired, please login again');
        }
        return Promise.reject(error);
    }
);

export default api;
