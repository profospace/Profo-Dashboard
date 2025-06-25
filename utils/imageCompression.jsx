// utils/imageCompression.js
import Compressor from 'compressorjs';

/**
 * Compresses an image file using Compressor.js
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - The compressed image file
 */
export const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            quality: 0.2, // 80% quality
            maxWidth: 1920, // Max width
            maxHeight: 1080, // Max height
            convertSize: 500000, // Convert to JPEG if original size > 500KB
            success: (compressedFile) => {
                resolve(compressedFile);
            },
            error: (error) => {
                reject(error);
            },
        };

        // Merge default options with provided options
        const finalOptions = { ...defaultOptions, ...options };

        new Compressor(file, finalOptions);
    });
};

/**
 * Gets detailed information about an image file
 * @param {File} file - The image file
 * @returns {Promise<Object>} - Object containing file details and image dimensions
 */
export const getImageDetails = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            // Get image dimensions
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            // Calculate aspect ratio
            const aspectRatio = (width / height).toFixed(2);

            // Create a small canvas to get color information (optional)
            canvas.width = 1;
            canvas.height = 1;
            ctx.drawImage(img, 0, 0, 1, 1);

            resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                width,
                height,
                aspectRatio,
                sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
                sizeInKB: (file.size / 1024).toFixed(2),
            });
        };

        img.onerror = () => {
            // If image can't be loaded, return basic file info
            resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                width: 'Unknown',
                height: 'Unknown',
                aspectRatio: 'Unknown',
                sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
                sizeInKB: (file.size / 1024).toFixed(2),
            });
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Formats file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets compression settings from localStorage
 * @returns {Object} - Compression settings
 */
export const getCompressionSettings = () => {
    try {
        const settings = localStorage.getItem('imageCompressionSettings');
        return settings ? JSON.parse(settings) : {
            enabled: false,
            quality: 0.2,
            maxWidth: 1920,
            maxHeight: 1080
        };
    } catch (error) {
        console.error('Error reading compression settings from localStorage:', error);
        return {
            enabled: false,
            quality: 0.2,
            maxWidth: 1920,
            maxHeight: 1080
        };
    }
};

/**
 * Saves compression settings to localStorage
 * @param {Object} settings - Compression settings to save
 */
export const saveCompressionSettings = (settings) => {
    try {
        localStorage.setItem('imageCompressionSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving compression settings to localStorage:', error);
    }
};