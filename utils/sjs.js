/**
 * Utility functions for Project Management
 */

/**
 * Formats a project status string
 * @param {string} status - The status string (e.g., 'UNDER_CONSTRUCTION')
 * @returns {string} - Formatted status string (e.g., 'Under Construction')
 */
export const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Returns CSS classes for status badges
 * @param {string} status - The status string
 * @returns {string} - CSS class names
 */
export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'upcoming':
            return 'bg-yellow-100 text-yellow-800';
        case 'under_construction':
            return 'bg-orange-100 text-orange-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

/**
 * Formats a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

/**
 * Formats a price number with commas according to Indian numbering system
 * @param {number|string} price - The price value
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
    if (!price) return '0';

    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Format with commas (Indian format)
    return numPrice.toLocaleString('en-IN');
};

/**
 * Converts a snake_case or SCREAMING_SNAKE_CASE string to Title Case
 * @param {string} text - The input text
 * @returns {string} - Formatted text
 */
export const formatSnakeCase = (text) => {
    if (!text) return '';
    return text.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Groups an array of objects by a specific property
 * @param {Array} items - Array of objects
 * @param {string} property - Property name to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (items, property) => {
    return items.reduce((acc, item) => {
        const key = item[property] || 'Other';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
};

/**
 * Extracts a coordinate object from a GeoJSON Point object
 * @param {Object} coordinates - GeoJSON coordinates object
 * @returns {Object|null} - {lat, lng} object or null
 */
export const extractCoordinates = (coordinates) => {
    if (!coordinates || !coordinates.coordinates || coordinates.coordinates.length !== 2) {
        return null;
    }

    // GeoJSON uses [longitude, latitude] order
    const [lng, lat] = coordinates.coordinates;
    return { lat, lng };
};

/**
 * Creates a GeoJSON Point object from lat/lng values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} - GeoJSON Point object
 */
export const createGeoJSONPoint = (lat, lng) => {
    return {
        type: 'Point',
        coordinates: [lng, lat]
    };
};

/**
 * Validates if a project object has all required fields
 * @param {Object} project - Project object
 * @returns {Object} - {isValid: boolean, errors: string[]}
 */
export const validateProject = (project) => {
    const errors = [];

    if (!project.name) errors.push('Project name is required');
    if (!project.type) errors.push('Project type is required');
    if (!project.builder) errors.push('Builder is required');
    if (!project.location?.address) errors.push('Project address is required');
    if (!project.location?.city) errors.push('Project city is required');
    if (!project.location?.state) errors.push('Project state is required');

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Basic debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};