// src/api/apiService.js
import axios from 'axios';

const base_url = import.meta.env.VITE_BASE_URL;

// Create axios instance with base URL
const api = axios.create({
    baseURL: base_url,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// API functions for user management
export const userService = {
    // Get all users with pagination, sorting, and filtering
    getAllUsers: async (params) => {
        try {
            const { page = 1, limit = 10, search = '', sort = 'createdAt:desc', filters = {} } = params;

            // Build query string
            let queryParams = new URLSearchParams();
            queryParams.append('page', page);
            queryParams.append('limit', limit);

            if (search) queryParams.append('search', search);
            if (sort) queryParams.append('sort', sort);
            if (Object.keys(filters).length > 0) {
                queryParams.append('filters', JSON.stringify(filters));
            }

            const response = await api.get(`/api/get-all-user?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Get user profile by ID
    getUserProfile: async (userId) => {
        try {
            const response = await api.get(`/api/users/profile/Ask/Admin/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    // Delete user by ID
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/delete/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};

export default api;