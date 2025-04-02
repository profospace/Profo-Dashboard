import React, { useState, useEffect } from 'react';

const BuildingFilters = ({
    onFilterChange,
    totalBuildings,
    currentFilters = {}
}) => {
    const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || '');
    const [selectedStatus, setSelectedStatus] = useState(currentFilters.status || '');
    const [sortBy, setSortBy] = useState(currentFilters.sortBy || 'newest');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Apply filters when component mounts or when props change
    useEffect(() => {
        if (Object.keys(currentFilters).length > 0) {
            setSearchTerm(currentFilters.searchTerm || '');
            setSelectedStatus(currentFilters.status || '');
            setSortBy(currentFilters.sortBy || 'newest');
        }
    }, [currentFilters]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSortBy('newest');
        onFilterChange({
            searchTerm: '',
            status: '',
            sortBy: 'newest'
        });
    };

    const applyFilters = () => {
        onFilterChange({
            searchTerm,
            status: selectedStatus,
            sortBy
        });
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        // Uncomment this for immediate filtering while typing
        // setTimeout(() => {
        //   applyFilters();
        // }, 500);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setTimeout(() => {
            applyFilters();
        }, 100);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setTimeout(() => {
            applyFilters();
        }, 100);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    Buildings
                    {totalBuildings !== undefined && (
                        <span className="ml-2 text-sm text-gray-500">({totalBuildings})</span>
                    )}
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </button>

                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                    </button>
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="buildingSearch"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search by name, ID, or owner..."
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 text-center flex-shrink-0"
                >
                    Search
                </button>
            </form>

            {isFiltersOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="statusFilter"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="Ready">Ready</option>
                            <option value="Under Construction">Under Construction</option>
                            <option value="Upcoming">Upcoming</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                            <option value="properties_high">Most Properties</option>
                            <option value="properties_low">Least Properties</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildingFilters;