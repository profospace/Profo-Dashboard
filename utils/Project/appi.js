// utils/Property/api.js
import axios from 'axios';
import { base_url } from '../base_url';

/**
 * Get all properties that are not assigned to any building
 * @returns {Promise<Array>} Array of unassigned properties
 */
export const getUnassignedProperties = async () => {
    try {
        const response = await axios.get(`${base_url}/api/properties/unassigned`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unassigned properties:', error);
        throw error;
    }
};


/**
 * Connect multiple properties to a building
 * @param {string} buildingId - The ID of the building
 * @param {Object} data - Object containing propertyIds array
 * @returns {Promise<Object>} Response data
 */
export const connectPropertiesToBuilding = async (buildingId, data) => {
    try {
        const response = await axios.post(
            `${base_url}/api/properties/connect/${buildingId}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error connecting properties to building:', error);
        throw error;
    }
};


/**
 * Disconnect a property from its building
 * @param {string} propertyId - The ID of the property to disconnect
 * @returns {Promise<Object>} Response data
 */
export const disconnectPropertyFromBuilding = async (propertyId) => {
    try {
        const response = await axios.delete(
            `${base_url}/api/properties/${propertyId}/disconnect`
        );
        return response.data;
    } catch (error) {
        console.error('Error disconnecting property from building:', error);
        throw error;
    }
};