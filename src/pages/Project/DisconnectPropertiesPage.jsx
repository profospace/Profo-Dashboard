import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";

const DisconnectPropertiesPage = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const projectName = location.state?.projectName || 'Project';

    const [loading, setLoading] = useState(true);
    const [disconnecting, setDisconnecting] = useState(false);
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    // Fetch connected properties when component mounts
    useEffect(() => {
        fetchConnectedProperties();
    }, [pagination.page]);

    const fetchConnectedProperties = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit
            });

            const response = await axios.get(`${base_url}/api/projects/${projectId}/properties?${queryParams.toString()}`);
            setProperties(response.data.data.properties);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching connected properties:', error);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const togglePropertySelection = (propertyId) => {
        setSelectedProperties(prev => {
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId);
            } else {
                return [...prev, propertyId];
            }
        });
    };

    const selectAllProperties = () => {
        const allIds = properties.map(property => property.id);
        setSelectedProperties(allIds);
    };

    const deselectAllProperties = () => {
        setSelectedProperties([]);
    };

    const handleDisconnectProperties = async () => {
        if (selectedProperties.length === 0) {
            toast.error('Please select at least one property to disconnect');
            return;
        }

        if (!window.confirm(`Are you sure you want to disconnect ${selectedProperties.length} properties from this project?`)) {
            return;
        }

        try {
            setDisconnecting(true);
            const response = await axios.delete(`${base_url}/api/projects/${projectId}/properties`, {
                data: { propertyIds: selectedProperties }
            });

            toast.success(`${response.data.data.disconnectedCount} properties disconnected successfully`);
            navigate(`/projects`);
        } catch (error) {
            console.error('Error disconnecting properties:', error);
            toast.error(error.response?.data?.error || 'Failed to disconnect properties');
        } finally {
            setDisconnecting(false);
        }
    };

    // Filter properties by search term
    const filteredProperties = searchTerm
        ? properties.filter(property =>
            property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.locality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : properties;

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Disconnect Properties from Project</h1>
                    <p className="text-gray-600 mt-1">
                        Project: <span className="font-semibold">{projectName}</span>
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate(`/projects`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDisconnectProperties}
                        disabled={disconnecting || selectedProperties.length === 0}
                        className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${(disconnecting || selectedProperties.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {disconnecting ? 'Disconnecting...' : `Disconnect Selected (${selectedProperties.length})`}
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Connected Properties</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by title, city, address..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex space-x-3 self-end">
                        <button
                            onClick={selectAllProperties}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                            Select All
                        </button>
                        <button
                            onClick={deselectAllProperties}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Connected Properties {filteredProperties.length > 0 && `(${filteredProperties.length})`}
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-xl">No connected properties found.</p>
                        {searchTerm ? (
                            <p className="mt-2">Try adjusting your search terms.</p>
                        ) : (
                            <p className="mt-2">This project has no connected properties.</p>
                        )}
                        <button
                            onClick={() => navigate(`/projects/${projectId}/connect-properties`, { state: { projectName } })}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Connect Properties
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="w-12 px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                                                onChange={() => {
                                                    if (selectedProperties.length === filteredProperties.length) {
                                                        deselectAllProperties();
                                                    } else {
                                                        selectAllProperties();
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Property Name
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bedrooms
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProperties.map((property) => (
                                        <tr
                                            key={property.id}
                                            className={`hover:bg-gray-50 cursor-pointer ${selectedProperties.includes(property.id) ? 'bg-amber-50' : ''
                                                }`}
                                            onClick={() => togglePropertySelection(property.id)}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProperties.includes(property.id)}
                                                    onChange={() => togglePropertySelection(property.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {property.title || 'Untitled Property'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {property.id}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{property.type || 'N/A'}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{property.city || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{property.locality || ''}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {property.bedrooms || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {property.price
                                                        ? new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR',
                                                            maximumFractionDigits: 0
                                                        }).format(property.price)
                                                        : 'N/A'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'listed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {property.status || 'unlisted'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>{' '}
                                    of <span className="font-medium">{pagination.total}</span> properties
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className={`px-3 py-1 rounded border ${pagination.page === 1
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages}
                                        className={`px-3 py-1 rounded border ${pagination.page === pagination.pages
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DisconnectPropertiesPage;