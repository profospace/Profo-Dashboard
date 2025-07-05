// // import { base_url } from "../base_url";

// // // Base URL for API requests

// // const API_BASE_URL = base_url;

// // // Helper function for handling fetch responses
// // const handleResponse = async (response) => {
// //     if (!response.ok) {
// //         // Try to get error message from the response
// //         let errorMessage;
// //         try {
// //             const errorData = await response.json();
// //             errorMessage = errorData.message || errorData.error || `HTTP error! Status: ${response.status}`;
// //         } catch (e) {
// //             errorMessage = `HTTP error! Status: ${response.status}`;
// //         }
// //         throw new Error(errorMessage);
// //     }
// //     return response.json();
// // };

// // // Buildings API

// // // Get all buildings with optional filtering and pagination
// // export const getBuildings = async (filters = {}) => {
// //     const { searchTerm, status, sortBy, page = 1, limit = 12 } = filters;

// //     // Build query string
// //     const queryParams = new URLSearchParams();
// //     if (searchTerm) queryParams.append('search', searchTerm);
// //     if (status) queryParams.append('status', status);
// //     if (sortBy) queryParams.append('sort', sortBy);
// //     queryParams.append('page', page);
// //     queryParams.append('limit', limit);

// //     const url = `${API_BASE_URL}/api/buildings?${queryParams.toString()}`;

// //     const response = await fetch(url);
// //     return handleResponse(response);
// // };

// // // Get a single building by ID
// // export const getBuildingById = async (buildingId) => {
// //     const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`);
// //     return handleResponse(response);
// // };

// // // Create a new building
// // export const createBuilding = async (buildingData, galleryFiles) => {
// //     const formData = new FormData();

// //     // Add JSON data
// //     formData.append('data', JSON.stringify(buildingData));

// //     // Add gallery images if any
// //     if (galleryFiles && galleryFiles.length > 0) {
// //         galleryFiles.forEach(file => {
// //             formData.append('galleryList', file);
// //         });
// //     }

// //     const response = await fetch(`${API_BASE_URL}/api/buildings/saveBuildingDetails`, {
// //         method: 'POST',
// //         body: formData
// //     });

// //     return handleResponse(response);
// // };

// // // Update an existing building
// // export const updateBuilding = async (buildingId, buildingData, galleryFiles) => {
// //     const formData = new FormData();

// //     // Add JSON data
// //     formData.append('data', JSON.stringify(buildingData));

// //     // Add gallery images if any
// //     if (galleryFiles && galleryFiles.length > 0) {
// //         galleryFiles.forEach(file => {
// //             formData.append('galleryList', file);
// //         });
// //     }

// //     const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`, {
// //         method: 'PUT',
// //         body: formData
// //     });

// //     return handleResponse(response);
// // };

// // // Delete a building
// // export const deleteBuilding = async (buildingId) => {
// //     const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`, {
// //         method: 'DELETE'
// //     });

// //     return handleResponse(response);
// // };

// // export default {
// //     getBuildings,
// //     getBuildingById,
// //     createBuilding,
// //     updateBuilding,
// //     deleteBuilding
// // };


// import { base_url } from "../base_url";

// // Base URL for API requests

// const API_BASE_URL = base_url;

// // Helper function for handling fetch responses
// const handleResponse = async (response) => {
//     if (!response.ok) {
//         // Try to get error message from the response
//         let errorMessage;
//         try {
//             const errorData = await response.json();
//             errorMessage = errorData.message || errorData.error || `HTTP error! Status: ${response.status}`;
//         } catch (e) {
//             errorMessage = `HTTP error! Status: ${response.status}`;
//         }
//         throw new Error(errorMessage);
//     }
//     return response.json();
// };

// // Buildings API

// // Get all buildings with optional filtering and pagination
// export const getBuildings = async (filters = {}) => {
//     const { searchTerm, status, sortBy, page = 1, limit = 12 } = filters;

//     // Build query string
//     const queryParams = new URLSearchParams();
//     if (searchTerm) queryParams.append('search', searchTerm);
//     if (status) queryParams.append('status', status);
//     if (sortBy) queryParams.append('sort', sortBy);
//     queryParams.append('page', page);
//     queryParams.append('limit', limit);

//     const url = `${API_BASE_URL}/api/buildings?${queryParams.toString()}`;

//     const response = await fetch(url);
//     return handleResponse(response);
// };

// // Get a single building by ID
// export const getBuildingById = async (buildingId) => {
//     const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`);
//     return handleResponse(response);
// };

