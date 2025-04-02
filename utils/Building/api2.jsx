// utils/Property/api.js
import axios from 'axios';
import { base_url } from '../base_url';
/**
 * Get all properties that are not assigned to any building
 * @returns {Promise<Array>} Array of unassigned properties
 */
export const getUnassignedProperties = async () => {
    try {
        const response = await axios.get(`${base_url}/api/buildings/unassigned/properties`);
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
            `${base_url}/api/properties/connect/building/${buildingId}`,
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
            `${base_url}/api/properties/${propertyId}/disconnect/building`
        );
        return response.data;
    } catch (error) {
        console.error('Error disconnecting property from building:', error);
        throw error;
    }
};


/**
 * Disconnect multiple properties from a building
 * @param {string} buildingId - The ID of the building
 * @param {Object} data - Object containing propertyIds array
 * @returns {Promise<Object>} Response data
 */
export const disconnectPropertiesFromBuilding = async (buildingId, data) => {
    try {
        const response = await axios.post(
            `${base_url}/api/buildings/${buildingId}/disconnect-properties`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error disconnecting properties from building:', error);
        throw error;
    }
};



/**
 * Get all properties connected to a specific building
 * @param {string} buildingId - The ID of the building
 * @returns {Promise<Array>} Array of connected properties
 */
export const getBuildingProperties = async (buildingId) => {
    try {
        const response = await axios.get(`${base_url}/api/buildings/${buildingId}/properties`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching building properties:', error);
        throw error;
    }
};