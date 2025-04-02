import React, { useState, useEffect } from 'react';

const AdForm = ({ ad, onSubmit, onCancel }) => {
    const emptyAd = {
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
    };

    const [formData, setFormData] = useState(emptyAd);
    const [imageLinksInput, setImageLinksInput] = useState('');
    const [contactInput, setContactInput] = useState('');

    useEffect(() => {
        if (ad) {
            setFormData({
                ...ad,
                type: {
                    ...ad.type
                }
            });

            // Set input values for comma-separated lists
            if (ad.imagelinks && ad.imagelinks.length > 0) {
                setImageLinksInput(ad.imagelinks.join(', '));
            }

            if (ad.contact && ad.contact.length > 0) {
                setContactInput(ad.contact.join(', '));
            }
        }
    }, [ad]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic ad information */}
                <div>
                    <label className="block text-gray-700 mb-1">Ad Name</label>
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
                    <label className="block text-gray-700 mb-1">Header</label>
                    <input
                        type="text"
                        name="header"
                        value={formData.header}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Page Link</label>
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
                    <label className="block text-gray-700 mb-1">Ad Type</label>
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
                            <label className="block text-gray-700 mb-1">Width</label>
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
                            <label className="block text-gray-700 mb-1">Height</label>
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
                        <label className="block text-gray-700 mb-1">Delay (ms)</label>
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
                    <label className="block text-gray-700 mb-1">Image Links (comma-separated)</label>
                    <textarea
                        value={imageLinksInput}
                        onChange={handleImageLinksChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Contact Information (comma-separated)</label>
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
                    <label className="block text-gray-700 mb-1">Image Previews</label>
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
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                >
                    Save Ad
                </button>
            </div>
        </form>
    );
};

export default AdForm;