import React, { useState } from 'react';
import { Copy, CheckCircle, Link } from 'lucide-react';
import { base_url } from '../../utils/base_url';

const DeeplinkGenerator = () => {
    // Form state
    const [formValues, setFormValues] = useState({
        purpose: '',
        property_type: '',
        min_price: '',
        max_price: '',
        bedrooms: '',
        bathrooms: '',
        lat: '',
        lng: '',
        amenities: ''
    });

    // State for the generated deeplink
    const [generatedDeeplink, setGeneratedDeeplink] = useState('');

    // State for copy feedback
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create URLSearchParams object
        const params = new URLSearchParams();

        // Only add parameters with values to the params object
        Object.entries(formValues).forEach(([key, value]) => {
            if (value) {
                if (key === 'amenities') {
                    // Handle comma-separated amenities
                    const amenitiesArray = value.split(',').map(item => item.trim());
                    amenitiesArray.forEach((amenity, index) => {
                        params.append(`amenities[${index}]`, amenity);
                    });
                } else {
                    params.append(key, value);
                }
            }
        });

        // Generate the deeplink
        const deeplink = `${base_url}/filter?${params.toString()}`;
        setGeneratedDeeplink(deeplink);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedDeeplink);
            setCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    };

    return (
        <div className="mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Deeplink Generator</h1>
                <p className="text-gray-600">Create custom deeplinks for filtering properties in the mobile app.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Criteria</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Purpose */}
                            <div>
                                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                                    Purpose
                                </label>
                                <select
                                    id="purpose"
                                    name="purpose"
                                    value={formValues.purpose}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Purpose</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Buy">Buy</option>
                                </select>
                            </div>

                            {/* Property Type */}
                            <div>
                                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Type
                                </label>
                                <select
                                    id="property_type"
                                    name="property_type"
                                    value={formValues.property_type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Property Type</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="House">House</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Office">Office</option>
                                    <option value="Shop">Shop</option>
                                    <option value="Warehouse">Warehouse</option>
                                    <option value="Factory">Factory</option>
                                    <option value="Plot">Plot</option>
                                    <option value="Room">Room</option>
                                </select>
                            </div>

                            {/* Min Price */}
                            <div>
                                <label htmlFor="min_price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Price
                                </label>
                                <input
                                    type="number"
                                    id="min_price"
                                    name="min_price"
                                    value={formValues.min_price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Max Price */}
                            <div>
                                <label htmlFor="max_price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Price
                                </label>
                                <input
                                    type="number"
                                    id="max_price"
                                    name="max_price"
                                    value={formValues.max_price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    id="bedrooms"
                                    name="bedrooms"
                                    value={formValues.bedrooms}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Bathrooms */}
                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    id="bathrooms"
                                    name="bathrooms"
                                    value={formValues.bathrooms}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Latitude */}
                            <div>
                                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    id="lat"
                                    name="lat"
                                    step="any"
                                    value={formValues.lat}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Longitude */}
                            <div>
                                <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    id="lng"
                                    name="lng"
                                    step="any"
                                    value={formValues.lng}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Amenities */}
                            <div className="sm:col-span-2">
                                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
                                    Amenities (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    id="amenities"
                                    name="amenities"
                                    value={formValues.amenities}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Swimming Pool, Gym, Garden"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center space-x-2"
                        >
                            <Link className="w-4 h-4" />
                            <span>Generate Deeplink</span>
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="md:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Generated Deeplink</h3>

                        {generatedDeeplink ? (
                            <>
                                <div className="p-3 bg-white border border-gray-200 rounded-md mb-4 break-all">
                                    <p className="text-gray-800 text-sm font-mono">{generatedDeeplink}</p>
                                </div>

                                <button
                                    onClick={copyToClipboard}
                                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Copy Deeplink</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Testing Instructions</h4>
                                    <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                                        <li>Copy the generated deeplink</li>
                                        <li>Open it in a compatible mobile app</li>
                                        <li>Verify that the filters are applied correctly</li>
                                    </ol>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <Link className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-center">Fill in the filter criteria and generate a deeplink to see it here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeeplinkGenerator;