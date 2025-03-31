import React, { useState, useEffect } from 'react';
import { Trash2, Search, X, AlertTriangle, Filter, MapPin } from 'lucide-react';

const ManageCitiesSection = ({
    cities,
    citiesToDelete,
    onCityToDelete,
    onRemoveCityToDelete,
    onDeleteCities
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [filteredCities, setFilteredCities] = useState([]);
    const [isDeletionConfirmOpen, setIsDeletionConfirmOpen] = useState(false);

    // Filter and sort cities when dependencies change
    useEffect(() => {
        let results = cities.filter(city =>
            city.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort alphabetically
        results.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.localeCompare(b);
            } else {
                return b.localeCompare(a);
            }
        });

        setFilteredCities(results);
    }, [cities, searchTerm, sortOrder]);

    const clearSearch = () => {
        setSearchTerm('');
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Manage Cities
                </h2>
            </div>

            <div className="p-5">
                {/* Search and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={toggleSortOrder}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <Filter className={`h-4 w-4 mr-2 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                        Sort {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Available Cities Panel */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-md font-medium text-gray-700">Available Cities</h3>
                            <span className="text-xs text-gray-500">{filteredCities.length} cities</span>
                        </div>

                        {filteredCities.length === 0 ? (
                            <div className="py-6 text-center">
                                <p className="text-sm text-gray-500">
                                    {searchTerm ? "No cities match your search." : "No cities available."}
                                </p>
                            </div>
                        ) : (
                            <div className="h-48 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-1.5">
                                    {filteredCities.map((city, index) => (
                                        <div
                                            key={index}
                                            onClick={() => onCityToDelete(city)}
                                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${citiesToDelete.includes(city)
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-white text-gray-700 hover:bg-red-50'
                                                }`}
                                        >
                                            <MapPin className={`h-4 w-4 mr-2 ${citiesToDelete.includes(city) ? 'text-red-600' : 'text-gray-400'
                                                }`} />
                                            {city}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchTerm && filteredCities.length > 0 && (
                            <div className="mt-3 text-xs text-gray-500">
                                Click on a city to mark it for deletion
                            </div>
                        )}
                    </div>

                    {/* Cities to Delete Panel */}
                    <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-md font-medium text-red-700">Cities to Delete</h3>
                            {citiesToDelete.length > 0 && (
                                <span className="bg-red-100 text-red-800 text-xs font-medium py-0.5 px-2 rounded-full">
                                    {citiesToDelete.length}
                                </span>
                            )}
                        </div>

                        {citiesToDelete.length === 0 ? (
                            <div className="py-6 text-center">
                                <p className="text-sm text-red-500">
                                    No cities marked for deletion.
                                </p>
                            </div>
                        ) : (
                            <div className="h-48 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="space-y-1.5">
                                    {citiesToDelete.map((city, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-white px-3 py-2 rounded-md text-red-800 group"
                                        >
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 text-red-600 mr-2" />
                                                {city}
                                            </div>
                                            <button
                                                onClick={() => onRemoveCityToDelete(city)}
                                                className="text-red-400 hover:text-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delete Button and Confirmation */}
                        <div className="mt-4">
                            {!isDeletionConfirmOpen ? (
                                <button
                                    onClick={() => citiesToDelete.length > 0 && setIsDeletionConfirmOpen(true)}
                                    className={`w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium rounded-md shadow-sm transition-colors ${citiesToDelete.length === 0
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                        }`}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete {citiesToDelete.length} {citiesToDelete.length === 1 ? 'City' : 'Cities'}
                                </button>
                            ) : (
                                <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm text-red-800 font-medium">Are you sure?</h3>
                                            <div className="mt-1 text-sm text-red-700">
                                                <p>This will permanently delete {citiesToDelete.length} {citiesToDelete.length === 1 ? 'city' : 'cities'} from the database.</p>
                                            </div>
                                            <div className="mt-3 flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={onDeleteCities}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    Yes, Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDeletionConfirmOpen(false)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-4 text-xs text-gray-500">
                    <p>Click on a city in the left panel to mark it for deletion, then confirm your changes with the delete button.</p>
                </div>
            </div>
        </div>
    );
};

export default ManageCitiesSection;