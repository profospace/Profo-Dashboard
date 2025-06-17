import axios from 'axios';
import { getAuthConfig, getAuthConfigFormData } from '../../utils/authConfig'; // Adjust path as needed
import { base_url } from '../../utils/base_url';


// Fetch bottom navigation icons
export const fetchBottomNavIcons = async () => {
    try {
        const response = await axios.get(`${base_url}/api/bottom-nav-icons`, getAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Error fetching bottom nav icons:', error);
        throw error;
    }
};

// Update a specific icon (with FormData)
export const updateIcon = async (iconId, formData) => {
    try {
        const response = await axios.post(
            `${base_url}/api/bottom-nav-icons/${iconId}`,
            formData,
            getAuthConfigFormData()
        );
        return response.data;
    } catch (error) {
        console.error('Error updating icon:', error);
        throw error;
    }
};

// Update all icons configuration
export const updateAllIcons = async (icons) => {
    try {
        const response = await axios.put(
            `${base_url}/api/bottom-nav-icons`,
            { icons },
            getAuthConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error updating all icons:', error);
        throw error;
    }
};

// Delete an icon
export const deleteIcon = async (iconId) => {
    try {
        const response = await axios.delete(
            `${base_url}/api/bottom-nav-icons/${iconId}`,
            getAuthConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting icon:', error);
        throw error;
    }
};

// Get admin configuration
export const getAdminConfig = async () => {
    try {
        const response = await axios.get(
            `${base_url}/api/admin/bottom-nav-config`,
            getAuthConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching admin config:', error);
        throw error;
    }
};

// Get file URL
export const getFileUrl = (filename) => `${base_url}/api/files/${filename}`;
