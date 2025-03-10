import axios from 'axios';
import { base_url } from '../../../../utils/base_url';

// Get all properties
const getProperties = async () => {
    const response = await axios.get(`${base_url}/api/properties/all`);
    return response.data;
};

// Get property by ID
const getPropertyById = async (propertyId) => {
    const response = await axios.get(`${base_url}/api/properties/${propertyId}`);
    return response.data;
};

// Add new property
const addProperty = async (propertyData) => {
    const response = await axios.post(`${base_url}/api/properties`, propertyData);
    return response.data;
};

// Update property
const updateProperty = async (propertyId, propertyData) => {
    const response = await axios.put(`${base_url}/api/properties/${propertyId}`, propertyData);
    return response.data;
};

// Delete property
const deleteProperty = async (propertyId) => {
    const response = await axios.delete(`${base_url}/api/properties/${propertyId}`);
    return response.data;
};

const propertiesService = {
    getProperties,
    getPropertyById,
    addProperty,
    updateProperty,
    deleteProperty,
};

export default propertiesService;