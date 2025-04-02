import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BuildingCard from '../../components/buildings/BuildingCard';
import BuildingFilter from '../../components/buildings/BuildingFilter';
import BuildingPagination from '../../components/buildings/BuildingPagination';

const BuildingsListPage = () => {
    const [buildings, setBuildings] = useState([]);
    const [filteredBuildings, setFilteredBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const buildingsPerPage = 9;

    // Get all buildings on component mount
    useEffect(() => {
        fetchBuildings();
    }, []);

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/buildings`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setBuildings(data);
            setFilteredBuildings(data);

            // Calculate total pages
            setTotalPages(Math.ceil(data.length / buildingsPerPage));

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDeleteBuilding = async (buildingId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/buildings/${buildingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            // Remove the building from the state
            const updatedBuildings = buildings.filter(building => building._id !== buildingId);
            setBuildings(updatedBuildings);

            // Update filtered buildings
            handleFilter({});

            // Recalculate total pages
            setTotalPages(Math.ceil(updatedBuildings.length / buildingsPerPage));

            // Reset to page 1 if current page is now invalid
            if (currentPage > Math.ceil(updatedBuildings.length / buildingsPerPage)) {
                setCurrentPage(1);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFilter = (filters) => {
        let results = [...buildings];

        // Filter by search term (in building ID or name)
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            results = results.filter(building =>
                (building.buildingId && building.buildingId.toLowerCase().includes(searchLower)) ||
                (building.name && building.name.toLowerCase().includes(searchLower))
            );
        }

        // Filter by development status
        if (filters.developmentStatus) {
            results = results.filter(building =>
                building.developmentStatus === filters.developmentStatus
            );
        }

        // Filter by type
        if (filters.type) {
            results = results.filter(building =>
                building.type === filters.type
            );
        }

        // Filter by owner
        if (filters.owner) {
            const ownerLower = filters.owner.toLowerCase();
            results = results.filter(building =>
                building.ownerName && building.ownerName.toLowerCase().includes(ownerLower)
            );
        }

        setFilteredBuildings(results);

        // Reset to page 1 and update total pages
        setCurrentPage(1);
        setTotalPages(Math.ceil(results.length / buildingsPerPage));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get current page buildings
    const indexOfLastBuilding = currentPage * buildingsPerPage;
    const indexOfFirstBuilding = indexOfLastBuilding - buildingsPerPage;
    const currentBuildings = filteredBuildings.slice(indexOfFirstBuilding, indexOfLastBuilding);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
                <Link
                    to="/buildings/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Building
                </Link>
            </div>

            {/* Filter section */}
            <BuildingFilter onFilter={handleFilter} />

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading indicator */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-500">Loading buildings...</span>
                </div>
            ) : (
                <>
                    {/* Buildings grid */}
                    {currentBuildings.length === 0 ? (
                        <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No buildings found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search or filter criteria.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/buildings/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Building
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentBuildings.map(building => (
                                    <BuildingCard
                                        key={building._id}
                                        building={building}
                                        onDelete={handleDeleteBuilding}
                                    />
                                ))}
                            </div>

                            {/* Pagination controls */}
                            <BuildingPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default BuildingsListPage;