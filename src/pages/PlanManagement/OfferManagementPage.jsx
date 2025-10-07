// import React,{ useState, useEffect } from 'react';
// import { Search, Filter, X, CheckCircle2, Building2, Bed, Home } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';

// const OfferManagementPage = () => {
//     const [offers, setOffers] = useState([]);
//     const [properties, setProperties] = useState([]);
//     const [filteredProperties, setFilteredProperties] = useState([]);
//     const [selectedOffer, setSelectedOffer] = useState(null);
//     const [selectedProperties, setSelectedProperties] = useState(new Set());
//     const [loading, setLoading] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');

//     // Filter states
//     const [filters, setFilters] = useState({
//         bedrooms: '',
//         floor: '',
//         builder: '',
//         city: '',
//         minPrice: '',
//         maxPrice: '',
//         furnishing: '',
//         searchTerm: ''
//     });

//     const [builders, setBuilders] = useState([]);
//     const [showFilters, setShowFilters] = useState(true);

//     // Fetch offers
//     useEffect(() => {
//         fetchOffers();
//         fetchProperties();
//         fetchBuilders();
//     }, []);

//     // Apply filters whenever they change
//     useEffect(() => {
//         applyFilters();
//     }, [filters, properties]);

//     // const fetchOffers = async () => {
//     //     try {
//     //         // Replace with your actual API endpoint
//     //         const response = await fetch('/api/offers/admin/all', {
//     //             headers: {
//     //                 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//     //             }
//     //         });
//     //         const data = await response.json();
//     //         if (data.success) {
//     //             setOffers(data.data.offers || []);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching offers:', error);
//     //     }
//     // };

//     const fetchOffers = async () => {
//         try {
//             const response = await axios.get(`${base_url}/api/offers/admin/all`, getAuthConfig());

//             if (response.data.success) {
//                 setOffers(response.data.data.offers || []);
//             }
//         } catch (error) {
//             console.error('Error fetching offers:', error);
//         }
//     };

//     const fetchProperties = async () => {
//         try {
//             setLoading(true);
//             // Replace with your actual API endpoint
//             const response = await fetch(`${base_url}/api/properties/admin/all`, getAuthConfig() );
//             const data = await response.json();
//             if (data.success) {
//                 setProperties(data.data.properties || []);
//                 setFilteredProperties(data.data.properties || []);
//             }
//         } catch (error) {
//             console.error('Error fetching properties:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchBuilders = async () => {
//         try {
//             const response = await fetch(`${base_url}/api/builders/all`, getAuthConfig());
//             const data = await response.json();
//             if (data.success) {
//                 setBuilders(data.data.builders || []);
//             }
//         } catch (error) {
//             console.error('Error fetching builders:', error);
//         }
//     };

//     const applyFilters = () => {
//         let filtered = [...properties];

//         // Bedrooms filter
//         if (filters.bedrooms) {
//             filtered = filtered.filter(p => p.bedrooms === parseInt(filters.bedrooms));
//         }

//         // Floor filter
//         if (filters.floor) {
//             filtered = filtered.filter(p => p.floor === parseInt(filters.floor));
//         }

//         // Builder filter
//         if (filters.builder) {
//             filtered = filtered.filter(p =>
//                 p.builder?._id === filters.builder || p.builder === filters.builder
//             );
//         }

//         // City filter
//         if (filters.city) {
//             filtered = filtered.filter(p =>
//                 p.city?.toLowerCase().includes(filters.city.toLowerCase())
//             );
//         }

//         // Price range filter
//         if (filters.minPrice) {
//             filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
//         }
//         if (filters.maxPrice) {
//             filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
//         }

//         // Furnishing filter
//         if (filters.furnishing) {
//             filtered = filtered.filter(p => p.furnishing === filters.furnishing);
//         }

//         // Search term filter
//         if (filters.searchTerm) {
//             const searchLower = filters.searchTerm.toLowerCase();
//             filtered = filtered.filter(p =>
//                 p.title?.toLowerCase().includes(searchLower) ||
//                 p.post_title?.toLowerCase().includes(searchLower) ||
//                 p.address?.toLowerCase().includes(searchLower)
//             );
//         }

//         setFilteredProperties(filtered);
//     };

//     const handleFilterChange = (key, value) => {
//         setFilters(prev => ({ ...prev, [key]: value }));
//     };

//     const clearFilters = () => {
//         setFilters({
//             bedrooms: '',
//             floor: '',
//             builder: '',
//             city: '',
//             minPrice: '',
//             maxPrice: '',
//             furnishing: '',
//             searchTerm: ''
//         });
//     };

//     const togglePropertySelection = (propertyId) => {
//         const newSelected = new Set(selectedProperties);
//         if (newSelected.has(propertyId)) {
//             newSelected.delete(propertyId);
//         } else {
//             newSelected.add(propertyId);
//         }
//         setSelectedProperties(newSelected);
//     };

//     const selectAllProperties = () => {
//         if (selectedProperties.size === filteredProperties.length) {
//             setSelectedProperties(new Set());
//         } else {
//             setSelectedProperties(new Set(filteredProperties.map(p => p._id)));
//         }
//     };

//     const applyOfferToProperties = async () => {
//         if (!selectedOffer) {
//             alert('Please select an offer first');
//             return;
//         }

//         if (selectedProperties.size === 0) {
//             alert('Please select at least one property');
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await fetch('/api/offers/admin/apply-to-properties', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//                 },
//                 body: JSON.stringify({
//                     offerId: selectedOffer,
//                     propertyIds: Array.from(selectedProperties)
//                 })
//             });

//             const data = await response.json();
//             if (data.success) {
//                 setSuccessMessage(`Offer applied to ${selectedProperties.size} properties successfully!`);
//                 setSelectedProperties(new Set());
//                 fetchProperties(); // Refresh properties to show updated offers
//                 setTimeout(() => setSuccessMessage(''), 3000);
//             } else {
//                 alert(data.message || 'Failed to apply offer');
//             }
//         } catch (error) {
//             console.error('Error applying offer:', error);
//             alert('Error applying offer to properties');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatPrice = (price) => {
//         if (!price) return 'N/A';
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(price);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                     <h1 className="text-2xl font-bold text-gray-900">Admin Offer Management</h1>
//                     <p className="text-sm text-gray-600 mt-1">Apply offers to properties based on filters</p>
//                 </div>
//             </div>

//             {/* Success Message */}
//             {successMessage && (
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
//                         <CheckCircle2 className="w-5 h-5 text-green-600" />
//                         <span className="text-green-800">{successMessage}</span>
//                     </div>
//                 </div>
//             )}

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                     {/* Sidebar - Filters and Offer Selection */}
//                     <div className="lg:col-span-1">
//                         {/* Offer Selection */}
//                         <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
//                             <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Offer</h2>
//                             <select
//                                 value={selectedOffer || ''}
//                                 onChange={(e) => setSelectedOffer(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="">Choose an offer...</option>
//                                 {offers.map(offer => (
//                                     <option key={offer._id} value={offer._id}>
//                                         {offer.title} - {offer.discountValue}{offer.discountType === 'PERCENTAGE' ? '%' : '₹'} off
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Filters */}
//                         <div className="bg-white rounded-lg shadow-sm p-4">
//                             <div className="flex items-center justify-between mb-3">
//                                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                                     <Filter className="w-5 h-5" />
//                                     Filters
//                                 </h2>
//                                 <button
//                                     onClick={clearFilters}
//                                     className="text-sm text-blue-600 hover:text-blue-800"
//                                 >
//                                     Clear All
//                                 </button>
//                             </div>

//                             <div className="space-y-3">
//                                 {/* Search */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Search
//                                     </label>
//                                     <div className="relative">
//                                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Search properties..."
//                                             value={filters.searchTerm}
//                                             onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//                                             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Bedrooms */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Bedrooms (BHK)
//                                     </label>
//                                     <select
//                                         value={filters.bedrooms}
//                                         onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                     >
//                                         <option value="">All</option>
//                                         <option value="1">1 BHK</option>
//                                         <option value="2">2 BHK</option>
//                                         <option value="3">3 BHK</option>
//                                         <option value="4">4 BHK</option>
//                                         <option value="5">5+ BHK</option>
//                                     </select>
//                                 </div>

//                                 {/* Floor */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Floor
//                                     </label>
//                                     <input
//                                         type="number"
//                                         placeholder="e.g., 5"
//                                         value={filters.floor}
//                                         onChange={(e) => handleFilterChange('floor', e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                     />
//                                 </div>

//                                 {/* Builder */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Builder
//                                     </label>
//                                     <select
//                                         value={filters.builder}
//                                         onChange={(e) => handleFilterChange('builder', e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                     >
//                                         <option value="">All Builders</option>
//                                         {builders.map(builder => (
//                                             <option key={builder._id} value={builder._id}>
//                                                 {builder.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 {/* City */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         City
//                                     </label>
//                                     <input
//                                         type="text"
//                                         placeholder="e.g., Mumbai"
//                                         value={filters.city}
//                                         onChange={(e) => handleFilterChange('city', e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                     />
//                                 </div>

//                                 {/* Price Range */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Price Range
//                                     </label>
//                                     <div className="grid grid-cols-2 gap-2">
//                                         <input
//                                             type="number"
//                                             placeholder="Min"
//                                             value={filters.minPrice}
//                                             onChange={(e) => handleFilterChange('minPrice', e.target.value)}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                         />
//                                         <input
//                                             type="number"
//                                             placeholder="Max"
//                                             value={filters.maxPrice}
//                                             onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Furnishing */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Furnishing
//                                     </label>
//                                     <select
//                                         value={filters.furnishing}
//                                         onChange={(e) => handleFilterChange('furnishing', e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                     >
//                                         <option value="">All</option>
//                                         <option value="Fully Furnished">Fully Furnished</option>
//                                         <option value="Semi Furnished">Semi Furnished</option>
//                                         <option value="Unfurnished">Unfurnished</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content - Property Grid */}
//                     <div className="lg:col-span-3">
//                         {/* Action Bar */}
//                         <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
//                             <div className="flex items-center justify-between flex-wrap gap-3">
//                                 <div className="flex items-center gap-4">
//                                     <span className="text-sm text-gray-600">
//                                         {filteredProperties.length} properties found
//                                     </span>
//                                     <span className="text-sm font-medium text-blue-600">
//                                         {selectedProperties.size} selected
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <button
//                                         onClick={selectAllProperties}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                                     >
//                                         {selectedProperties.size === filteredProperties.length ? 'Deselect All' : 'Select All'}
//                                     </button>
//                                     <button
//                                         onClick={applyOfferToProperties}
//                                         disabled={!selectedOffer || selectedProperties.size === 0 || loading}
//                                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
//                                     >
//                                         {loading ? 'Applying...' : 'Apply Offer'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Properties Grid */}
//                         {loading ? (
//                             <div className="flex items-center justify-center h-64">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                             </div>
//                         ) : filteredProperties.length === 0 ? (
//                             <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//                                 <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                                 <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
//                                 <p className="text-gray-600">Try adjusting your filters</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {filteredProperties.map(property => (
//                                     <PropertyCard
//                                         key={property._id}
//                                         property={property}
//                                         isSelected={selectedProperties.has(property._id)}
//                                         onToggle={() => togglePropertySelection(property._id)}
//                                         formatPrice={formatPrice}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const PropertyCard = ({ property, isSelected, onToggle, formatPrice }) => {
//     const imageUrl = property.post_images?.[0]?.url ||
//         property.post_image ||
//         'https://via.placeholder.com/400x250?text=No+Image';

//     return (
//         <div
//             onClick={onToggle}
//             className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''
//                 }`}
//         >
//             {/* Image */}
//             <div className="relative h-48 bg-gray-200">
//                 <img
//                     src={imageUrl}
//                     alt={property.title || property.post_title}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
//                     }}
//                 />
//                 {isSelected && (
//                     <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
//                         <CheckCircle2 className="w-5 h-5" />
//                     </div>
//                 )}
//                 {property.profoOffers?.length > 0 && (
//                     <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
//                         {property.profoOffers.length} Offer{property.profoOffers.length > 1 ? 's' : ''} Applied
//                     </div>
//                 )}
//             </div>

//             {/* Content */}
//             <div className="p-4">
//                 <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
//                     {property.title || property.post_title || 'Untitled Property'}
//                 </h3>

//                 <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//                     {property.bedrooms && (
//                         <div className="flex items-center gap-1">
//                             <Bed className="w-4 h-4" />
//                             <span>{property.bedrooms} BHK</span>
//                         </div>
//                     )}
//                     {property.floor && (
//                         <div className="flex items-center gap-1">
//                             <Building2 className="w-4 h-4" />
//                             <span>Floor {property.floor}</span>
//                         </div>
//                     )}
//                 </div>

//                 {property.address && (
//                     <p className="text-sm text-gray-600 mb-2 line-clamp-1">
//                         {property.address}
//                     </p>
//                 )}

//                 {property.city && (
//                     <p className="text-xs text-gray-500 mb-2">
//                         {property.city}
//                     </p>
//                 )}

//                 <div className="flex items-center justify-between mt-3 pt-3 border-t">
//                     <span className="text-lg font-bold text-gray-900">
//                         {formatPrice(property.price)}
//                     </span>
//                     {property.builder?.name && (
//                         <span className="text-xs text-gray-500">
//                             {property.builder.name}
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OfferManagementPage;



import React, { useState, useEffect } from 'react';
import { Search, Filter, X, CheckCircle2, Building2, Bed, Home, Plus, Edit, Tag } from 'lucide-react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import CreateOfferModal from '../../components/Offer/CreateOfferModal';
import MaxOffersModal from '../../components/Offer/MaxOffersModal';

const OfferManagementPage = () => {
    const [offers, setOffers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedProperties, setSelectedProperties] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMaxOffersModal, setShowMaxOffersModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        bedrooms: '',
        floor: '',
        builder: '',
        city: '',
        minPrice: '',
        maxPrice: '',
        furnishing: '',
        searchTerm: ''
    });

    const [builders, setBuilders] = useState([]);
    const [showFilters, setShowFilters] = useState(true);

    // Fetch offers
    useEffect(() => {
        fetchOffers();
        fetchProperties();
        fetchBuilders();
    }, []);

    // Apply filters whenever they change
    useEffect(() => {
        applyFilters();
    }, [filters, properties]);

    const fetchOffers = async () => {
        try {
            const response = await axios.get(`${base_url}/api/offers/admin/all`, getAuthConfig());

            if (response.data.success) {
                setOffers(response.data.data.offers || []);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/api/properties/admin/all`, getAuthConfig());

            if (response.data.success) {
                setProperties(response.data.data.properties || []);
                setFilteredProperties(response.data.data.properties || []);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBuilders = async () => {
        try {
            const response = await axios.get(`${base_url}/api/builders/all`, getAuthConfig());

            if (response.data.success) {
                setBuilders(response.data.data.builders || []);
            }
        } catch (error) {
            console.error('Error fetching builders:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...properties];

        // Bedrooms filter
        if (filters.bedrooms) {
            filtered = filtered.filter(p => p.bedrooms === parseInt(filters.bedrooms));
        }

        // Floor filter
        if (filters.floor) {
            filtered = filtered.filter(p => p.floor === parseInt(filters.floor));
        }

        // Builder filter
        if (filters.builder) {
            filtered = filtered.filter(p =>
                p.builder?._id === filters.builder || p.builder === filters.builder
            );
        }

        // City filter
        if (filters.city) {
            filtered = filtered.filter(p =>
                p.city?.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        // Price range filter
        if (filters.minPrice) {
            filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
        }

        // Furnishing filter
        if (filters.furnishing) {
            filtered = filtered.filter(p => p.furnishing === filters.furnishing);
        }

        // Search term filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.title?.toLowerCase().includes(searchLower) ||
                p.post_title?.toLowerCase().includes(searchLower) ||
                p.address?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProperties(filtered);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            bedrooms: '',
            floor: '',
            builder: '',
            city: '',
            minPrice: '',
            maxPrice: '',
            furnishing: '',
            searchTerm: ''
        });
    };

    const togglePropertySelection = (propertyId) => {
        const newSelected = new Set(selectedProperties);
        if (newSelected.has(propertyId)) {
            newSelected.delete(propertyId);
        } else {
            newSelected.add(propertyId);
        }
        setSelectedProperties(newSelected);
    };

    const selectAllProperties = () => {
        if (selectedProperties.size === filteredProperties.length) {
            setSelectedProperties(new Set());
        } else {
            setSelectedProperties(new Set(filteredProperties.map(p => p._id)));
        }
    };

    const applyOfferToProperties = async () => {
        if (!selectedOffer) {
            alert('Please select an offer first');
            return;
        }

        if (selectedProperties.size === 0) {
            alert('Please select at least one property');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${base_url}/api/offers/admin/apply-to-properties`,
                {
                    offerId: selectedOffer,
                    propertyIds: Array.from(selectedProperties)
                },
                getAuthConfig()
            );

            if (response.data.success) {
                setSuccessMessage(`Offer applied to ${selectedProperties.size} properties successfully!`);
                setSelectedProperties(new Set());
                fetchProperties();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                alert(response.data.message || 'Failed to apply offer');
            }
        } catch (error) {
            console.error('Error applying offer:', error);
            alert('Error applying offer to properties');
        } finally {
            setLoading(false);
        }
    };

    const handleOfferCreated = () => {
        fetchOffers();
        setShowCreateModal(false);
        setSuccessMessage('Offer created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleMaxOffersUpdated = () => {
        fetchProperties();
        setShowMaxOffersModal(false);
        setSelectedProperties(new Set());
        setSuccessMessage('Max offers updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Offer Management</h1>
                            <p className="text-sm text-gray-600 mt-1">Create and apply offers to properties based on filters</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Offer
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-800">{successMessage}</span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Filters and Offer Selection */}
                    <div className="lg:col-span-1">
                        {/* Offer Selection */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Offer</h2>
                            <select
                                value={selectedOffer || ''}
                                onChange={(e) => setSelectedOffer(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Choose an offer...</option>
                                {offers.map(offer => (
                                    <option key={offer._id} value={offer._id}>
                                        {offer.title} - {offer.discountValue}{offer.discountType === 'PERCENTAGE' ? '%' : '₹'} off
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search properties..."
                                            value={filters.searchTerm}
                                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms (BHK)
                                    </label>
                                    <select
                                        value={filters.bedrooms}
                                        onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="1">1 BHK</option>
                                        <option value="2">2 BHK</option>
                                        <option value="3">3 BHK</option>
                                        <option value="4">4 BHK</option>
                                        <option value="5">5+ BHK</option>
                                    </select>
                                </div>

                                {/* Floor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Floor
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 5"
                                        value={filters.floor}
                                        onChange={(e) => handleFilterChange('floor', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                {/* Builder */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Builder
                                    </label>
                                    <select
                                        value={filters.builder}
                                        onChange={(e) => handleFilterChange('builder', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="">All Builders</option>
                                        {builders.map(builder => (
                                            <option key={builder._id} value={builder._id}>
                                                {builder.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Mumbai"
                                        value={filters.city}
                                        onChange={(e) => handleFilterChange('city', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Furnishing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Furnishing
                                    </label>
                                    <select
                                        value={filters.furnishing}
                                        onChange={(e) => handleFilterChange('furnishing', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="Fully Furnished">Fully Furnished</option>
                                        <option value="Semi Furnished">Semi Furnished</option>
                                        <option value="Unfurnished">Unfurnished</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Property Grid */}
                    <div className="lg:col-span-3">
                        {/* Action Bar */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {filteredProperties.length} properties found
                                    </span>
                                    <span className="text-sm font-medium text-blue-600">
                                        {selectedProperties.size} selected
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={selectAllProperties}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        {selectedProperties.size === filteredProperties.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                    <button
                                        onClick={() => setShowMaxOffersModal(true)}
                                        disabled={selectedProperties.size === 0}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors"
                                    >
                                        <Tag className="w-4 h-4" />
                                        Set Max Offers
                                    </button>
                                    <button
                                        onClick={applyOfferToProperties}
                                        disabled={!selectedOffer || selectedProperties.size === 0 || loading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                                    >
                                        {loading ? 'Applying...' : 'Apply Offer'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Properties Grid */}
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredProperties.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                                <p className="text-gray-600">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProperties.map(property => (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        isSelected={selectedProperties.has(property._id)}
                                        onToggle={() => togglePropertySelection(property._id)}
                                        formatPrice={formatPrice}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateOfferModal
                    onClose={() => setShowCreateModal(false)}
                    onOfferCreated={handleOfferCreated}
                />
            )}

            {showMaxOffersModal && (
                <MaxOffersModal
                    selectedProperties={Array.from(selectedProperties)}
                    properties={properties}
                    onClose={() => setShowMaxOffersModal(false)}
                    onUpdate={handleMaxOffersUpdated}
                />
            )}
        </div>
    );
};

const PropertyCard = ({ property, isSelected, onToggle, formatPrice }) => {
    const imageUrl = property.post_images?.[0]?.url ||
        property.post_image ||
        'https://via.placeholder.com/400x250?text=No+Image';

    const activeOffersCount = property.profoOffers?.filter(o => o.isActive).length || 0;
    const maxOffersAvail = property.maxProfoOfferAvail || 0;

    return (
        <div
            onClick={onToggle}
            className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
                <img
                    src={imageUrl}
                    alt={property.title || property.post_title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                    }}
                />
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                )}
                {activeOffersCount > 0 && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {activeOffersCount} Offer{activeOffersCount > 1 ? 's' : ''} Applied
                    </div>
                )}
                {maxOffersAvail > 0 && (
                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Max {maxOffersAvail} can be availed
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {property.title || property.post_title || 'Untitled Property'}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {property.bedrooms && (
                        <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms} BHK</span>
                        </div>
                    )}
                    {property.floor && (
                        <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>Floor {property.floor}</span>
                        </div>
                    )}
                </div>

                {property.address && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {property.address}
                    </p>
                )}

                {property.city && (
                    <p className="text-xs text-gray-500 mb-2">
                        {property.city}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(property.price)}
                    </span>
                    {property.builder?.name && (
                        <span className="text-xs text-gray-500">
                            {property.builder.name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfferManagementPage;