// // Create a new building
// export const createBuilding = async (buildingData, galleryFiles) => {
//     const formData = new FormData();

//     // Add JSON data
//     formData.append('data', JSON.stringify(buildingData));

//     // Add gallery images if any
//     if (galleryFiles && galleryFiles.length > 0) {
//         galleryFiles.forEach(file => {
//             formData.append('galleryList', file);
//         });
//     }

//     const response = await fetch(`${API_BASE_URL}/api/buildings/saveBuildingDetails`, {
//         method: 'POST',
//         body: formData
//     });

//     return handleResponse(response);
// };

// // Update an existing building
// export const updateBuilding = async (buildingId, buildingData, galleryFiles) => {
//     const formData = new FormData();

//     // Prepare the data object with gallery management information
//     const dataToSend = {
//         ...buildingData
//     };

//     // If we have gallery updates information, include it
//     if (buildingData.galleryUpdates) {
//         dataToSend.retainedImages = buildingData.galleryUpdates.retainedImages;
//         dataToSend.removedImages = buildingData.galleryUpdates.removedImages;
//         // Remove the galleryUpdates object as we've extracted its contents
//         delete dataToSend.galleryUpdates;
//     }

//     // Add JSON data
//     formData.append('data', JSON.stringify(dataToSend));

//     // Add new gallery images if any
//     if (galleryFiles && galleryFiles.length > 0) {
//         galleryFiles.forEach(file => {
//             formData.append('galleryList', file);
//         });
//     }

//     const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`, {
//         method: 'PUT',
//         body: formData
//     });

//     return handleResponse(response);
// };

// // Delete a building
// export const deleteBuilding = async (buildingId) => {
//     const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`, {
//         method: 'DELETE'
//     });

//     return handleResponse(response);
// };

// export default {
//     getBuildings,
//     getBuildingById,
//     createBuilding,
//     updateBuilding,
//     deleteBuilding
// };


import { base_url } from "../base_url";

// Base URL for API requests

const API_BASE_URL = base_url;

// Helper function for handling fetch responses
const handleResponse = async (response) => {
    if (!response.ok) {
        // Try to get error message from the response
        let errorMessage;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || `HTTP error! Status: ${response.status}`;
        } catch (e) {
            errorMessage = `HTTP error! Status: ${response.status}`;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

// Buildings API

// Get all buildings with optional filtering and pagination
export const getBuildings = async (filters = {}) => {
    const { searchTerm, status, sortBy, page = 1, limit = 12 } = filters;

    // Build query string
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (status) queryParams.append('status', status);
    if (sortBy) queryParams.append('sort', sortBy);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const url = `${API_BASE_URL}/api/buildings?${queryParams.toString()}`;

    const response = await fetch(url);
    return handleResponse(response);
};

// Get a single building by ID
export const getBuildingById = async (buildingId) => {
    const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`);
    return handleResponse(response);
};

// Create a new building
export const createBuilding = async (buildingData, galleryFiles) => {
    const formData = new FormData();

    // Add JSON data
    formData.append('data', JSON.stringify(buildingData));

    // Add gallery images if any
    if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
            formData.append('galleryList', file);
        });
    }

    const response = await fetch(`${API_BASE_URL}/api/buildings/saveBuildingDetails`, {
        method: 'POST',
        body: formData
    });

    return handleResponse(response);
};

// Update an existing building
export const updateBuilding = async (buildingId, buildingData, galleryFiles) => {
    const formData = new FormData();

    // Prepare the data object with gallery management information
    const dataToSend = {
        ...buildingData
    };

    // If we have gallery updates information, include it
    if (buildingData.galleryUpdates) {
        dataToSend.retainedImages = buildingData.galleryUpdates.retainedImages;
        dataToSend.removedImages = buildingData.galleryUpdates.removedImages;
        // Remove the galleryUpdates object as we've extracted its contents
        delete dataToSend.galleryUpdates;
    }

    // Add JSON data
    formData.append('data', JSON.stringify(dataToSend));

    // Add new gallery images if any
    if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
            formData.append('galleryList', file);
        });
    }

    const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`, {
        method: 'PUT',
        body: formData
    });

    return handleResponse(response);
};

// Delete a building
export const deleteBuilding = async (buildingId) => {
    const response = await fetch(`${API_BASE_URL}/api/buildings/${buildingId}`, {
        method: 'DELETE'
    });

    return handleResponse(response);
};

export default {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding
};