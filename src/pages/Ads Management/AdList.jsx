import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const AdList = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        city: '',
        pincode: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    // Fetch ads with pagination and filters
    // const fetchAds = async () => {
    //     try {
    //         setLoading(true);

    //         // Build query parameters
    //         const params = new URLSearchParams();
    //         params.append('page', currentPage);
    //         params.append('limit', 10);

    //         // Add any active filters
    //         Object.entries(filters).forEach(([key, value]) => {
    //             if (value) params.append(key, value);
    //         });

    //         const response = await axios.get(`${base_url}/ads/view-ads?${params.toString()}`);

    //         setAds(response.data.data);
    //         setTotalPages(response.data.totalPages);
    //         setLoading(false);
    //     } catch (err) {
    //         setError('Failed to fetch ads');
    //         setLoading(false);
    //     }
    // };

    // Update fetchAds function in AdList.jsx
    const fetchAds = async () => {
        try {
            setLoading(true);

            // Build query parameters
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', 10);

            // Add any active filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await axios.get(`${base_url}/api/ads?${params.toString()}`);
            console.log("response", response)

            // Update the data extraction to match the new response format
            setAds(response.data.data);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch ads');
            setLoading(false);
        }
    };

    // Fetch ads when component mounts or when filters/pagination changes
    useEffect(() => {
        fetchAds();
    }, [currentPage, filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle delete confirmation
    const confirmDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    // Handle ad deletion
    const deleteAd = async () => {
        try {
            await axios.delete(`${base_url}/ads/${deleteConfirm.id}`);
            setDeleteConfirm({ show: false, id: null });
            fetchAds(); // Refresh the ads list
        } catch (err) {
            setError('Failed to delete ad');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Get badge color based on ad status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PAUSED':
                return 'bg-yellow-100 text-yellow-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="mx-auto ">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Ad Management</h1>
                <Link
                    to="/ads/post-new-ad"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create New Ad
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PAUSED">Paused</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                            Ad Type
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="type"
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Types</option>
                            <option value="BANNER">Banner</option>
                            <option value="POPUP">Popup</option>
                            <option value="INTERSTITIAL">Interstitial</option>
                            <option value="PAGE_END">Page End</option>
                            <option value="SEARCH_PAGE">Search Page</option>
                            <option value="FILTER_PAGE">Filter Page</option>
                            <option value="BUILDING_PAGE">Building Page</option>
                            <option value="PROPERTIES_PAGE">Properties Page</option>
                            <option value="PROJECT_PAGE">Project Page</option>
                            <option value="CALL_PAGE">Call Page</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                            City
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="city"
                            type="text"
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            placeholder="Filter by city"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pincode">
                            Pincode
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="pincode"
                            type="text"
                            name="pincode"
                            value={filters.pincode}
                            onChange={handleFilterChange}
                            placeholder="Filter by pincode"
                        />
                    </div>
                </div>
            </div>

            {/* Loading indicator */}
            {loading ? (
                <div className="flex justify-center items-center my-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Ads Table */}
                    <div className="overflow-x-auto bg-white shadow-md rounded">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Impressions
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        CTR
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads?.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            No ads found
                                        </td>
                                    </tr>
                                ) : (
                                    ads?.map((ad) => (
                                        <tr key={ad._id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">
                                                            {ad.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {ad.type.type.replace('_', ' ')}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(ad.status)}`}
                                                >
                                                    {ad.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {formatDate(ad.startDate)}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {formatDate(ad.endDate)}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {ad.impressions.toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {ad.clickthrough_rate.toFixed(2)}%
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/ads/${ad._id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        to={`/ads/${ad._id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(ad._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    Prev
                                </button>
                                <div className="flex">
                                    {[...Array(totalPages).keys()].map(page => (
                                        <button
                                            key={page + 1}
                                            onClick={() => handlePageChange(page + 1)}
                                            className={`text-sm font-semibold py-2 px-4 ${currentPage === page + 1
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                                }`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">Confirm Delete</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this ad? This action cannot be undone.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={deleteAd}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-28 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, id: null })}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-28 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdList;