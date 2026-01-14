import axios from 'axios';

// API Configuration
// In production (Vercel), import.meta.env.VITE_API_URL should be set
// In development, it defaults to the local backend on port 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
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
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('travelease_user');
            // Trigger a page reload or event to redirect to login
            console.log('Session expired, please login again');
            // Optionally: window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
