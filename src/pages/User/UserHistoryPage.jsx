import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import HistoryTypeSelector from '../components/HistoryTypeSelector';
import UserHistoryStats from '../components/UserHistoryStats';
import UserHistoryTable from '../components/UserHistoryTable';
import UserHistoryFilters from '../components/UserHistoryFilters';
import Pagination from '../components/Pagination';
import UserHistoryChart from '../components/UserHistoryChart';

const UserHistoryPage = () => {
    const { userId } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [chartView, setChartView] = useState(false);

    // Get type from URL query params if present
    const urlParams = new URLSearchParams(location.search);
    const typeFromUrl = urlParams.get('type');

    // Set historyType from URL or default to 'all'
    const [historyType, setHistoryType] = useState(typeFromUrl || 'all');

    // Pagination state
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        pages: 0
    });

    // Filter and sort state
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        propertyId: '',
        status: '',
        query: ''
    });

    const [sorting, setSorting] = useState({
        sortBy: historyType === 'liked' ? 'savedAt' : 'timestamp',
        sortOrder: 'desc'
    });

    // Update URL when history type changes
    useEffect(() => {
        const currentUrlParams = new URLSearchParams(window.location.search);
        if (historyType !== 'all') {
            currentUrlParams.set('type', historyType);
        } else {
            currentUrlParams.delete('type');
        }

        const newUrl = `${window.location.pathname}${currentUrlParams.toString() ? `?${currentUrlParams.toString()}` : ''
            }`;

        window.history.replaceState({}, '', newUrl);
    }, [historyType]);

    // Fetch user history
    const fetchUserHistory = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams({
                type: historyType,
                page: pagination.page,
                limit: pagination.limit,
                sortBy: sorting.sortBy,
                sortOrder: sorting.sortOrder,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '')
                )
            });

            const response = await axios.get(`/get/user/history/${userId}/history?${params}`);

            // Handle the response based on history type
            if (historyType === 'all') {
                // For 'all' type, we expect an object with counts and recent items
                setHistoryData(response.data.data || { counts: {}, recent: {} });
            } else {
                // For specific types, we expect an array of history items
                setHistoryData(Array.isArray(response.data.data) ? response.data.data : []);
            }

            setPagination(response.data.pagination);
            setError(null);
        } catch (err) {
            console.error('Error fetching user history:', err);
            setError('Failed to fetch user history. Please try again later.');
            // Set empty data
            if (historyType === 'all') {
                setHistoryData({ counts: {}, recent: {} });
            } else {
                setHistoryData([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch user basic info
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            setUserData(response.data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            // Still continue with the rest of the page
        }
    };

    // Fetch data on initial load
    useEffect(() => {
        fetchUserData();
    }, [userId]);

    // Fetch history data when any related dependency changes
    useEffect(() => {
        fetchUserHistory();
    }, [userId, historyType, pagination.page, pagination.limit, sorting.sortBy, sorting.sortOrder]);

    // Handle history type change
    const handleHistoryTypeChange = (type) => {
        setHistoryType(type);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page

        // Reset sorting based on the new history type
        setSorting({
            sortBy: type === 'liked' ? 'savedAt' : 'timestamp',
            sortOrder: 'desc'
        });
    };

    // Handle filter submit
    const handleFilterSubmit = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
        fetchUserHistory();
    };

    // Handle sorting change
    const handleSortChange = (sortBy, sortOrder) => {
        setSorting({ sortBy, sortOrder });
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    // Toggle between table and chart view
    const toggleChartView = () => {
        setChartView(prev => !prev);
    };

    // Check if historyData is valid for the current historyType
    const isValidHistoryData = () => {
        if (historyType === 'all') {
            return historyData && historyData.counts && historyData.recent;
        }
        return Array.isArray(historyData);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-2">
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Users
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">
                        User History {userData && userData.name ? `- ${userData.name}` : ''}
                    </h1>
                </div>

                {historyType !== 'all' && (
                    <button
                        onClick={toggleChartView}
                        className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center"
                    >
                        {chartView ? (
                            <>
                                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                Table View
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Chart View
                            </>
                        )}
                    </button>
                )}
            </div>

            {userData && (
                <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">User</h3>
                            <p className="text-lg font-semibold text-gray-900">{userData.name || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="text-lg font-semibold text-gray-900">{userData.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                            <p className="text-lg font-semibold text-gray-900">{userData.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            <HistoryTypeSelector
                activeType={historyType}
                onTypeChange={handleHistoryTypeChange}
            />

            {historyType !== 'all' && (
                <UserHistoryFilters
                    historyType={historyType}
                    filters={filters}
                    onSubmit={handleFilterSubmit}
                />
            )}

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : (
                <>
                    {historyType === 'all' && historyData && historyData.counts && historyData.recent && (
                        <UserHistoryStats
                            counts={historyData.counts || {}}
                            recent={historyData.recent || {}}
                        />
                    )}

                    {historyType !== 'all' && (
                        <>
                            {chartView ? (
                                <UserHistoryChart
                                    historyType={historyType}
                                    historyData={historyData || []}
                                />
                            ) : (
                                <>
                                    <UserHistoryTable
                                        historyType={historyType}
                                        historyData={historyData || []}
                                        onSort={handleSortChange}
                                        currentSort={sorting}
                                    />

                                    {pagination && pagination.pages > 0 && (
                                        <Pagination
                                            currentPage={pagination.page}
                                            totalPages={pagination.pages}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default UserHistoryPage;