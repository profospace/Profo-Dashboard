import axios from 'axios';
import { base_url } from '../../../../utils/base_url';

// Get all buildings
const getBuildings = async () => {
    const response = await axios.get(`${base_url}/api/buildings`);
    return response.data;
};

// Get building by ID
const getBuildingById = async (buildingId) => {
    const response = await axios.get(`${base_url}/api/buildings/${buildingId}`);
    return response.data;
};

// Get building configuration
const getBuildingConfig = async (buildingId) => {
    const response = await axios.get(`https://propertify.onrender.com/api/export-config/${buildingId}`);
    return response.data;
};

// Save building configuration
const saveBuildingConfig = async (configData) => {
    const response = await axios.post(`https://propertify.onrender.com/api/export-config`, configData);
    return response.data;
};

// Upload image
const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`${base_url}/profo/image/upload`, formData);
    return response.data;
};

// Add new building
const addBuilding = async (buildingData) => {
    const response = await axios.post(`${base_url}/api/buildings`, buildingData);
    return response.data;
};

// Update building
const updateBuilding = async (buildingId, buildingData) => {
    const response = await axios.put(`${base_url}/api/buildings/${buildingId}`, buildingData);
    return response.data;
};

// Delete building
const deleteBuilding = async (buildingId) => {
    const response = await axios.delete(`${base_url}/api/buildings/${buildingId}`);
    return response.data;
};

const buildingsService = {
    getBuildings,
    getBuildingById,
    getBuildingConfig,
    saveBuildingConfig,
    uploadImage,
    addBuilding,
    updateBuilding,
    deleteBuilding,
};

export default buildingsService;