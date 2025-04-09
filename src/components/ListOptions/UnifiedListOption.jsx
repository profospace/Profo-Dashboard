import React, { useState, useEffect } from 'react';
import { ChevronRight, Filter, MapPin, Star, Home, Building, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { base_url } from "../../../utils/base_url";

// Entity card components
const PropertyCard = ({ property, viewType = 'compact' }) => {
    return (
        <div className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={property.post_image || property.post_images?.[0]?.url || 'https://example.com/default-property.jpg'}
                    alt={property.post_title}
                    className="w-full h-48 object-cover"
                />
                {property.tags && property.tags.length > 0 && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        {property.tags[0]}
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{property.post_title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm truncate">{property.address}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="font-bold text-gray-900">₹{property.price?.toLocaleString()}</div>
                    {viewType === 'detailed' && (
                        <div className="text-sm text-gray-600">
                            {property.area} {property.areaUnit || 'sq.ft'}
                        </div>
                    )}
                </div>

                {viewType === 'detailed' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {property.bedrooms && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                            </span>
                        )}
                        {property.bathrooms && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                            </span>
                        )}
                        {property.furnishing && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {property.furnishing}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProjectCard = ({ project, viewType = 'compact' }) => {
    return (
        <div className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={project.image || 'https://example.com/default-project.jpg'}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-700 text-white text-xs px-2 py-1 rounded">
                    {project.status || 'Under Construction'}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{project.name}</h3>

                {project.builder && (
                    <div className="text-sm text-gray-600 mb-2">by {project.builder.name}</div>
                )}

                <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm truncate">{project.location}</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="font-bold text-gray-900">
                        Starting ₹{project.overview?.startingPrice?.toLocaleString() || 'Price on Request'}
                    </div>

                    {viewType === 'detailed' && project.overview?.possession && (
                        <div className="text-sm text-gray-600">
                            Possession: {project.overview.possession}
                        </div>
                    )}
                </div>

                {viewType === 'detailed' && project.gallery && (
                    <div className="mt-2 text-sm text-gray-600">
                        {project.gallery.totalCount} photos available
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomOptionCard = ({ option }) => {
    return (
        <div className="relative rounded-lg overflow-hidden group">
            <img
                src={option.imagelink}
                alt={option.textview}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                <div className="text-white font-medium">{option.textview}</div>
            </div>
        </div>
    );
};

// FilterPanel component
const FilterPanel = ({ entityType, filters, setFilters, onApplyFilters }) => {
    const handleFilterChange = (category, key, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="mb-4">
                <h3 className="font-medium text-gray-800 mb-2">Filters</h3>
                <div className="border-b border-gray-200 mb-3"></div>
            </div>

            {entityType === 'property' && (
                <>
                    {/* Property Type Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filters.property.type || ''}
                            onChange={(e) => handleFilterChange('property', 'type', e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Shops">Shops</option>
                            <option value="Warehouses">Warehouses</option>
                            <option value="Halls">Halls</option>
                        </select>
                    </div>

                    {/* Bedrooms Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filters.property.bedrooms || ''}
                            onChange={(e) => handleFilterChange('property', 'bedrooms', e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.property.priceMin || ''}
                                onChange={(e) => handleFilterChange('property', 'priceMin', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.property.priceMax || ''}
                                onChange={(e) => handleFilterChange('property', 'priceMax', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Furnishing Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filters.property.furnishing || ''}
                            onChange={(e) => handleFilterChange('property', 'furnishing', e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="Unfurnished">Unfurnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Fully-Furnished">Fully-Furnished</option>
                        </select>
                    </div>
                </>
            )}

            {entityType === 'project' && (
                <>
                    {/* Project Type Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filters.project.type || ''}
                            onChange={(e) => handleFilterChange('project', 'type', e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="RESIDENTIAL">Residential</option>
                            <option value="COMMERCIAL">Commercial</option>
                            <option value="MIXED_USE">Mixed Use</option>
                        </select>
                    </div>

                    {/* Project Status Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={filters.project.status || ''}
                            onChange={(e) => handleFilterChange('project', 'status', e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="UNDER_CONSTRUCTION">Under Construction</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.project.priceMin || ''}
                                onChange={(e) => handleFilterChange('project', 'priceMin', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.project.priceMax || ''}
                                onChange={(e) => handleFilterChange('project', 'priceMax', e.target.value)}
                            />
                        </div>
                    </div>
                </>
            )}

            <button
                onClick={onApplyFilters}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
                Apply Filters
            </button>
        </div>
    );
};

// Main ListOption component
const UnifiedListOption = ({
    sectionConfig,
    userLocation = null,
    onItemSelect = () => { },
    className = ""
}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        property: {
            type: '',
            bedrooms: '',
            priceMin: '',
            priceMax: '',
            furnishing: ''
        },
        project: {
            type: '',
            status: '',
            priceMin: '',
            priceMax: ''
        },
        building: {
            type: '',
            status: ''
        }
    });
    const [viewMode, setViewMode] = useState(sectionConfig?.viewType || 'compact');
    const [sortDirection, setSortDirection] = useState(sectionConfig?.sortBy?.order || 'desc');

    // Fetch data based on entity type and filters
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            let endpoint = '';
            let queryParams = new URLSearchParams();

            // Add geolocation parameters if available
            if (sectionConfig.useGeolocation && userLocation) {
                queryParams.append('latitude', userLocation.latitude);
                queryParams.append('longitude', userLocation.longitude);
                queryParams.append('radius', sectionConfig.defaultRadius || 10);
            }

            // Add city filter if specified
            if (sectionConfig.city) {
                queryParams.append('city', sectionConfig.city);
            }

            // Add region filter if specified
            if (sectionConfig.region) {
                queryParams.append('region', sectionConfig.region);
            }

            // Add limit parameter
            queryParams.append('limit', sectionConfig.limit || 5);

            // Add sort parameter
            if (sectionConfig.sortBy) {
                queryParams.append('sort', sortDirection);
            }

            // Entity-specific endpoints and filters
            if (sectionConfig.entityType === 'property') {
                endpoint = '/api/properties/filter';

                // Add property-specific filters
                if (filters.property.type) queryParams.append('type_name', filters.property.type);
                if (filters.property.bedrooms) queryParams.append('bedrooms', filters.property.bedrooms);
                if (filters.property.priceMin) queryParams.append('priceMin', filters.property.priceMin);
                if (filters.property.priceMax) queryParams.append('priceMax', filters.property.priceMax);
                if (filters.property.furnishing) queryParams.append('furnishing', filters.property.furnishing);

            } else if (sectionConfig.entityType === 'project') {
                endpoint = '/api/projects';

                // Add project-specific filters
                if (filters.project.type) queryParams.append('type', filters.project.type);
                if (filters.project.status) queryParams.append('status', filters.project.status);
                if (filters.project.priceMin) queryParams.append('priceMin', filters.project.priceMin);
                if (filters.project.priceMax) queryParams.append('priceMax', filters.project.priceMax);

            } else if (sectionConfig.entityType === 'building') {
                endpoint = '/api/buildings';

                // Add building-specific filters
                if (filters.building.type) queryParams.append('type', filters.building.type);
                if (filters.building.status) queryParams.append('status', filters.building.status);
            }

            // Make the API request
            const response = await fetch(`${base_url}${endpoint}?${queryParams.toString()}`);
            console.log("response", response)

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            // Extract the items based on the response structure
            let fetchedItems = [];

            if (sectionConfig?.entityType === 'property') {
                fetchedItems = data.properties || [];
            } else if (sectionConfig?.entityType === 'project') {
                fetchedItems = data.projects || data || [];
            } else if (sectionConfig?.entityType === 'building') {
                fetchedItems = data.buildings || data || [];
            } else if (sectionConfig?.entityType === 'custom') {
                // For custom options, use the pre-configured options
                fetchedItems = sectionConfig?.options || [];
            }

            setItems(fetchedItems);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and fetch new data
    const handleApplyFilters = () => {
        fetchData();
        setShowFilters(false);
    };

    // Toggle sort direction
    const handleToggleSort = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
    };

    // Fetch data on mount and when filters/sort change
    useEffect(() => {
        if (sectionConfig.entityType === 'custom') {
            // For custom options, set them directly without API call
            setItems(sectionConfig.options || []);
            setLoading(false);
        } else {
            fetchData();
        }
    }, [sortDirection]);

    // Render the appropriate card component based on entity type
    const renderCard = (item, index) => {
        switch (sectionConfig.entityType) {
            case 'property':
                return (
                    <div
                        key={item.post_id || index}
                        onClick={() => onItemSelect('property', item)}
                        className="cursor-pointer"
                    >
                        <PropertyCard property={item} viewType={viewMode} />
                    </div>
                );
            case 'project':
                return (
                    <div
                        key={item.id || index}
                        onClick={() => onItemSelect('project', item)}
                        className="cursor-pointer"
                    >
                        <ProjectCard project={item} viewType={viewMode} />
                    </div>
                );
            case 'custom':
            default:
                return (
                    <div
                        key={index}
                        onClick={() => onItemSelect('custom', item)}
                        className="cursor-pointer"
                    >
                        <CustomOptionCard option={item} />
                    </div>
                );
        }
    };

    // Determine grid class based on view mode and category type
    const getGridClass = () => {
        if (sectionConfig.categoryType === 'grid_view') {
            return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
        } else if (sectionConfig.categoryType === 'horizontal_list' ||
            sectionConfig.categoryType.includes('carousal')) {
            return 'flex overflow-x-auto gap-4 pb-4 hide-scrollbar';
        } else if (sectionConfig.categoryType === 'vertical_list') {
            return 'flex flex-col gap-4';
        } else {
            return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
        }
    };

    // Card width for horizontal lists
    const getCardStyle = () => {
        if (sectionConfig.categoryType === 'horizontal_list' ||
            sectionConfig.categoryType.includes('carousal')) {
            return { minWidth: '260px', maxWidth: '300px' };
        }
        return {};
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
            {/* Header with background */}
            {sectionConfig?.headerImage && (
                <div
                    className="relative h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${sectionConfig?.headerImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h2 className="text-xl md:text-2xl font-bold text-white">{sectionConfig?.title}</h2>
                        {sectionConfig?.subtitle && (
                            <p className="text-white text-sm md:text-base opacity-80">{sectionConfig?.subtitle}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Section header without background */}
            {!sectionConfig?.headerImage && (
                <div className="p-4 border-b" style={{ backgroundColor: sectionConfig?.backgroundColor || '#ffffff' }}>
                    <h2 className="text-xl font-bold text-gray-800">{sectionConfig?.title}</h2>
                    {sectionConfig?.subtitle && (
                        <p className="text-gray-600 text-sm">{sectionConfig?.subtitle}</p>
                    )}
                </div>
            )}

            {/* Controls: Filter, View Mode, Sort */}
            {sectionConfig?.entityType !== 'custom' && (
                <div className="px-4 py-2 border-b flex justify-between items-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-sm text-gray-600 hover:text-blue-500"
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        Filters
                    </button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('compact')}
                            className={`p-1 rounded ${viewMode === 'compact' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        >
                            <Grid className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setViewMode('detailed')}
                            className={`p-1 rounded ${viewMode === 'detailed' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        >
                            <List className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                            onClick={handleToggleSort}
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            {sortDirection === 'asc' ? (
                                <SortAsc className="h-4 w-4 text-gray-600" />
                            ) : (
                                <SortDesc className="h-4 w-4 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Filter panel */}
            {showFilters && (
                <div className="p-4 border-b">
                    <FilterPanel
                        entityType={sectionConfig.entityType}
                        filters={filters}
                        setFilters={setFilters}
                        onApplyFilters={handleApplyFilters}
                    />
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="p-8 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="p-8 text-center text-red-500">
                    <p>{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Items grid/list */}
            {!loading && !error && items.length > 0 && (
                <div className={`p-4 ${getGridClass()}`}>
                    {items.map((item, index) => (
                        <div key={index} style={getCardStyle()}>
                            {renderCard(item, index)}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && items.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No items found.</p>
                    {sectionConfig.entityType !== 'custom' && (
                        <button
                            onClick={() => {
                                setFilters({
                                    property: {
                                        type: '',
                                        bedrooms: '',
                                        priceMin: '',
                                        priceMax: '',
                                        furnishing: ''
                                    },
                                    project: {
                                        type: '',
                                        status: '',
                                        priceMin: '',
                                        priceMax: ''
                                    },
                                    building: {
                                        type: '',
                                        status: ''
                                    }
                                });
                                fetchData();
                            }}
                            className="mt-2 text-blue-500 hover:underline"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Footer with button */}
            {sectionConfig?.buttonText && sectionConfig?.buttonLink && (
                <div className="p-4 border-t flex justify-center">
                    <a
                        href={sectionConfig?.buttonLink}
                        className="flex items-center px-4 py-2 rounded-md"
                        style={{
                            backgroundColor: sectionConfig?.buttonColor || '#3b82f6',
                            color: '#ffffff'
                        }}
                    >
                        {sectionConfig?.buttonText}
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                </div>
            )}
        </div>
    );
};

export default UnifiedListOption;