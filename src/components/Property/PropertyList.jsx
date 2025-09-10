import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, PencilIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoCard from '../Video/VideoCard';


export default function PropertyList({
    properties,
    loading,
    error,
    onEdit,
    onDelete,
    onUpdateStatus,
    onViewDetails,
    cities,
    selectedCity,
    onCityChange,
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterStatusChange
}) {
    const [sortOrder, setSortOrder] = useState({ field: null, direction: 'asc' });
    const [visiblePropertyCount, setVisiblePropertyCount] = useState(9);

    // const location = useLocation();

    // useEffect(() => {
    //     if (location.state?.success) {
    //         alert(location.state.success); // Or use a toast notification
    //     }
    // }, [location.state]);
    const toggleSort = (field) => {
        setSortOrder(prevSort => ({
            field: field,
            direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortProperties = (properties) => {
        if (!sortOrder.field) return properties;

        return [...properties].sort((a, b) => {
            let aValue = a[sortOrder.field];
            let bValue = b[sortOrder.field];

            // Handle nested properties like post_city
            if (sortOrder.field === 'city') {
                aValue = a.post_city || '';
                bValue = b.post_city || '';
            }

            // Convert to lowercase for string comparison
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();

            // Compare values
            if (aValue < bValue) return sortOrder.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const loadMore = () => {
        setVisiblePropertyCount(prevCount => prevCount + 9);
    };

    const sortedProperties = sortProperties(properties);
    const displayedProperties = sortedProperties.slice(0, visiblePropertyCount);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const SortIcon = ({ field }) => {
        if (sortOrder.field !== field) return null;
        return sortOrder.direction === 'asc' ?
            <ChevronUpIcon className="h-4 w-4 ml-1" /> :
            <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

   

    return (
        <div className="p-4">
            {/* Filter and Search Bar */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by City
                        </label>
                        <select
                            id="city-filter"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={selectedCity}
                            onChange={(e) => onCityChange(e.target.value)}
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Status
                        </label>
                        <select
                            id="status-filter"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={filterStatus}
                            onChange={(e) => onFilterStatusChange(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="listed">Listed</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="payment-pending">Payment Pending</option>
                            <option value="suspicious">Suspicious</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Properties
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by title, ID, or address..."
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sorting options */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <button
                        onClick={() => toggleSort('post_title')}
                        className={`text-sm px-2 py-1 rounded flex items-center ${sortOrder.field === 'post_title' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        Title <SortIcon field="post_title" />
                    </button>
                    <button
                        onClick={() => toggleSort('price')}
                        className={`text-sm px-2 py-1 rounded flex items-center ${sortOrder.field === 'price' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        Price <SortIcon field="price" />
                    </button>
                    <button
                        onClick={() => toggleSort('city')}
                        className={`text-sm px-2 py-1 rounded flex items-center ${sortOrder.field === 'city' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        City <SortIcon field="city" />
                    </button>
                    <button
                        onClick={() => toggleSort('updatedAt')}
                        className={`text-sm px-2 py-1 rounded flex items-center ${sortOrder.field === 'updatedAt' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                        Last Updated <SortIcon field="updatedAt" />
                    </button>
                </div>
            </div>

            {/* Results Summary */}
            <div className="mb-4 text-sm text-gray-500">
                Showing {displayedProperties.length} of {properties.length} properties
            </div>

            {/* Properties Grid */}
            {properties.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {displayedProperties.map((property, index) => (
                                <motion.div
                                    key={property.post_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05
                                    }}
                                >
                                    <PropertyCard
                                        property={property}
                                        onEdit={() => onEdit(property)}
                                        onDelete={() => onDelete(property.post_id)}
                                        onUpdateStatus={(status) => onUpdateStatus(property._id, status)}
                                        onViewDetails={() => onViewDetails(property)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Load More Button */}
                    {sortedProperties.length > visiblePropertyCount && (
                        <div className="flex justify-center mt-8">
                            <motion.button
                                onClick={loadMore}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Load More Properties
                            </motion.button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function PropertyCard({ property, onEdit, onDelete, onUpdateStatus, onViewDetails }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'listed':
                return 'bg-green-100 text-green-800';
            case 'unlisted':
                return 'bg-gray-100 text-gray-800';
            case 'payment-pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspicious':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const navigate = useNavigate()
    const handleAddPropertyViewer = (id) => {
        navigate(`/manager?id=${id}&targetType=property`)
        
    }
    const handleViewPropertyViewer = (id) => {
        navigate(`/viewer?id=${id}`)

    }

    const handleUploadNewVideoNavigation = (id)=>{
        const uploadInfo = {
            entityId : id,
            entityType: 'Property'
        }
        navigate(`/upload`, { state: uploadInfo })

    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
            {/* Property Image */}
            <div className="h-48 w-full overflow-hidden relative">
                {property.post_image ? (
                    <img
                        src={property.post_image}
                        alt={property.post_title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status || 'unlisted'}
                </div>
            </div>

            {/* Property Details */}
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={property.post_title}>
                    {property.post_title}
                </h3>

                <div className="text-sm text-gray-500 mb-2">
                    ID: {property.post_id} | {property.type_name}
                </div>

                <div className="flex space-x-4 mb-3">
                    <div className="text-sm font-medium text-gray-900">
                        {property.price ? `₹${property.price.toLocaleString()}` : 'Price on Request'}
                        <span className="text-xs text-gray-500 ml-1">{property.priceUnit}</span>
                    </div>

                    <div className="text-sm">
                        {property.area} <span className="text-xs text-gray-500">{property.areaUnit}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {property.bedrooms && (
                        <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {property.bedrooms} Beds
                        </span>
                    )}
                    {property.bathrooms && (
                        <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {property.bathrooms} Baths
                        </span>
                    )}
                    {property.furnishing && (
                        <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {property.furnishing}
                        </span>
                    )}
                </div>

                <p className="text-xs text-gray-500 mb-3 line-clamp-2" title={property.address}>
                    {property.address || 'No address provided'}
                </p>

                {/* Location */}
                {property.post_city && (
                    <div className="text-xs text-gray-500 mb-3">
                        {property.post_city}{property.locality ? `, ${property.locality}` : ''}
                    </div>
                )}

                <div className="mt-auto">
                    {/* Status Update */}
                    <div className="mb-4">
                        <label htmlFor={`status-${property.post_id}`} className="block text-xs font-medium text-gray-700 mb-1">
                            Update Status
                        </label>
                        <select
                            id={`status-${property.post_id}`}
                            className="block w-full border border-gray-300 rounded text-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={property.status || 'unlisted'}
                            onChange={(e) => onUpdateStatus(e.target.value)}
                        >
                            <option value="listed">Listed</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="payment-pending">Payment Pending</option>
                            <option value="suspicious">Suspicious</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                        <button
                            onClick={onEdit}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                        </button>

                        <button
                            onClick={onViewDetails}
                            className="flex items-center text-sm text-green-600 hover:text-green-800 transition-colors"
                        >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Details
                        </button>

                        <button
                            onClick={onDelete}
                            className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                        </button>
                    </div>
                    <div>
                        <Button onClick={() => handleAddPropertyViewer(property?._id)}>Add Property Viewer</Button>
                        <Button onClick={() => handleViewPropertyViewer(property._id)}>View Property Viewer</Button>
                    </div>
                    <div>
                        <Button onClick={()=>handleUploadNewVideoNavigation(property?._id)} >Upload New Video</Button>
                    </div>
                    {
                        property?.videos?.length > 0 && <VideoCard playlist={property?.videos} />
                    }
                </div>
            </div>
        </div>
    );
}