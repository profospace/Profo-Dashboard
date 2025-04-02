import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BuildingCard from '../../components/Building/BuildingCard';
import BuildingFilters from '../../components/Building/BuildingFilters';
import { getBuildings, deleteBuilding } from '../../../utils/Building/api';

const AllBuildingsPage = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBuildings, setTotalBuildings] = useState(0);
    const [filters, setFilters] = useState({
        searchTerm: '',
        status: '',
        sortBy: 'newest'
    });

    // Fetch buildings on component mount and when filters/page change
    useEffect(() => {
        fetchBuildings();
    }, [currentPage, filters]);

    const fetchBuildings = async () => {
        setLoading(true);
        try {
            const response = await getBuildings({
                ...filters,
                page: currentPage,
                limit: 12
            });

            setBuildings(response.buildings || response);

            // Handle pagination if the API returns it
            if (response.pagination) {
                setTotalPages(response.pagination.totalPages || 1);
                setTotalBuildings(response.pagination.total || response.buildings.length);
            } else {
                setTotalPages(1);
                setTotalBuildings(response.length);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching buildings:', err);
            setError('Failed to load buildings. Please try again.');
            setBuildings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleDeleteBuilding = async (buildingId) => {
        try {
            await deleteBuilding(buildingId);

            // Remove the deleted building from the list
            setBuildings(buildings.filter(building => building._id !== buildingId));

            // Decrease total count
            setTotalBuildings(prev => prev - 1);

            // Show success message
            alert('Building deleted successfully');
        } catch (error) {
            console.error('Error deleting building:', error);
            alert('Failed to delete building');
        }
    };

    const goToPage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Generate pagination buttons
    const renderPagination = () => {
        const pages = [];

        // Always show first page
        pages.push(
            <button
                key="first"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-500'
                    }`}
            >
                1
            </button>
        );

        // Show ellipsis if needed
        if (currentPage > 3) {
            pages.push(
                <span key="ellipsis1" className="px-2 py-1">
                    ...
                </span>
            );
        }

        // Show pages around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded-md ${currentPage === i
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-white hover:bg-gray-50 text-gray-500'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            pages.push(
                <span key="ellipsis2" className="px-2 py-1">
                    ...
                </span>
            );
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(
                <button
                    key="last"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${currentPage === totalPages
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-white hover:bg-gray-50 text-gray-500'
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Buildings</h1>

                <Link
                    to="/buildings/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Building
                </Link>
            </div>

            <BuildingFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
                totalBuildings={totalBuildings}
            />

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            ) : buildings.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No buildings found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new building.</p>
                    <div className="mt-6">
                        <Link
                            to="/buildings/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Building
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {buildings.map(building => (
                            <BuildingCard
                                key={building._id || building.buildingId}
                                building={building}
                                onDelete={() => handleDeleteBuilding(building.buildingId)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {renderPagination()}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllBuildingsPage;