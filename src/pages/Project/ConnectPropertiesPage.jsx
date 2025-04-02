import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { base_url } from "../../../utils/base_url";

const ConnectPropertiesPage = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const projectName = location.state?.projectName || 'Project';

    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [filters, setFilters] = useState({
        city: '',
        type: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    // Fetch unassigned properties when component mounts or filters change
    useEffect(() => {
        fetchUnassignedProperties();
    }, [filters, pagination.page]);

    const fetchUnassignedProperties = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            });

            const response = await axios.get(`${base_url}/api/properties/unassigned?${queryParams.toString()}`);
            setProperties(response.data.data.properties);
            setPagination(response.data.data.pagination);
        } catch (error) {
            console.error('Error fetching unassigned properties:', error);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        // Reset to first page when changing filters
        if (pagination.page !== 1) {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const resetFilters = () => {
        setFilters({
            city: '',
            type: ''
        });
        setSearchTerm('');
        if (pagination.page !== 1) {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
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
        const allIds = properties.map(property => property.post_id);
        setSelectedProperties(allIds);
    };

    const deselectAllProperties = () => {
        setSelectedProperties([]);
    };

    const handleConnectProperties = async () => {
        if (selectedProperties.length === 0) {
            toast.error('Please select at least one property to connect');
            return;
        }

        try {
            setConnecting(true);
            const response = await axios.post(`${base_url}/api/projects/${projectId}/properties`, {
                propertyIds: selectedProperties
            });

            toast.success(`${response.data.data.connectedCount} properties connected successfully`);
            navigate(`/projects`);
        } catch (error) {
            console.error('Error connecting properties:', error);
            toast.error(error.response?.data?.error || 'Failed to connect properties');
        } finally {
            setConnecting(false);
        }
    };

    // Filter properties by search term
    const filteredProperties = searchTerm
        ? properties.filter(property =>
            property.post_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.locality?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : properties;

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Connect Properties to Project</h1>
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
                        onClick={handleConnectProperties}
                        disabled={connecting || selectedProperties.length === 0}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${(connecting || selectedProperties.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {connecting ? 'Connecting...' : `Connect Selected (${selectedProperties.length})`}
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Unassigned Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by title, city, locality..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            placeholder="Filter by city"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="House">House</option>
                            <option value="Plot">Plot</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Properties Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Available Properties {filteredProperties.length > 0 && `(${filteredProperties.length})`}
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={selectAllProperties}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                            Select All
                        </button>
                        <button
                            onClick={deselectAllProperties}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-xl">No unassigned properties found.</p>
                        <p className="mt-2">Try adjusting your filters or add new properties.</p>
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
                                            key={property.post_id}
                                            className={`hover:bg-gray-50 cursor-pointer ${selectedProperties.includes(property.post_id) ? 'bg-blue-50' : ''
                                                }`}
                                            onClick={() => togglePropertySelection(property.post_id)}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProperties.includes(property.post_id)}
                                                    onChange={() => togglePropertySelection(property.post_id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {property.post_title || 'Untitled Property'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {property.post_id}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{property.type_name || 'N/A'}</div>
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

export default ConnectPropertiesPage;