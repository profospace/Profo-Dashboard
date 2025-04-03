import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUnlink, FaSearch } from 'react-icons/fa';
import { base_url } from '../../../utils/base_url';

const DisconnectBuilderPropertiesPage = () => {
    const { builderId } = useParams();
    const navigate = useNavigate();
    const [builder, setBuilder] = useState(null);
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch builder details
                const builderResponse = await fetch(`${base_url}/builders/${builderId}`);
                if (!builderResponse.ok) {
                    throw new Error('Builder not found');
                }
                const builderData = await builderResponse.json();
                setBuilder(builderData);

                // Fetch builder's properties
                const propertiesResponse = await fetch(`${base_url}/api/builder/property/connection/builders/${builderId}/properties`);
                if (!propertiesResponse.ok) {
                    throw new Error('Failed to fetch builder properties');
                }
                const propertiesData = await propertiesResponse.json();
                setProperties(propertiesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage({ text: error.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [builderId]);

    const handleSelectProperty = (propertyId) => {
        setSelectedProperties(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId);
            } else {
                return [...prev, propertyId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedProperties.length === filteredProperties.length) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(filteredProperties.map(property => property._id));
        }
    };

    const handleSubmit = async () => {
        if (selectedProperties.length === 0) {
            setMessage({ text: 'Please select at least one property to disconnect', type: 'error' });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${base_url}/api/builder/property/connection/builders/disconnect-properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    builderId,
                    propertyIds: selectedProperties,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to disconnect properties');
            }

            const data = await response.json();
            setMessage({ text: `Successfully disconnected ${data.modifiedCount} properties from builder`, type: 'success' });

            // Clear selection after successful submission
            setSelectedProperties([]);

            // Remove disconnected properties from the list
            setProperties(prev => prev.filter(property => !selectedProperties.includes(property._id)));

            // Redirect back to builder list after a short delay
            setTimeout(() => {
                navigate('/builders');
            }, 2000);
        } catch (error) {
            console.error('Error disconnecting properties:', error);
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // Filter properties based on search term
    const filteredProperties = properties.filter(property =>
        property.post_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!builder) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Builder not found
                </div>
                <button
                    onClick={() => navigate('/builders')}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Back to Builders
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/builders')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Back to Builders
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Disconnect Properties from Builder: {builder.name}
                </h1>

                {message.text && (
                    <div className={`mb-4 px-4 py-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' :
                            'bg-red-100 text-red-700 border border-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search properties by title or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border rounded-lg"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-semibold">Total connected properties:</span> {properties.length}
                    </div>
                    <div>
                        <span className="font-semibold">Selected:</span> {selectedProperties.length}
                    </div>
                    <button
                        onClick={handleSelectAll}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
                    >
                        {selectedProperties.length === filteredProperties.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="bg-gray-100 p-4 rounded text-center">
                        No properties connected to this builder.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                    <th className="py-3 px-4 text-left">Select</th>
                                    <th className="py-3 px-4 text-left">Property Title</th>
                                    <th className="py-3 px-4 text-left">Address</th>
                                    <th className="py-3 px-4 text-left">Bedrooms</th>
                                    <th className="py-3 px-4 text-left">Bathrooms</th>
                                    <th className="py-3 px-4 text-left">Price</th>
                                    <th className="py-3 px-4 text-left">Area</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                                {filteredProperties.map(property => (
                                    <tr
                                        key={property._id}
                                        className={`border-b hover:bg-gray-50 cursor-pointer ${selectedProperties.includes(property._id) ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => handleSelectProperty(property._id)}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProperties.includes(property._id)}
                                                    onChange={() => { }} // Handled by the row click
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{property.post_title || 'Untitled Property'}</td>
                                        <td className="py-3 px-4">{property.address || 'N/A'}</td>
                                        <td className="py-3 px-4">{property.bedrooms || 'N/A'}</td>
                                        <td className="py-3 px-4">{property.bathrooms || 'N/A'}</td>
                                        <td className="py-3 px-4">
                                            {property.price ? `${property.priceUnit || '₹'} ${property.price.toLocaleString()}` : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {property.area ? `${property.area} ${property.areaUnit || 'sq ft'}` : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={selectedProperties.length === 0 || submitting}
                        className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition flex items-center ${(selectedProperties.length === 0 || submitting) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <FaUnlink className="mr-2" />
                        {submitting ? 'Disconnecting...' : 'Disconnect Selected Properties'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisconnectBuilderPropertiesPage;