/**
 * Utility functions for working with the ProfoSpace app deeplinks
 * Based on the Android manifest and DeeplinkHandler implementation
 */

// Base URLs as specified in the manifest
const WEB_BASE_URL = "https://www.profospace.in";
const APP_SCHEME = "profo";
const REDIRECT_BASE_URL = "https://www.profospace.in/redirect";
const APP_PACKAGE_NAME = "com.ofo.nexthunt";

/**
 * Generate a property detail deeplink for both web and app schemes
 * @param {string} propertyId - The property ID
 * @param {boolean} useAppScheme - Whether to use the app scheme (profo://) or web URL
 * @returns {string} The generated deeplink
 */
const generatePropertyDetailDeeplink = (propertyId, useAppScheme = false) => {
    if (useAppScheme) {
        return `${APP_SCHEME}://property/${propertyId}`;
    }
    return `${WEB_BASE_URL}/property/${propertyId}`;
};

/**
 * Generate a project detail deeplink
 * @param {string} projectId - The project ID
 * @param {boolean} useAppScheme - Whether to use the app scheme or web URL
 * @returns {string} The generated deeplink
 */
const generateProjectDetailDeeplink = (projectId, useAppScheme = false) => {
    if (useAppScheme) {
        return `${APP_SCHEME}://project/${projectId}`;
    }
    // Use redirect for sharing (matches DeeplinkHandler.generateProjectShareLink)
    return `${REDIRECT_BASE_URL}?path=project/${projectId}&apn=${APP_PACKAGE_NAME}`;
};

/**
 * Generate a building detail deeplink
 * @param {string} buildingId - The building ID
 * @param {boolean} useAppScheme - Whether to use the app scheme or web URL
 * @returns {string} The generated deeplink
 */
const generateBuildingDetailDeeplink = (buildingId, useAppScheme = false) => {
    if (useAppScheme) {
        return `${APP_SCHEME}://building/${buildingId}`;
    }
    // Use redirect for sharing (matches DeeplinkHandler.generateBuildingShareLink)
    return `${REDIRECT_BASE_URL}?path=building/${buildingId}&apn=${APP_PACKAGE_NAME}`;
};

/**
 * Generate a search deeplink
 * @param {string} query - The search query
 * @param {boolean} useAppScheme - Whether to use the app scheme or web URL
 * @returns {string} The generated deeplink
 */
const generateSearchDeeplink = (query, useAppScheme = false) => {
    if (useAppScheme) {
        return `${APP_SCHEME}://search?q=${encodeURIComponent(query)}`;
    }
    return `${WEB_BASE_URL}/search?q=${encodeURIComponent(query)}`;
};

/**
 * Generate a projects listing deeplink with filters
 * @param {object} filters - The filters to apply (status, type)
 * @param {boolean} useAppScheme - Whether to use the app scheme or web URL
 * @returns {string} The generated deeplink
 */
const generateProjectsListingDeeplink = (filters = {}, useAppScheme = false) => {
    const params = new URLSearchParams();

    if (filters.status) {
        params.append("status", filters.status);
    }

    if (filters.type) {
        params.append("type", filters.type);
    }

    const queryString = params.toString();

    if (useAppScheme) {
        return `${APP_SCHEME}://projects${queryString ? `?${queryString}` : ''}`;
    }

    return `${WEB_BASE_URL}/projects${queryString ? `?${queryString}` : ''}`;
};

/**
 * Generate a filter deeplink with the provided parameters
 * @param {object} filterParams - Key-value pairs of filter parameters
 * @param {boolean} useAppScheme - Whether to use the app scheme or web URL
 * @returns {string} The generated deeplink
 */
const generateFilterDeeplink = (filterParams, useAppScheme = false) => {
    const params = new URLSearchParams();

    // Add all filter parameters
    Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            if (Array.isArray(value)) {
                // Handle array values (like amenities)
                value.forEach((item, index) => {
                    params.append(`${key}[${index}]`, item);
                });
            } else {
                params.append(key, value);
            }
        }
    });

    const queryString = params.toString();

    if (useAppScheme) {
        return `${APP_SCHEME}://filter?${queryString}`;
    }

    return `${WEB_BASE_URL}/filter?${queryString}`;
};

export {
    WEB_BASE_URL,
    APP_SCHEME,
    REDIRECT_BASE_URL,
    APP_PACKAGE_NAME,
    generatePropertyDetailDeeplink,
    generateProjectDetailDeeplink,
    generateBuildingDetailDeeplink,
    generateSearchDeeplink,
    generateProjectsListingDeeplink,
    generateFilterDeeplink
};