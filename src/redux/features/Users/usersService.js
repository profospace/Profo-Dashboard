import axios from 'axios';
import { base_url } from '../../../../utils/base_url';

// Get paginated users with optional filters
const getPaginatedUsers = async (page, limit, filters = {}) => {
    // Build query parameters
    const params = new URLSearchParams({
        page,
        limit
    });

    // Add filters if they exist
    if (filters.name) params.append('name', filters.name);
    if (filters.email) params.append('email', filters.email);
    if (filters.phone) params.append('phone', filters.phone);
    if (filters.loginType) params.append('loginType', filters.loginType);

    const response = await axios.get(`${base_url}/paginated?${params}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('authToken') || ''
        }
    });

    return response.data;
};

// Get user by ID
const getUserById = async (userId) => {
    const response = await axios.get(`${base_url}/users/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('authToken') || ''
        }
    });

    return response.data;
};

// Update user
const updateUser = async (userId, userData) => {
    const response = await axios.put(`${base_url}/users/${userId}`, userData, {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('authToken') || ''
        }
    });

    return response.data;
};

// Delete user
const deleteUser = async (userId) => {
    const response = await axios.delete(`${base_url}/users/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('authToken') || ''
        }
    });

    return response.data;
};

const usersService = {
    getPaginatedUsers,
    getUserById,
    updateUser,
    deleteUser,
};

export default usersService;