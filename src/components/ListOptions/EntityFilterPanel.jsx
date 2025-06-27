// import React, { useState, useEffect } from 'react';
// import { Filter, Search, RefreshCw, Check, X, ChevronRight } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';

// const EntityFilterPanel = ({ entityType, onSelectEntities, selectedEntities = [], defaultCity = '' }) => {
//     // States for filter fields
//     const [city, setCity] = useState(defaultCity || '');
//     const [minPrice, setMinPrice] = useState('');
//     const [maxPrice, setMaxPrice] = useState('');
//     const [type, setType] = useState('');
//     const [status, setStatus] = useState('');
//     const [purpose, setPurpose] = useState('');
//     const [bedrooms, setBedrooms] = useState('');
//     const [bathrooms, setBathrooms] = useState('');
//     const [furnishing, setFurnishing] = useState('');
//     const [locality, setLocality] = useState('');
//     const [limit, setLimit] = useState('');

//     // States for available options in dropdowns
//     const [availableCities, setAvailableCities] = useState([]);
//     const [availableTypes, setAvailableTypes] = useState([]);
//     const [availableStatuses, setAvailableStatuses] = useState([]);
//     const [availableLocalities, setAvailableLocalities] = useState([]);

//     // States for results and loading
//     const [filteredEntities, setFilteredEntities] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedIds, setSelectedIds] = useState(
//         selectedEntities.map(entity => entity._id || entity.id || entity.post_id)
//     );

//     // Load initial data based on entity type
//     useEffect(() => {
//         fetchFilterOptions();
//     }, [entityType]);

//     // Update city if defaultCity changes
//     useEffect(() => {
//         if (defaultCity && defaultCity !== city) {
//             setCity(defaultCity);
//         }
//     }, [defaultCity]);

//     // Fetch available filter options based on entity type
//     const fetchFilterOptions = async () => {
//         try {
//             // Fetch cities
//             const citiesResponse = await fetch(`${base_url}/api/list-options/available-cities`);
//             if (!citiesResponse.ok) throw new Error('Failed to fetch cities');
//             const citiesData = await citiesResponse.ok ? await citiesResponse.json() : { cities: [] };

//             // Set available cities
//             if (citiesData && citiesData.cities) {
//                 setAvailableCities(citiesData.cities);
//             }

//             // Fetch entity-specific options
//             if (entityType === 'properties') {
//                 const typesResponse = await fetch(`${base_url}/api/list-options/property-types`);
//                 if (typesResponse.ok) {
//                     const typesData = await typesResponse.json();
//                     console.log("typesData", typesData)
//                     setAvailableTypes(typesData.types || []);
//                 }
//             } else if (entityType === 'projects') {
//                 const [typesResponse, statusesResponse] = await Promise.all([
//                     fetch(`${base_url}/api/list-options/project-types`),
//                     fetch(`${base_url}/api/list-options/project-statuses`)
//                 ]);

//                 if (typesResponse.ok) {
//                     const typesData = await typesResponse.json();
//                     setAvailableTypes(typesData.types || []);
//                 }

//                 if (statusesResponse.ok) {
//                     const statusesData = await statusesResponse.json();
//                     setAvailableStatuses(statusesData.statuses || []);
//                 }
//             } else if (entityType === 'buildings') {
//                 const typesResponse = await fetch(`${base_url}/api/list-options/building-types`);
//                 if (typesResponse.ok) {
//                     const typesData = await typesResponse.json();
//                     setAvailableTypes(typesData.types || []);
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching filter options:', error);
//             setError('Failed to load filter options');
//         }
//     };

//     // Apply filters and fetch entities
//     const applyFilters = async () => {
//         setLoading(true);
//         setError('');

//         try {
//             // Build query parameters based on filters
//             const params = new URLSearchParams();
//             if (city) params.append('city', city);
//             if (type) params.append(entityType === 'properties' ? 'type_name' : 'type', type);
//             if (minPrice) params.append('minPrice', minPrice);
//             if (maxPrice) params.append('maxPrice', maxPrice);
//             if (limit) params.append('limit', limit);

//             // Entity-specific parameters
//             if (entityType === 'properties') {
//                 if (bedrooms) params.append('bedrooms', bedrooms);
//                 if (bathrooms) params.append('bathrooms', bathrooms);
//                 if (furnishing) params.append('furnishing', furnishing);
//                 if (locality) params.append('locality', locality);
//                 if (purpose) params.append('purpose', purpose);
//             } else if (entityType === 'projects' || entityType === 'buildings') {
//                 if (status) params.append('status', status);
//             }

//             // Fetch filtered entities
//             const response = await fetch(`${base_url}/api/list-options/filter-${entityType}?${params.toString()}`);

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch ${entityType}`);
//             }

//             const data = await response.json();

//             // Extract the entities based on entityType
//             let entities;
//             if (entityType === 'properties') entities = data.properties;
//             else if (entityType === 'projects') entities = data.projects;
//             else if (entityType === 'buildings') entities = data.buildings;
//             else entities = [];

//             setFilteredEntities(entities || []);

//             // Check if any previously selected entities are no longer in the filtered results
//             // and update the selection accordingly
//             const filteredIds = entities.map(entity => entity._id || entity.id || entity.post_id);
//             const updatedSelectedIds = selectedIds.filter(id => filteredIds.includes(id));

//             if (updatedSelectedIds.length !== selectedIds.length) {
//                 setSelectedIds(updatedSelectedIds);
//                 // Update parent component with the new selection
//                 const selectedEntities = entities.filter(entity =>
//                     updatedSelectedIds.includes(entity._id || entity.id || entity.post_id)
//                 );
//                 onSelectEntities(selectedEntities);
//             }

//         } catch (error) {
//             console.error(`Error fetching ${entityType}:`, error);
//             setError(`Failed to load ${entityType}`);
//             setFilteredEntities([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Reset filters
//     const resetFilters = () => {
//         setCity(defaultCity || '');
//         setType('');
//         setStatus('');
//         setMinPrice('');
//         setMaxPrice('');
//         setBedrooms('');
//         setBathrooms('');
//         setFurnishing('');
//         setLocality('');
//         setPurpose('');
//     };

//     // Toggle entity selection
//     const toggleEntitySelection = (entity) => {
//         const entityId = entity._id || entity.id || entity.post_id;
//         let newSelectedIds;

//         if (selectedIds.includes(entityId)) {
//             // Remove from selection
//             newSelectedIds = selectedIds.filter(id => id !== entityId);
//         } else {
//             // Add to selection
//             newSelectedIds = [...selectedIds, entityId];
//         }

//         setSelectedIds(newSelectedIds);

//         // Update parent component with the new selection
//         const selectedEntities = filteredEntities.filter(entity =>
//             newSelectedIds.includes(entity._id || entity.id || entity.post_id)
//         );
//         onSelectEntities(selectedEntities);
//     };

//     // Format price
//     const formatPrice = (price) => {
//         if (!price) return 'N/A';

//         // Convert to number if it's a string
//         const numPrice = typeof price === 'string' ? parseFloat(price) : price;

//         // Format based on magnitude
//         if (numPrice >= 10000000) {
//             return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
//         } else if (numPrice >= 100000) {
//             return `₹${(numPrice / 100000).toFixed(2)} Lac`;
//         } else {
//             return `₹${numPrice.toLocaleString()}`;
//         }
//     };

//     // Select all entities
//     const selectAllEntities = () => {
//         const allIds = filteredEntities.map(entity => entity._id || entity.id || entity.post_id);
//         setSelectedIds(allIds);
//         onSelectEntities(filteredEntities);
//     };

//     // Clear all selections
//     const clearAllSelections = () => {
//         setSelectedIds([]);
//         onSelectEntities([]);
//     };

//     // Get entity image based on entity type
//     const getEntityImage = (entity) => {
//         if (entityType === 'properties') {
//             return entity.post_images?.[0]?.url || entity.post_image || '/placeholder-property.jpg';
//         } else if (entityType === 'projects') {
//             return entity.gallery?.[0]?.images?.[0] || entity.masterPlan || '/placeholder-project.jpg';
//         } else if (entityType === 'buildings') {
//             return entity.galleryList?.[0] || '/placeholder-building.jpg';
//         }
//         return '/placeholder.jpg';
//     };

//     // Get entity title based on entity type
//     const getEntityTitle = (entity) => {
//         if (entityType === 'properties') {
//             return entity.post_title || 'Unnamed Property';
//         } else if (entityType === 'projects') {
//             return entity.name || 'Unnamed Project';
//         } else if (entityType === 'buildings') {
//             return entity.name || 'Unnamed Building';
//         }
//         return 'Unnamed Entity';
//     };

//     // Get entity price based on entity type
//     const getEntityPrice = (entity) => {
//         if (entityType === 'properties') {
//             return formatPrice(entity.price);
//         } else if (entityType === 'projects') {
//             return formatPrice(entity.overview?.priceRange?.min);
//         } else if (entityType === 'buildings') {
//             return 'Contact for Price';
//         }
//         return 'Price not available';
//     };

//     // Get entity location based on entity type
//     const getEntityLocation = (entity) => {
//         if (entityType === 'properties') {
//             return entity.address || entity.locality || entity.city || 'Location not specified';
//         } else if (entityType === 'projects') {
//             return entity.location?.address || 'Location not specified';
//         } else if (entityType === 'buildings') {
//             return entity.location?.address || 'Location not specified';
//         }
//         return 'Location not specified';
//     };

//     return (
//         <div className="space-y-4">
//             {/* Filter Panel */}
//             <div className="bg-white p-4 rounded-md border border-gray-200">
//                 <div className="flex items-center mb-4">
//                     <Filter className="w-5 h-5 text-blue-500 mr-2" />
//                     <h3 className="font-medium text-gray-800">Filter {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {/* City */}
//                     <div>
//                         <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                             City
//                         </label>
//                         <select
//                             id="city"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">All Cities</option>
//                             {availableCities.map((cityOption, index) => (
//                                 <option key={index} value={cityOption}>
//                                     {cityOption}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Type - for all entity types */}
//                     <div>
//                         <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
//                             Type
//                         </label>
//                         <select
//                             id="type"
//                             value={type}
//                             onChange={(e) => setType(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">All Types</option>
//                             {availableTypes.map((typeOption, index) => (
//                                 <option key={index} value={typeOption}>
//                                     {typeOption}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Status - Projects Only */}
//                     {entityType === 'projects' && (
//                         <div>
//                             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Status
//                             </label>
//                             <select
//                                 id="status"
//                                 value={status}
//                                 onChange={(e) => setStatus(e.target.value)}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">All Statuses</option>
//                                 {availableStatuses.map((statusOption, index) => (
//                                     <option key={index} value={statusOption}>
//                                         {statusOption.replace(/_/g, ' ')}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     )}

//                     {/* Properties specific filters */}
//                     {entityType === 'properties' && (
//                         <>
//                             <div>
//                                 <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Bedrooms
//                                 </label>
//                                 <select
//                                     id="bedrooms"
//                                     value={bedrooms}
//                                     onChange={(e) => setBedrooms(e.target.value)}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Any</option>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                     <option value="3">3</option>
//                                     <option value="4">4</option>
//                                     <option value="5">5+</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Bathrooms
//                                 </label>
//                                 <select
//                                     id="bathrooms"
//                                     value={bathrooms}
//                                     onChange={(e) => setBathrooms(e.target.value)}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Any</option>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                     <option value="3">3</option>
//                                     <option value="4">4+</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Furnishing
//                                 </label>
//                                 <select
//                                     id="furnishing"
//                                     value={furnishing}
//                                     onChange={(e) => setFurnishing(e.target.value)}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     <option value="">Any</option>
//                                     <option value="Furnished">Furnished</option>
//                                     <option value="Semi-Furnished">Semi-Furnished</option>
//                                     <option value="Unfurnished">Unfurnished</option>
//                                 </select>
//                             </div>
//                         </>
//                     )}

//                     {/* Results limit */}
//                     <div>
//                         <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
//                             Limit Results
//                         </label>
//                         <select
//                             id="limit"
//                             value={limit}
//                             onChange={(e) => setLimit(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">All</option>
//                             <option value="10">10</option>
//                             <option value="20">20</option>
//                             <option value="50">50</option>
//                             <option value="100">100</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap gap-2">
//                     <button
//                         type="button"
//                         onClick={applyFilters}
//                         className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
//                     >
//                         <Filter className="w-4 h-4" />
//                         Apply Filters
//                     </button>

//                     <button
//                         type="button"
//                         onClick={resetFilters}
//                         className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
//                     >
//                         <RefreshCw className="w-4 h-4" />
//                         Reset
//                     </button>
//                 </div>
//             </div>

//             {/* Results Panel */}
//             <div className="bg-white p-4 rounded-md border border-gray-200">
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="flex items-center">
//                         <Search className="w-5 h-5 text-blue-500 mr-2" />
//                         <h3 className="font-medium text-gray-800">
//                             Results ({filteredEntities.length})
//                         </h3>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             type="button"
//                             onClick={selectAllEntities}
//                             disabled={filteredEntities.length === 0}
//                             className={`text-xs px-2 py-1 rounded ${filteredEntities.length === 0
//                                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                     : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                                 }`}
//                         >
//                             Select All
//                         </button>

//                         <button
//                             type="button"
//                             onClick={clearAllSelections}
//                             disabled={selectedIds.length === 0}
//                             className={`text-xs px-2 py-1 rounded ${selectedIds.length === 0
//                                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                     : 'bg-red-100 text-red-700 hover:bg-red-200'
//                                 }`}
//                         >
//                             Clear All
//                         </button>
//                     </div>
//                 </div>

//                 {/* Selection Status */}
//                 <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md">
//                     <p className="text-sm">
//                         {selectedIds.length} {entityType} selected
//                     </p>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="flex justify-center py-12">
//                         <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                     </div>
//                 )}

//                 {/* Error State */}
//                 {!loading && error && (
//                     <div className="p-4 text-center text-red-500">
//                         <p>{error}</p>
//                     </div>
//                 )}

//                 {/* Empty State */}
//                 {!loading && !error && filteredEntities.length === 0 && (
//                     <div className="py-12 text-center text-gray-500">
//                         <p>No {entityType} found. Try adjusting your filters.</p>
//                     </div>
//                 )}

//                 {/* Results Grid */}
//                 {!loading && !error && filteredEntities.length > 0 && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                         {filteredEntities.map((entity) => {
//                             const entityId = entity._id || entity.id || entity.post_id;
//                             const isSelected = selectedIds.includes(entityId);

//                             return (
//                                 <div
//                                     key={entityId}
//                                     className={`border rounded-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
//                                         }`}
//                                     onClick={() => toggleEntitySelection(entity)}
//                                 >
//                                     <div className="relative h-40">
//                                         <img
//                                             src={getEntityImage(entity)}
//                                             alt={getEntityTitle(entity)}
//                                             className="w-full h-full object-cover"
//                                         />
//                                         {/* Selection Indicator */}
//                                         <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-300'
//                                             }`}>
//                                             {isSelected && <Check className="w-4 h-4" />}
//                                         </div>
//                                     </div>

//                                     <div className="p-3">
//                                         <h4 className="font-medium text-gray-800 mb-1 truncate">
//                                             {getEntityTitle(entity)}
//                                         </h4>

//                                         <p className="text-sm text-gray-600 mb-2 truncate">
//                                             {getEntityLocation(entity)}
//                                         </p>

//                                         <div className="flex justify-between items-center">
//                                             <span className="text-sm font-medium text-blue-600">
//                                                 {getEntityPrice(entity)}
//                                             </span>

//                                             {entityType === 'properties' && entity.type_name && (
//                                                 <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
//                                                     {entity.type_name}
//                                                 </span>
//                                             )}

//                                             {entityType === 'projects' && entity.status && (
//                                                 <span className={`text-xs px-2 py-1 rounded ${entity.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
//                                                         entity.status === 'UNDER_CONSTRUCTION' ? 'bg-yellow-100 text-yellow-700' :
//                                                             'bg-blue-100 text-blue-700'
//                                                     }`}>
//                                                     {entity.status.replace(/_/g, ' ')}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EntityFilterPanel;

// import React, { useState, useEffect } from 'react';
// import { Filter, Search, RefreshCw, Check, X, ChevronRight, ChevronDown } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';
// import axios from 'axios';

// const EntityFilterPanel = ({ entityType, onSelectEntities, selectedEntities = [], defaultCity = '' }) => {
//     // States for dynamic filter fields
//     const [filterValues, setFilterValues] = useState({});
//     const [schemaData, setSchemaData] = useState(null);
//     const [expandedSections, setExpandedSections] = useState({
//         basic: true,
//         location: true,
//         price: true,
//         features: false,
//         amenities: false,
//         advanced: false
//     });

//     // States for results and loading
//     const [filteredEntities, setFilteredEntities] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [schemaLoading, setSchemaLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedIds, setSelectedIds] = useState(
//         selectedEntities.map(entity => entity._id || entity.id || entity.post_id)
//     );

//     // Load schema data and initialize filters
//     useEffect(() => {
//         fetchSchemaData();
//     }, [entityType]);

//     // Update city if defaultCity changes
//     useEffect(() => {
//         if (defaultCity && schemaData) {
//             setFilterValues(prev => ({ ...prev, city: defaultCity }));
//         }
//     }, [defaultCity, schemaData]);

//     // Fetch schema data for dynamic filters
//     const fetchSchemaData = async () => {
//         setSchemaLoading(true);
//         try {
//             let endpoint = '';
//             if (entityType === 'properties') {
//                 endpoint = `${base_url}/getall/properties/keysValues`;
//             } else {
//                 // For other entity types, you can add similar endpoints
//                 endpoint = `${base_url}/api/list-options/available-cities`;
//             }

//             const response = await fetch(endpoint);
//             if (!response.ok) throw new Error('Failed to fetch schema data');

//             const data = await response.json();

//             if (entityType === 'properties' && data.success) {
//                 setSchemaData(data.data);
//                 // Initialize filter values with default city
//                 setFilterValues({ city: defaultCity || '', limit: '' });
//             } else {
//                 // Fallback for other entity types
//                 setSchemaData({ city: data.cities || [] });
//                 setFilterValues({ city: defaultCity || '', limit: '' });
//             }
//         } catch (error) {
//             console.error('Error fetching schema data:', error);
//             setError('Failed to load filter options');
//         } finally {
//             setSchemaLoading(false);
//         }
//     };

//     // Categorize fields for better UI organization
//     const categorizeFields = () => {
//         if (!schemaData) return {};

//         const categories = {
//             basic: {
//                 title: 'Basic Filters',
//                 fields: ['type_name', 'purpose', 'status', 'category', 'configuration', 'transactionType']
//             },
//             location: {
//                 title: 'Location',
//                 fields: ['city', 'locality', 'region']
//             },
//             price: {
//                 title: 'Price & Area',
//                 fields: ['priceUnit', 'areaUnit']
//             },
//             property_details: {
//                 title: 'Property Details',
//                 fields: ['construction_status', 'possession', 'furnishing', 'furnishStatus', 'facing', 'propertyOwnership', 'flooring', 'parking', 'powerBackup', 'agreement']
//             },
//             features: {
//                 title: 'Features & Amenities',
//                 fields: ['amenities', 'facilities', 'propertyFeatures', 'overlookingAmenities', 'kitchenType', 'bathroomFeatures', 'flooringType']
//             },
//             location_factors: {
//                 title: 'Location Factors',
//                 fields: ['location_advantage', 'locationFactors', 'waterSource', 'religiousNearby', 'inProximity', 'socialInfrastructure']
//             },
//             investment: {
//                 title: 'Investment & Legal',
//                 fields: ['loanApprovalStatus', 'builderReputation', 'legalClearance', 'legalStatuses', 'financingOptions', 'propertyTaxClasses', 'investmentStrategies']
//             },
//             advanced: {
//                 title: 'Advanced Options',
//                 fields: ['tags', 'usp', 'vastuCompliance', 'viewTypes', 'propertyConditions', 'environmentalFactors', 'specialCategories', 'environmentalCertifications', 'propertyManagementServices', 'constructionStatuses', 'ownershipTypes', 'reraStatus', 'broker_status']
//             }
//         };

//         return categories;
//     };

//     // Handle filter value changes
//     const handleFilterChange = (fieldName, value) => {
//         setFilterValues(prev => ({
//             ...prev,
//             [fieldName]: value
//         }));
//     };

//     // Handle array field changes (multi-select)
//     const handleArrayFieldChange = (fieldName, value, isChecked) => {
//         setFilterValues(prev => {
//             const currentValues = prev[fieldName] || [];
//             if (isChecked) {
//                 return {
//                     ...prev,
//                     [fieldName]: [...currentValues, value]
//                 };
//             } else {
//                 return {
//                     ...prev,
//                     [fieldName]: currentValues?.filter(v => v !== value)
//                 };
//             }
//         });
//     };

//     // Render filter input based on field type
//     const renderFilterInput = (fieldName, fieldData) => {
//         const currentValue = filterValues[fieldName] || '';
//         const currentArrayValue = filterValues[fieldName] || [];

//         // Handle array fields
//         if (Array.isArray(fieldData)) {
//             return (
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                     {fieldData.map((option, index) => (
//                         <label key={index} className="flex items-center space-x-2 text-sm">
//                             <input
//                                 type="checkbox"
//                                 checked={currentArrayValue.includes(option)}
//                                 onChange={(e) => handleArrayFieldChange(fieldName, option, e.target.checked)}
//                                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                             <span className="text-gray-700">{option}</span>
//                         </label>
//                     ))}
//                 </div>
//             );
//         }

//         // Handle single value fields
//         return (
//             <select
//                 value={currentValue}
//                 onChange={(e) => handleFilterChange(fieldName, e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
//             >
//                 <option value="">All {fieldName.replace(/_/g, ' ')}</option>
//                 {fieldData.map((option, index) => (
//                     <option key={index} value={option}>
//                         {option}
//                     </option>
//                 ))}
//             </select>
//         );
//     };

//     // Render numeric range inputs
//     const renderNumericRangeInputs = () => {
//         if (!schemaData?.numeric_ranges) return null;

//         const ranges = schemaData.numeric_ranges;
//         const numericFields = [
//             { key: 'price', label: 'Price', min: ranges.minPrice, max: ranges.maxPrice },
//             { key: 'bedrooms', label: 'Bedrooms', min: ranges.minBedrooms, max: ranges.maxBedrooms },
//             { key: 'bathrooms', label: 'Bathrooms', min: ranges.minBathrooms, max: ranges.maxBathrooms },
//             { key: 'carpetArea', label: 'Carpet Area', min: ranges.minCarpetArea, max: ranges.maxCarpetArea },
//             { key: 'superBuiltupArea', label: 'Super Built-up Area', min: ranges.minSuperBuiltupArea, max: ranges.maxSuperBuiltupArea },
//             { key: 'propertyAge', label: 'Property Age', min: ranges.minPropertyAge, max: ranges.maxPropertyAge }
//         ];

//         return (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {numericFields.map(field => {
//                     if (field.min == null || field.max == null) return null;

//                     return (
//                         <div key={field.key} className="space-y-2">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 {field.label}
//                             </label>
//                             <div className="flex space-x-2">
//                                 <input
//                                     type="number"
//                                     placeholder={`Min (${field.min})`}
//                                     value={filterValues[`min${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] || ''}
//                                     onChange={(e) => handleFilterChange(`min${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`, e.target.value)}
//                                     className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder={`Max (${field.max})`}
//                                     value={filterValues[`max${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] || ''}
//                                     onChange={(e) => handleFilterChange(`max${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`, e.target.value)}
//                                     className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                 />
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     };

//     // Apply filters and fetch entities
//     const applyFilters = async () => {
//         setLoading(true);
//         setError('');

//         try {
//             const params = new URLSearchParams();

//             // Add all filter values to params
//             Object.entries(filterValues).forEach(([key, value]) => {
//                 if (value && value !== '') {
//                     if (Array.isArray(value)) {
//                         // For array values, add multiple params or join them
//                         value.forEach(v => params.append(key, v));
//                     } else {
//                         params.append(key, value);
//                     }
//                 }
//             });

            

//             // Fetch filtered entities
//             const response = await fetch(`${base_url}/api/list-options/filter-${entityType}?${params.toString()}`);

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch ${entityType}`);
//             }

//             // const data = await response.json();
//             let entities;
//             if (entityType === 'properties') entities = data.properties;
//             // else if (entityType === 'projects') entities = data.projects;
//             // else if (entityType === 'buildings') entities = data.buildings;
//             else entities = [];

//             setFilteredEntities(entities || []);

//         } catch (error) {
//             console.error(`Error fetching ${entityType}:`, error);
//             setError(`Failed to load ${entityType}`);
//             setFilteredEntities([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Reset filters
//     const resetFilters = () => {
//         setFilterValues({ city: defaultCity || '', limit: '' });
//     };

//     // Toggle section expansion
//     const toggleSection = (sectionKey) => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [sectionKey]: !prev[sectionKey]
//         }));
//     };

//     // Toggle entity selection
//     const toggleEntitySelection = (entity) => {
//         const entityId = entity._id || entity.id || entity.post_id;
//         let newSelectedIds;

//         if (selectedIds.includes(entityId)) {
//             newSelectedIds = selectedIds.filter(id => id !== entityId);
//         } else {
//             newSelectedIds = [...selectedIds, entityId];
//         }

//         setSelectedIds(newSelectedIds);
//         const selectedEntities = filteredEntities.filter(entity =>
//             newSelectedIds.includes(entity._id || entity.id || entity.post_id)
//         );
//         onSelectEntities(selectedEntities);
//     };

//     // Format price
//     const formatPrice = (price) => {
//         if (!price) return 'N/A';
//         const numPrice = typeof price === 'string' ? parseFloat(price) : price;
//         if (numPrice >= 10000000) {
//             return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
//         } else if (numPrice >= 100000) {
//             return `₹${(numPrice / 100000).toFixed(2)} Lac`;
//         } else {
//             return `₹${numPrice.toLocaleString()}`;
//         }
//     };

//     // Get entity details
//     const getEntityImage = (entity) => {
//         if (entityType === 'properties') {
//             return entity.post_images?.[0]?.url || entity.post_image || '/placeholder-property.jpg';
//         }
//         return '/placeholder.jpg';
//     };

//     const getEntityTitle = (entity) => {
//         if (entityType === 'properties') {
//             return entity.post_title || 'Unnamed Property';
//         }
//         return 'Unnamed Entity';
//     };

//     const getEntityPrice = (entity) => {
//         if (entityType === 'properties') {
//             return formatPrice(entity.price);
//         }
//         return 'Price not available';
//     };

//     const getEntityLocation = (entity) => {
//         if (entityType === 'properties') {
//             return entity.address || entity.locality || entity.city || 'Location not specified';
//         }
//         return 'Location not specified';
//     };

//     if (schemaLoading) {
//         return (
//             <div className="flex justify-center py-12">
//                 <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//             </div>
//         );
//     }

//     const categories = categorizeFields();

//     return (
//         <div className="space-y-4">
//             {/* Dynamic Filter Panel */}
//             <div className="bg-white p-4 rounded-md border border-gray-200">
//                 <div className="flex items-center mb-4">
//                     <Filter className="w-5 h-5 text-blue-500 mr-2" />
//                     <h3 className="font-medium text-gray-800">Filter {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h3>
//                     {schemaData?.total_properties && (
//                         <span className="ml-2 text-sm text-gray-500">({schemaData.total_properties} total)</span>
//                     )}
//                 </div>

//                 {/* Numeric Range Filters */}
//                 <div className="mb-6">
//                     <div
//                         className="flex items-center justify-between cursor-pointer mb-3"
//                         onClick={() => toggleSection('price')}
//                     >
//                         <h4 className="font-medium text-gray-700">Price & Area Ranges</h4>
//                         {expandedSections.price ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//                     </div>
//                     {expandedSections.price && (
//                         <div className="pl-4 border-l-2 border-blue-100">
//                             {renderNumericRangeInputs()}
//                         </div>
//                     )}
//                 </div>

//                 {/* Dynamic Field Categories */}
//                 {Object.entries(categories).map(([categoryKey, category]) => {
//                     const availableFields = category.fields.filter(field => schemaData && schemaData[field]);

//                     if (availableFields.length === 0) return null;

//                     return (
//                         <div key={categoryKey} className="mb-6">
//                             <div
//                                 className="flex items-center justify-between cursor-pointer mb-3"
//                                 onClick={() => toggleSection(categoryKey)}
//                             >
//                                 <h4 className="font-medium text-gray-700">{category.title}</h4>
//                                 {expandedSections[categoryKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//                             </div>

//                             {expandedSections[categoryKey] && (
//                                 <div className="pl-4 border-l-2 border-blue-100">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {availableFields.map(fieldName => {
//                                             const fieldData = schemaData[fieldName];
//                                             if (!fieldData || (Array.isArray(fieldData) && fieldData.length === 0)) return null;

//                                             return (
//                                                 <div key={fieldName}>
//                                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                         {fieldName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
//                                                     </label>
//                                                     {renderFilterInput(fieldName, fieldData)}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}

//                 {/* Limit Results */}
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Limit Results
//                     </label>
//                     <select
//                         value={filterValues.limit || ''}
//                         onChange={(e) => handleFilterChange('limit', e.target.value)}
//                         className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     >
//                         <option value="">All</option>
//                         <option value="10">10</option>
//                         <option value="20">20</option>
//                         <option value="50">50</option>
//                         <option value="100">100</option>
//                     </select>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                     <button
//                         type="button"
//                         onClick={applyFilters}
//                         className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
//                     >
//                         <Filter className="w-4 h-4" />
//                         Apply Filters
//                     </button>

//                     <button
//                         type="button"
//                         onClick={resetFilters}
//                         className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
//                     >
//                         <RefreshCw className="w-4 h-4" />
//                         Reset
//                     </button>
//                 </div>
//             </div>

//             {/* Results Panel */}
//             <div className="bg-white p-4 rounded-md border border-gray-200">
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="flex items-center">
//                         <Search className="w-5 h-5 text-blue-500 mr-2" />
//                         <h3 className="font-medium text-gray-800">
//                             Results ({filteredEntities.length})
//                         </h3>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 const allIds = filteredEntities.map(entity => entity._id || entity.id || entity.post_id);
//                                 setSelectedIds(allIds);
//                                 onSelectEntities(filteredEntities);
//                             }}
//                             disabled={filteredEntities.length === 0}
//                             className={`text-xs px-2 py-1 rounded ${filteredEntities.length === 0
//                                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                 : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                                 }`}
//                         >
//                             Select All
//                         </button>

//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setSelectedIds([]);
//                                 onSelectEntities([]);
//                             }}
//                             disabled={selectedIds.length === 0}
//                             className={`text-xs px-2 py-1 rounded ${selectedIds.length === 0
//                                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                 : 'bg-red-100 text-red-700 hover:bg-red-200'
//                                 }`}
//                         >
//                             Clear All
//                         </button>
//                     </div>
//                 </div>

//                 {/* Selection Status */}
//                 <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md">
//                     <p className="text-sm">
//                         {selectedIds.length} {entityType} selected
//                     </p>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="flex justify-center py-12">
//                         <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                     </div>
//                 )}

//                 {/* Error State */}
//                 {!loading && error && (
//                     <div className="p-4 text-center text-red-500">
//                         <p>{error}</p>
//                     </div>
//                 )}

//                 {/* Empty State */}
//                 {!loading && !error && filteredEntities.length === 0 && (
//                     <div className="py-12 text-center text-gray-500">
//                         <p>No {entityType} found. Try adjusting your filters.</p>
//                     </div>
//                 )}

//                 {/* Results Grid */}
//                 {!loading && !error && filteredEntities.length > 0 && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                         {filteredEntities.map((entity) => {
//                             const entityId = entity._id || entity.id || entity.post_id;
//                             const isSelected = selectedIds.includes(entityId);

//                             return (
//                                 <div
//                                     key={entityId}
//                                     className={`border rounded-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
//                                         }`}
//                                     onClick={() => toggleEntitySelection(entity)}
//                                 >
//                                     <div className="relative h-40">
//                                         <img
//                                             src={getEntityImage(entity)}
//                                             alt={getEntityTitle(entity)}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => {
//                                                 e.target.src = '/placeholder-property.jpg';
//                                             }}
//                                         />
//                                         <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-300'
//                                             }`}>
//                                             {isSelected && <Check className="w-4 h-4" />}
//                                         </div>
//                                     </div>

//                                     <div className="p-3">
//                                         <h4 className="font-medium text-gray-800 mb-1 truncate">
//                                             {getEntityTitle(entity)}
//                                         </h4>

//                                         <p className="text-sm text-gray-600 mb-2 truncate">
//                                             {getEntityLocation(entity)}
//                                         </p>

//                                         <div className="flex justify-between items-center">
//                                             <span className="text-sm font-medium text-blue-600">
//                                                 {getEntityPrice(entity)}
//                                             </span>

//                                             {entity.type_name && (
//                                                 <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
//                                                     {entity.type_name}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EntityFilterPanel;

import React, { useState, useEffect } from 'react';
import { Filter, Search, RefreshCw, Check, X, ChevronRight, ChevronDown } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import axios from 'axios';

const EntityFilterPanel = ({ entityType, onSelectEntities, selectedEntities = [], defaultCity = '' }) => {
    // States for dynamic filter fields
    const [filterValues, setFilterValues] = useState({});
    const [schemaData, setSchemaData] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        location: true,
        price: true,
        features: false,
        amenities: false,
        advanced: false
    });

    // States for results and loading
    const [filteredEntities, setFilteredEntities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [schemaLoading, setSchemaLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIds, setSelectedIds] = useState(
        selectedEntities.map(entity => entity._id || entity.id || entity.post_id)
    );

    // Load schema data and initialize filters
    useEffect(() => {
        fetchSchemaData();
    }, [entityType]);

    // Update city if defaultCity changes
    useEffect(() => {
        if (defaultCity && schemaData) {
            setFilterValues(prev => ({ ...prev, city: defaultCity }));
        }
    }, [defaultCity, schemaData]);

    // Fetch schema data for dynamic filters
    const fetchSchemaData = async () => {
        setSchemaLoading(true);
        try {
            let endpoint = '';
            if (entityType === 'properties') {
                endpoint = `${base_url}/getall/properties/keysValues`;
            } else {
                // For other entity types, you can add similar endpoints
                endpoint = `${base_url}/api/list-options/available-cities`;
            }

            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Failed to fetch schema data');

            const data = await response.json();

            if (entityType === 'properties' && data.success) {
                setSchemaData(data.data);
                // Initialize filter values with default city
                setFilterValues({ city: defaultCity || '', limit: '' });
            } else {
                // Fallback for other entity types
                setSchemaData({ city: data.cities || [] });
                setFilterValues({ city: defaultCity || '', limit: '' });
            }
        } catch (error) {
            console.error('Error fetching schema data:', error);
            setError('Failed to load filter options');
        } finally {
            setSchemaLoading(false);
        }
    };

    // Categorize fields for better UI organization
    const categorizeFields = () => {
        if (!schemaData) return {};

        const categories = {
            basic: {
                title: 'Basic Filters',
                fields: ['type_name', 'purpose', 'status', 'category', 'configuration', 'transactionType']
            },
            location: {
                title: 'Location',
                fields: ['city', 'locality', 'region']
            },
            price: {
                title: 'Price & Area',
                fields: ['priceUnit', 'areaUnit']
            },
            property_details: {
                title: 'Property Details',
                fields: ['construction_status', 'possession', 'furnishing', 'furnishStatus', 'facing', 'propertyOwnership', 'flooring', 'parking', 'powerBackup', 'agreement']
            },
            features: {
                title: 'Features & Amenities',
                fields: ['amenities', 'facilities', 'propertyFeatures', 'overlookingAmenities', 'kitchenType', 'bathroomFeatures', 'flooringType']
            },
            location_factors: {
                title: 'Location Factors',
                fields: ['location_advantage', 'locationFactors', 'waterSource', 'religiousNearby', 'inProximity', 'socialInfrastructure']
            },
            investment: {
                title: 'Investment & Legal',
                fields: ['loanApprovalStatus', 'builderReputation', 'legalClearance', 'legalStatuses', 'financingOptions', 'propertyTaxClasses', 'investmentStrategies']
            },
            advanced: {
                title: 'Advanced Options',
                fields: ['tags', 'usp', 'vastuCompliance', 'viewTypes', 'propertyConditions', 'environmentalFactors', 'specialCategories', 'environmentalCertifications', 'propertyManagementServices', 'constructionStatuses', 'ownershipTypes', 'reraStatus', 'broker_status']
            }
        };

        return categories;
    };

    // Handle filter value changes
    const handleFilterChange = (fieldName, value) => {
        setFilterValues(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // Handle array field changes (multi-select)
    const handleArrayFieldChange = (fieldName, value, isChecked) => {
        setFilterValues(prev => {
            const currentValues = prev[fieldName] || [];
            if (isChecked) {
                return {
                    ...prev,
                    [fieldName]: [...currentValues, value]
                };
            } else {
                return {
                    ...prev,
                    [fieldName]: currentValues?.filter(v => v !== value)
                };
            }
        });
    };

    // Render filter input based on field type
    const renderFilterInput = (fieldName, fieldData) => {
        const currentValue = filterValues[fieldName] || '';
        const currentArrayValue = filterValues[fieldName] || [];

        // Handle array fields
        if (Array.isArray(fieldData)) {
            return (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {fieldData.map((option, index) => (
                        <label key={index} className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={currentArrayValue.includes(option)}
                                onChange={(e) => handleArrayFieldChange(fieldName, option, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            );
        }

        // Handle single value fields
        return (
            <select
                value={currentValue}
                onChange={(e) => handleFilterChange(fieldName, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
                <option value="">All {fieldName.replace(/_/g, ' ')}</option>
                {fieldData.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    };

    // Render numeric range inputs
    const renderNumericRangeInputs = () => {
        if (!schemaData?.numeric_ranges) return null;

        const ranges = schemaData.numeric_ranges;
        const numericFields = [
            { key: 'price', label: 'Price', min: ranges.minPrice, max: ranges.maxPrice },
            { key: 'bedrooms', label: 'Bedrooms', min: ranges.minBedrooms, max: ranges.maxBedrooms },
            { key: 'bathrooms', label: 'Bathrooms', min: ranges.minBathrooms, max: ranges.maxBathrooms },
            { key: 'carpetArea', label: 'Carpet Area', min: ranges.minCarpetArea, max: ranges.maxCarpetArea },
            { key: 'superBuiltupArea', label: 'Super Built-up Area', min: ranges.minSuperBuiltupArea, max: ranges.maxSuperBuiltupArea },
            { key: 'propertyAge', label: 'Property Age', min: ranges.minPropertyAge, max: ranges.maxPropertyAge }
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {numericFields.map(field => {
                    if (field.min == null || field.max == null) return null;

                    return (
                        <div key={field.key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder={`Min (${field.min})`}
                                    value={filterValues[`${field.key}Min`] || ''}
                                    onChange={(e) => handleFilterChange(`${field.key}Min`, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder={`Max (${field.max})`}
                                    value={filterValues[`${field.key}Max`] || ''}
                                    onChange={(e) => handleFilterChange(`${field.key}Max`, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Apply filters and fetch entities
    const applyFilters = async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();

            // Add all filter values to params
            Object.entries(filterValues).forEach(([key, value]) => {
                if (value && value !== '') {
                    if (Array.isArray(value)) {
                        // For array values, add multiple params or join them
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value);
                    }
                }
            });

            let endpoint = '';
            if (entityType === 'properties') {
                // Use your existing properties filter endpoint
                endpoint = `${base_url}/api/properties/filter`;
            } else {
                // For other entity types, you can add similar endpoints
                endpoint = `${base_url}/api/list-options/filter-${entityType}`;
            }

            // Fetch filtered entities
            const response = await fetch(`${endpoint}?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${entityType}`);
            }

            const data = await response.json();
            console.log("filtered Data" , data)
            let entities;

            if (entityType === 'properties') {
                entities = data.properties || [];
            }
            // else if (entityType === 'projects') entities = data.projects;
            // else if (entityType === 'buildings') entities = data.buildings;
            else {
                entities = [];
            }

            setFilteredEntities(entities);

        } catch (error) {
            console.error(`Error fetching ${entityType}:`, error);
            setError(`Failed to load ${entityType}`);
            setFilteredEntities([]);
        } finally {
            setLoading(false);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilterValues({ city: defaultCity || '', limit: '' });
    };

    // Toggle section expansion
    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    // Toggle entity selection
    const toggleEntitySelection = (entity) => {
        const entityId = entity._id || entity.id || entity.post_id;
        let newSelectedIds;

        if (selectedIds.includes(entityId)) {
            newSelectedIds = selectedIds.filter(id => id !== entityId);
        } else {
            newSelectedIds = [...selectedIds, entityId];
        }

        setSelectedIds(newSelectedIds);
        const selectedEntities = filteredEntities.filter(entity =>
            newSelectedIds.includes(entity._id || entity.id || entity.post_id)
        );
        onSelectEntities(selectedEntities);
    };

    // Format price
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (numPrice >= 10000000) {
            return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
        } else if (numPrice >= 100000) {
            return `₹${(numPrice / 100000).toFixed(2)} Lac`;
        } else {
            return `₹${numPrice.toLocaleString()}`;
        }
    };

    // Get entity details
    const getEntityImage = (entity) => {
        if (entityType === 'properties') {
            return entity.post_images?.[0]?.url || entity.post_image || '/placeholder-property.jpg';
        }
        return '/placeholder.jpg';
    };

    const getEntityTitle = (entity) => {
        if (entityType === 'properties') {
            return entity.post_title || 'Unnamed Property';
        }
        return 'Unnamed Entity';
    };

    const getEntityPrice = (entity) => {
        if (entityType === 'properties') {
            return formatPrice(entity.price);
        }
        return 'Price not available';
    };

    const getEntityLocation = (entity) => {
        if (entityType === 'properties') {
            return entity.address || entity.locality || entity.city || 'Location not specified';
        }
        return 'Location not specified';
    };

    if (schemaLoading) {
        return (
            <div className="flex justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    const categories = categorizeFields();

    return (
        <div className="space-y-4">
            {/* Dynamic Filter Panel */}
            <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center mb-4">
                    <Filter className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Filter {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h3>
                    {schemaData?.total_properties && (
                        <span className="ml-2 text-sm text-gray-500">({schemaData.total_properties} total)</span>
                    )}
                </div>

                {/* Numeric Range Filters */}
                <div className="mb-6">
                    <div
                        className="flex items-center justify-between cursor-pointer mb-3"
                        onClick={() => toggleSection('price')}
                    >
                        <h4 className="font-medium text-gray-700">Price & Area Ranges</h4>
                        {expandedSections.price ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    {expandedSections.price && (
                        <div className="pl-4 border-l-2 border-blue-100">
                            {renderNumericRangeInputs()}
                        </div>
                    )}
                </div>

                {/* Dynamic Field Categories */}
                {Object.entries(categories).map(([categoryKey, category]) => {
                    const availableFields = category.fields.filter(field => schemaData && schemaData[field]);

                    if (availableFields.length === 0) return null;

                    return (
                        <div key={categoryKey} className="mb-6">
                            <div
                                className="flex items-center justify-between cursor-pointer mb-3"
                                onClick={() => toggleSection(categoryKey)}
                            >
                                <h4 className="font-medium text-gray-700">{category.title}</h4>
                                {expandedSections[categoryKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>

                            {expandedSections[categoryKey] && (
                                <div className="pl-4 border-l-2 border-blue-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {availableFields.map(fieldName => {
                                            const fieldData = schemaData[fieldName];
                                            if (!fieldData || (Array.isArray(fieldData) && fieldData.length === 0)) return null;

                                            return (
                                                <div key={fieldName}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {fieldName.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    {renderFilterInput(fieldName, fieldData)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Limit Results */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Limit Results
                    </label>
                    <select
                        value={filterValues.limit || ''}
                        onChange={(e) => handleFilterChange('limit', e.target.value)}
                        className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Apply Filters
                    </button>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Results Panel */}
            <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <Search className="w-5 h-5 text-blue-500 mr-2" />
                        <h3 className="font-medium text-gray-800">
                            Results ({filteredEntities.length})
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                const allIds = filteredEntities.map(entity => entity._id || entity.id || entity.post_id);
                                setSelectedIds(allIds);
                                onSelectEntities(filteredEntities);
                            }}
                            disabled={filteredEntities.length === 0}
                            className={`text-xs px-2 py-1 rounded ${filteredEntities.length === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            Select All
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedIds([]);
                                onSelectEntities([]);
                            }}
                            disabled={selectedIds.length === 0}
                            className={`text-xs px-2 py-1 rounded ${selectedIds.length === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Selection Status */}
                <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md">
                    <p className="text-sm">
                        {selectedIds.length} {entityType} selected
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="p-4 text-center text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredEntities.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        <p>No {entityType} found. Try adjusting your filters.</p>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && filteredEntities.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredEntities.map((entity) => {
                            const entityId = entity._id || entity.id || entity.post_id;
                            const isSelected = selectedIds.includes(entityId);

                            return (
                                <div
                                    key={entityId}
                                    className={`border rounded-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    onClick={() => toggleEntitySelection(entity)}
                                >
                                    <div className="relative h-40">
                                        <img
                                            src={getEntityImage(entity)}
                                            alt={getEntityTitle(entity)}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-property.jpg';
                                            }}
                                        />
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-300'
                                            }`}>
                                            {isSelected && <Check className="w-4 h-4" />}
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <h4 className="font-medium text-gray-800 mb-1 truncate">
                                            {getEntityTitle(entity)}
                                        </h4>

                                        <p className="text-sm text-gray-600 mb-2 truncate">
                                            {getEntityLocation(entity)}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {getEntityPrice(entity)}
                                            </span>

                                            {entity.type_name && (
                                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                    {entity.type_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntityFilterPanel;