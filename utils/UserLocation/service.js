import axios from 'axios';

const base_url = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: base_url,
    timeout: 10000,
});

// Add request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const userService = {
    // Get all users with pagination
    getUsers: async (page = 1, limit = 10, search = '') => {
        const response = await api.get('/api/users', {
            params: { page, limit, search }
        });
        return response.data;
    },

    // Get single user profile
    getUserProfile: async (userId) => {
        const response = await api.get(`/api/users/${userId}`);
        return response.data;
    },

    // Delete user
    deleteUser: async (userId) => {
        const response = await api.delete(`/api/users/${userId}`);
        return response.data;
    },

    // Get user location history
    getUserLocationHistory: async (userId, params = {}) => {
        const response = await api.get(`/api/user/${userId}/location-history`, {
            params
        });
        return response.data;
    },

    // Get user location statistics
    getUserLocationStats: async (userId, days = 30) => {
        const response = await api.get(`/api/user/${userId}/location-stats`, {
            params: { days }
        });
        return response.data;
    },

    // Update user location manually
    updateUserLocation: async (userId, locationData) => {
        const response = await api.post(`/api/user/${userId}/location`, locationData);
        return response.data;
    },

    // Delete user location history
    deleteUserLocationHistory: async (userId, keepCurrent = true) => {
        const response = await api.delete(`/api/user/${userId}/location-history`, {
            params: { keepCurrent }
        });
        return response.data;
    }
};

export default api;