import React, { useState } from 'react';
import { MapPin, Search, XCircle } from 'lucide-react';

const CurrentCitiesList = ({ cities }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter cities based on search query
    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Available Cities
                    <span className="ml-2 bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {cities.length}
                    </span>
                </h2>
            </div>

            <div className="p-5">
                {/* Search and View Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search cities..."
                            className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            List View
                        </button>
                    </div>
                </div>

                {/* Search Summary */}
                {searchQuery && (
                    <div className="text-sm text-gray-500 mb-3">
                        Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} matching "{searchQuery}"
                    </div>
                )}

                {/* Cities Display */}
                {filteredCities.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2">
                            <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No cities found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {cities.length === 0
                                ? "Start by adding some cities to the database."
                                : "Try adjusting your search query."}
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {filteredCities.map((city, index) => (
                            <div
                                key={index}
                                className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm flex items-center justify-center transition-transform hover:-translate-y-1 hover:shadow-md"
                            >
                                <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                                <span className="truncate">{city}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredCities.map((city, index) => (
                            <div
                                key={index}
                                className="flex items-center px-3 py-2 border border-gray-100 rounded-md hover:bg-blue-50 transition-colors"
                            >
                                <MapPin className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                                <span className="text-gray-800">{city}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Empty State Footer */}
            {cities.length === 0 && (
                <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
                    <p className="text-sm text-blue-700">
                        No cities available yet. Add some using the form on the right.
                    </p>
                </div>
            )}

            {/* Pagination for large lists - simplified version */}
            {filteredCities.length > 20 && viewMode === 'list' && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to{' '}
                                <span className="font-medium">20</span> of{' '}
                                <span className="font-medium">{filteredCities.length}</span> cities
                            </p>
                        </div>
                        <div>
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                View All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentCitiesList;