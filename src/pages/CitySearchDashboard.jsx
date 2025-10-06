import React,{ useState, useEffect } from 'react';
import { base_url } from '../../utils/base_url';

const API_URL = `${base_url}/api/city-search`;

export default function CitySearchDashboard() {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [propertySearch, setPropertySearch] = useState('');
    const [availableProperties, setAvailableProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddCity, setShowAddCity] = useState(false);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);

    const [newCity, setNewCity] = useState({
        city: '',
        displayName: '',
        description: ''
    });

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (showAddProperty) {
            searchProperties();
        }
    }, [propertySearch, showAddProperty]);

    const fetchCities = async () => {
        try {
            const response = await fetch(`${API_URL}/configs`);
            const data = await response.json();
            if (data.success) {
                setCities(data.data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const searchProperties = async () => {
        try {
            setLoading(true);
            const city = selectedCity?.city || '';
            const response = await fetch(
                `${API_URL}/properties/search?query=${propertySearch}&city=${city}&limit=50`
            );
            const data = await response.json();
            if (data.success) {
                setAvailableProperties(data.data);
            }
        } catch (error) {
            console.error('Error searching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const createCity = async () => {
        try {
            const response = await fetch(`${API_URL}/configs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCity)
            });
            const data = await response.json();
            if (data.success) {
                fetchCities();
                setShowAddCity(false);
                setNewCity({ city: '', displayName: '', description: '' });
            }
        } catch (error) {
            console.error('Error creating city:', error);
        }
    };

    const addPropertyToCity = async (propertyId) => {
        try {
            const response = await fetch(
                `${API_URL}/configs/${selectedCity.city}/properties`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId })
                }
            );
            const data = await response.json();
            if (data.success) {
                setSelectedCity(data.data);
                setCities(cities.map(c =>
                    c.city === data.data.city ? data.data : c
                ));
            }
        } catch (error) {
            console.error('Error adding property:', error);
        }
    };

    const removeProperty = async (propertyId) => {
        try {
            const response = await fetch(
                `${API_URL}/configs/${selectedCity.city}/properties/${propertyId}`,
                { method: 'DELETE' }
            );
            const data = await response.json();
            if (data.success) {
                setSelectedCity(data.data);
                setCities(cities.map(c =>
                    c.city === data.data.city ? data.data : c
                ));
            }
        } catch (error) {
            console.error('Error removing property:', error);
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();

        if (draggedItem === null || draggedItem === dropIndex) return;

        const items = [...selectedCity.properties];
        const draggedProperty = items[draggedItem];
        items.splice(draggedItem, 1);
        items.splice(dropIndex, 0, draggedProperty);

        const propertyIds = items.map(p => p.propertyId._id);

        try {
            const response = await fetch(
                `${API_URL}/configs/${selectedCity.city}/properties/reorder`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyIds })
                }
            );
            const data = await response.json();
            if (data.success) {
                setSelectedCity(data.data);
                setCities(cities.map(c =>
                    c.city === data.data.city ? data.data : c
                ));
            }
        } catch (error) {
            console.error('Error reordering properties:', error);
        }

        setDraggedItem(null);
    };

    const toggleCityStatus = async (city, isActive) => {
        try {
            const response = await fetch(`${API_URL}/configs/${city}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive })
            });
            const data = await response.json();
            if (data.success) {
                fetchCities();
                if (selectedCity?.city === city) {
                    setSelectedCity(data.data);
                }
            }
        } catch (error) {
            console.error('Error updating city:', error);
        }
    };

    const filteredCities = cities.filter(city =>
        city.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                City Search Configuration
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage property search results by city
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddCity(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Add City
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Cities ({filteredCities.length})
                            </h2>
                            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                                {filteredCities.map((city) => (
                                    <div
                                        key={city._id}
                                        onClick={() => setSelectedCity(city)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCity?.city === city.city
                                                ? 'bg-blue-50 border-2 border-blue-500'
                                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {city.displayName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {city.properties.length} properties
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCityStatus(city.city, !city.isActive);
                                                }}
                                                className={`px-2 py-1 rounded text-xs font-medium ${city.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {city.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-8">
                        {selectedCity ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {selectedCity.displayName}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {selectedCity.description || 'No description'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddProperty(true)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        + Add Property
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
                                    {selectedCity.properties
                                        .sort((a, b) => a.displayOrder - b.displayOrder)
                                        .map((prop, index) => {
                                            const property = prop.propertyId;
                                            if (!property) return null;

                                            return (
                                                <div
                                                    key={property._id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, index)}
                                                    className={`p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-move transition-all ${draggedItem === index ? 'opacity-50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                                                            {index + 1}
                                                        </div>

                                                        {property.post_images?.[0]?.url && (
                                                            <img
                                                                src={property.post_images[0].url}
                                                                alt={property.post_title}
                                                                className="w-24 h-24 object-cover rounded-lg"
                                                            />
                                                        )}

                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-900">
                                                                {property.post_title}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {property.address || property.locality}
                                                            </div>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                                <span>{property.bedrooms} BHK</span>
                                                                <span>₹{property.price?.toLocaleString()}</span>
                                                                <span>{property.type_name}</span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => removeProperty(property._id)}
                                                            className="text-red-600 hover:text-red-700 p-2"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    {selectedCity.properties.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            No properties added yet. Click "Add Property" to get started.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Select a City
                                </h3>
                                <p className="text-gray-600">
                                    Choose a city from the list to manage its property configuration
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAddCity && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Add New City
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City Code
                                </label>
                                <input
                                    type="text"
                                    value={newCity.city}
                                    onChange={(e) => setNewCity({ ...newCity, city: e.target.value.toLowerCase() })}
                                    placeholder="e.g., mumbai"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={newCity.displayName}
                                    onChange={(e) => setNewCity({ ...newCity, displayName: e.target.value })}
                                    placeholder="e.g., Mumbai"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newCity.description}
                                    onChange={(e) => setNewCity({ ...newCity, description: e.target.value })}
                                    placeholder="Optional description"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddCity(false);
                                    setNewCity({ city: '', displayName: '', description: '' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createCity}
                                disabled={!newCity.city || !newCity.displayName}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Create City
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Add Property to {selectedCity?.displayName}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddProperty(false);
                                    setPropertySearch('');
                                    setAvailableProperties([]);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <input
                            type="text"
                            value={propertySearch}
                            onChange={(e) => setPropertySearch(e.target.value)}
                            placeholder="Search properties by title, address, or ID..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                        />

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading properties...</p>
                                </div>
                            ) : availableProperties.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {propertySearch ? 'No properties found' : 'Start typing to search properties'}
                                </div>
                            ) : (
                                availableProperties.map((property) => {
                                    const isAdded = selectedCity?.properties.some(
                                        p => p.propertyId?._id === property._id
                                    );

                                    return (
                                        <div
                                            key={property._id}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                {property.post_images?.[0]?.url && (
                                                    <img
                                                        src={property.post_images[0].url}
                                                        alt={property.post_title}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                )}

                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">
                                                        {property.post_title}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {property.address || property.locality}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <span>{property.bedrooms} BHK</span>
                                                        <span>₹{property.price?.toLocaleString()}</span>
                                                        <span>{property.type_name}</span>
                                                        {property.verified && (
                                                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        addPropertyToCity(property._id);
                                                        setShowAddProperty(false);
                                                        setPropertySearch('');
                                                        setAvailableProperties([]);
                                                    }}
                                                    disabled={isAdded}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isAdded
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                        }`}
                                                >
                                                    {isAdded ? 'Added' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}