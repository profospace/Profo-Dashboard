import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const AdCreatePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const [formData, setFormData] = useState({
        name: '',
        header: '',
        pagelink: '',
        imagelinks: [],
        contact: [],
        type: {
            type: 'BANNER',
            width: 320,
            height: 50,
            delay: 3000,
            fullscreen: false
        }
    });

    const [imageLinksInput, setImageLinksInput] = useState('');
    const [contactInput, setContactInput] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            // Check if this is a nested field in the 'type' object
            if (name.startsWith('type.')) {
                const typeField = name.split('.')[1];
                return {
                    ...prev,
                    type: {
                        ...prev.type,
                        [typeField]: type === 'checkbox' ? checked : value
                    }
                };
            }

            // Regular field
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value, 10) || 0;

        setFormData(prev => {
            if (name.startsWith('type.')) {
                const typeField = name.split('.')[1];
                return {
                    ...prev,
                    type: {
                        ...prev.type,
                        [typeField]: numericValue
                    }
                };
            }
            return {
                ...prev,
                [name]: numericValue
            };
        });
    };

    const handleImageLinksChange = (e) => {
        setImageLinksInput(e.target.value);

        const links = e.target.value
            .split(',')
            .map(link => link.trim())
            .filter(Boolean);

        setFormData(prev => ({
            ...prev,
            imagelinks: links
        }));
    };

    const handleContactChange = (e) => {
        setContactInput(e.target.value);

        const contacts = e.target.value
            .split(',')
            .map(contact => contact.trim())
            .filter(Boolean);

        setFormData(prev => ({
            ...prev,
            contact: contacts
        }));
    };

    const handleAdTypeChange = (e) => {
        const newType = e.target.value;

        setFormData(prev => ({
            ...prev,
            type: {
                ...prev.type,
                type: newType
            }
        }));
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Get all existing ads
            const response = await axios.get(`${base_url}/api/colors/ads`);
            const existingAds = response.data || [];

            // Add the new ad
            const newAds = [...existingAds, formData];

            // Update the ads array
            const updateResponse = await axios.post(`${base_url}/api/colors/update-ads`, {
                ads: newAds
            });

            if (updateResponse.status === 200) {
                showNotification('Ad created successfully', 'success');

                // Wait for notification to display before redirecting
                setTimeout(() => {
                    navigate('/ads');
                }, 1500);
            } else {
                throw new Error('Failed to create ad');
            }
        } catch (error) {
            console.error('Error creating ad:', error);
            showNotification('Failed to create ad', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto ">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Create New Ad</h1>
                <button
                    onClick={() => navigate('/ads')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
                >
                    Cancel
                </button>
            </div>

            {notification.show && (
                <div className={`p-4 mb-6 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white  rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic ad information */}
                        <div>
                            <label className="block text-gray-700 mb-2">Ad Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Header</label>
                            <input
                                type="text"
                                name="header"
                                value={formData.header}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Page Link</label>
                            <input
                                type="text"
                                name="pagelink"
                                value={formData.pagelink}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., https://example.com or ofo://property/123"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Ad Type</label>
                            <select
                                name="type.type"
                                value={formData.type.type}
                                onChange={handleAdTypeChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="BANNER">Banner</option>
                                <option value="POPUP">Popup</option>
                                <option value="INTERSTITIAL">Interstitial</option>
                            </select>
                        </div>
                    </div>

                    {/* Type-specific fields */}
                    {formData.type.type === 'BANNER' && (
                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                            <h3 className="font-medium mb-3">Banner Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Width</label>
                                    <input
                                        type="number"
                                        name="type.width"
                                        value={formData.type.width || 0}
                                        onChange={handleNumericChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Height</label>
                                    <input
                                        type="number"
                                        name="type.height"
                                        value={formData.type.height || 0}
                                        onChange={handleNumericChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.type.type === 'POPUP' && (
                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                            <h3 className="font-medium mb-3">Popup Settings</h3>
                            <div>
                                <label className="block text-gray-700 mb-2">Delay (ms)</label>
                                <input
                                    type="number"
                                    name="type.delay"
                                    value={formData.type.delay || 0}
                                    onChange={handleNumericChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                    )}

                    {formData.type.type === 'INTERSTITIAL' && (
                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                            <h3 className="font-medium mb-3">Interstitial Settings</h3>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="type.fullscreen"
                                    checked={formData.type.fullscreen || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    id="fullscreen"
                                />
                                <label htmlFor="fullscreen" className="ml-2 block text-gray-700">
                                    Fullscreen
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Lists */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Image Links (comma-separated)</label>
                            <textarea
                                value={imageLinksInput}
                                onChange={handleImageLinksChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Contact Information (comma-separated)</label>
                            <textarea
                                value={contactInput}
                                onChange={handleContactChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                placeholder="email@example.com, +1234567890"
                            />
                        </div>
                    </div>

                    {formData.imagelinks && formData.imagelinks.length > 0 && (
                        <div>
                            <label className="block text-gray-700 mb-2">Image Previews</label>
                            <div className="flex flex-wrap gap-2">
                                {formData.imagelinks.map((url, index) => (
                                    <div key={index} className="w-24 h-24 border rounded overflow-hidden">
                                        <img
                                            src={url}
                                            alt={`Ad image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/96?text=Error';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/ads')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Ad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdCreatePage;