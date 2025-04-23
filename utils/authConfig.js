// utils/authConfig.js
import axios from 'axios';

/**
 * Creates and returns the authorization configuration with headers for authenticated requests
 * @returns {Object} Config object with headers for authenticated requests
 */
export const getAuthConfig = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn('No auth token found in local storage');
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

/**
 * Creates axios instance with authentication headers
 * @returns {AxiosInstance} Configured axios instance
 */
export const createAuthAxios = () => {
    const token = localStorage.getItem('authToken');

    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL || '', // Use your API base URL from environment variables
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });

    // Add response interceptor to handle auth errors
    instance.interceptors.response.use(
        response => response,
        error => {
            // Handle 401 Unauthorized or 403 Forbidden errors
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Clear auth data from storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminUser');

                // Redirect to login page
                window.location.href = '/login';

                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

/**
 * Adds authorization headers to FormData requests
 * @param {FormData} formData - The form data object to send
 * @returns {Object} Config object for axios with headers
 */
export const getFormDataConfig = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn('No auth token found in local storage');
        return {};
    }

    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
    };
};

/**
 * Gets the current logged in admin user
 * @returns {Object|null} Admin user object or null if not logged in
 */
export const getCurrentAdmin = () => {
    const adminUser = localStorage.getItem('adminUser');

    if (!adminUser) {
        return null;
    }

    try {
        return JSON.parse(adminUser);
    } catch (error) {
        console.error('Error parsing admin user from localStorage:', error);
        return null;
    }
};

/**
 * Checks if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('adminUser');
};

export default {
    getAuthConfig,
    createAuthAxios,
    getFormDataConfig,
    getCurrentAdmin,
    isAuthenticated
};