import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Send, RefreshCw, Search, Users, CheckCircle, AlertCircle, ChevronDown, ChevronUp, X, Filter, Calendar, ArrowDownUp } from 'lucide-react';
import axios from 'axios';
import { base_url } from '../../utils/base_url';

const AdminEmailDashboard = () => {
    // Stats state
    const [stats, setStats] = useState({
        totalUsersWithEmail: 0,
        usersWithSearchHistory: 0,
        usersOptedOut: 0,
        usersRecentRecommendations: 0,
        eligibleUsers: 0
    });

    // User states
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    // Sorting state
    const [sortField, setSortField] = useState('lastLogin');
    const [sortDirection, setSortDirection] = useState('desc');

    // Filter states
    const [filters, setFilters] = useState({
        loginType: [],
        verificationStatus: {
            email: null,
            phone: null
        },
        activityStatus: '',
        dateRange: {
            start: '',
            end: ''
        }
    });
    const [showFilters, setShowFilters] = useState(false);

    // UI state
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [sendingEmails, setSendingEmails] = useState(false);
    const [showUserSelection, setShowUserSelection] = useState(false);
    const [sendResult, setSendResult] = useState(null);
    const [showResultDetails, setShowResultDetails] = useState(false);


    // Fetch email stats
    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await axios.get(`${base_url}/api/admin/recommendations/stats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    // Fetch users
    const fetchUsers = async (page = pagination.page, limit = pagination.limit, search = searchQuery) => {
        setLoading(true);
        try {
            // Prepare sort parameter
            const sort = `${sortField}:${sortDirection}`;

            // Prepare filter parameters
            let filterParams = {};

            // Only include non-empty filters
            if (filters.loginType.length > 0) {
                filterParams.loginType = filters.loginType;
            }

            const hasVerificationFilters =
                filters.verificationStatus.email !== null ||
                filters.verificationStatus.phone !== null;

            if (hasVerificationFilters) {
                filterParams.verificationStatus = {};

                if (filters.verificationStatus.email !== null) {
                    filterParams.verificationStatus.email = filters.verificationStatus.email;
                }

                if (filters.verificationStatus.phone !== null) {
                    filterParams.verificationStatus.phone = filters.verificationStatus.phone;
                }
            }

            if (filters.activityStatus) {
                filterParams.activityStatus = filters.activityStatus;
            }

            if (filters.dateRange.start || filters.dateRange.end) {
                filterParams.dateRange = {
                    start: filters.dateRange.start || undefined,
                    end: filters.dateRange.end || undefined
                };
            }

            // API call with query parameters
            const response = await axios.get(`${base_url}/api/get-all-user`, {
                params: {
                    page,
                    limit,
                    search,
                    sort,
                    filters: Object.keys(filterParams).length > 0 ? JSON.stringify(filterParams) : undefined
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setUsers(response.data.users);
            setFilteredUsers(response.data.users);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Send recommendations to all eligible users
    const sendRecommendationsToAll = async () => {
        setSendingEmails(true);
        setSendResult(null);

        try {
            const response = await axios.post(`${base_url}/api/admin/recommendations/trigger`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setSendResult({
                    success: true,
                    ...response.data.result
                });
                // Refresh stats after sending
                fetchStats();
            }
        } catch (error) {
            console.error('Error sending recommendations:', error);
            setSendResult({
                success: false,
                message: error.response?.data?.message || 'Failed to send recommendations'
            });
        } finally {
            setSendingEmails(false);
        }
    };

    // Send recommendations to selected users
    const sendRecommendationsToSelected = async () => {
        if (selectedUsers.length === 0) return;

        setSendingEmails(true);
        setSendResult(null);

        try {
            const response = await axios.post(`${base_url}/api/admin/recommendations/trigger`, {
                targetUserIds: selectedUsers
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setSendResult({
                    success: true,
                    ...response.data.result
                });
                // Clear selection after successful send
                setSelectedUsers([]);
                // Refresh stats
                fetchStats();
            }
        } catch (error) {
            console.error('Error sending recommendations:', error);
            setSendResult({
                success: false,
                message: error.response?.data?.message || 'Failed to send recommendations'
            });
        } finally {
            setSendingEmails(false);
        }
    };

    // Handle sorting change
    const handleSortChange = (field) => {
        if (field === sortField) {
            // Toggle direction if same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field with default desc direction
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Execute search
    const executeSearch = () => {
        fetchUsers(1, pagination.limit, searchQuery);
    };

    // Handle search on Enter key
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    // Toggle user selection
    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Select/deselect all visible users
    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user._id));
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            loginType: [],
            verificationStatus: {
                email: null,
                phone: null
            },
            activityStatus: '',
            dateRange: {
                start: '',
                end: ''
            }
        });

        // Reset sort to default
        setSortField('lastLogin');
        setSortDirection('desc');

        // Clear search
        setSearchQuery('');

        // Fetch with reset parameters
        fetchUsers(1, pagination.limit, '');
    };

    // Apply filters
    const applyFilters = () => {
        fetchUsers(1, pagination.limit, searchQuery);
        setShowFilters(false);
    };

    // Toggle login type filter
    const toggleLoginType = (type) => {
        setFilters(prev => ({
            ...prev,
            loginType: prev.loginType.includes(type)
                ? prev.loginType.filter(t => t !== type)
                : [...prev.loginType, type]
        }));
    };

    // Set verification status filter
    const setVerificationStatus = (field, value) => {
        setFilters(prev => ({
            ...prev,
            verificationStatus: {
                ...prev.verificationStatus,
                [field]: value
            }
        }));
    };

    // Format chart data
    const chartData = [
        { name: 'Email Users', value: stats.totalUsersWithEmail },
        { name: 'With Searches', value: stats.usersWithSearchHistory },
        { name: 'Opted Out', value: stats.usersOptedOut },
        { name: 'Recent Emails', value: stats.usersRecentRecommendations },
        { name: 'Eligible', value: stats.eligibleUsers }
    ];

    // Check if a user is eligible for recommendations
    const isUserEligible = (user) => {
        // User must have email and search history
        const hasEmail = !!user.email;
        const hasSearchHistory = (user.history?.searchHistory?.length || 0) > 0;

        // User must not have opted out
        const hasOptedOut = user.profile?.notifications?.email === false;

        // Check if user received recommendations in the last 24 hours
        const hasRecentRecommendation = user.activityLog?.some(activity => {
            if (activity.action !== 'RECOMMENDATIONS_SENT') return false;

            const activityDate = new Date(activity.timestamp);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            return activityDate >= yesterday;
        });

        return hasEmail && hasSearchHistory && !hasOptedOut && !hasRecentRecommendation;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get search count for a user
    const getSearchCount = (user) => {
        return user.history?.searchHistory?.length || 0;
    };

    // Load initial data
    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    // Refresh when sort changes
    useEffect(() => {
        fetchUsers(1, pagination.limit, searchQuery);
    }, [sortField, sortDirection]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900">Email Recommendations</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Track and send personalized property recommendations to users
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                        <button
                            onClick={fetchStats}
                            disabled={statsLoading}
                            className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh Stats</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">Email Users</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">
                                    {statsLoading ? '...' : stats.totalUsersWithEmail.toLocaleString()}
                                </h3>
                            </div>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">With Searches</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">
                                    {statsLoading ? '...' : stats.usersWithSearchHistory.toLocaleString()}
                                </h3>
                            </div>
                            <Search className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">Opted Out</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">
                                    {statsLoading ? '...' : stats.usersOptedOut.toLocaleString()}
                                </h3>
                            </div>
                            <X className="h-5 w-5 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">Recent Emails</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">
                                    {statsLoading ? '...' : stats.usersRecentRecommendations.toLocaleString()}
                                </h3>
                            </div>
                            <Mail className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs">Eligible Users</p>
                                <h3 className="text-xl font-bold text-green-600 mt-1">
                                    {statsLoading ? '...' : stats.eligibleUsers.toLocaleString()}
                                </h3>
                            </div>
                            <Send className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Chart & Actions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Chart */}
                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm lg:col-span-2">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">User Statistics</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.375rem',
                                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Send Recommendations
                        </h2>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <button
                                    onClick={sendRecommendationsToAll}
                                    disabled={sendingEmails || stats.eligibleUsers === 0}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                                >
                                    {sendingEmails ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    <span>Send to All Eligible Users</span>
                                </button>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    {stats.eligibleUsers > 0
                                        ? `${stats.eligibleUsers} users will receive recommendations`
                                        : 'No eligible users found'}
                                </p>
                            </div>

                            <div>
                                <button
                                    onClick={() => setShowUserSelection(!showUserSelection)}
                                    className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    {showUserSelection ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                    <span>{showUserSelection ? 'Hide User Selection' : 'Select Specific Users'}</span>
                                </button>
                            </div>

                            {selectedUsers.length > 0 && (
                                <div className="pt-4">
                                    <button
                                        onClick={sendRecommendationsToSelected}
                                        disabled={sendingEmails}
                                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                                    >
                                        {sendingEmails ? (
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                        <span>Send to {selectedUsers.length} Selected User{selectedUsers.length !== 1 ? 's' : ''}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Send Results */}
                        {sendResult && (
                            <div className={`mt-6 p-4 rounded-md ${sendResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {sendResult.success ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className={`text-sm font-medium ${sendResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                            {sendResult.success ? 'Recommendations sent' : 'Failed to send'}
                                        </h3>

                                        {sendResult.success && (
                                            <div className="mt-2 text-sm text-gray-700">
                                                <p>Sent to {sendResult.successful} of {sendResult.total} users</p>

                                                {sendResult.failed > 0 && (
                                                    <button
                                                        onClick={() => setShowResultDetails(!showResultDetails)}
                                                        className="flex items-center mt-1 text-blue-600 hover:text-blue-800"
                                                    >
                                                        <span>{showResultDetails ? 'Hide' : 'Show'} details</span>
                                                        {showResultDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                                                    </button>
                                                )}

                                                {showResultDetails && sendResult.failed > 0 && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                                                        <p className="text-red-600">{sendResult.failed} emails failed to send</p>
                                                        {sendResult.errors?.length > 0 && (
                                                            <ul className="list-disc list-inside mt-1 text-xs">
                                                                {sendResult.errors.slice(0, 5).map((error, index) => (
                                                                    <li key={index}>User {error.userId}: {error.error}</li>
                                                                ))}
                                                                {sendResult.errors.length > 5 && (
                                                                    <li>...and {sendResult.errors.length - 5} more errors</li>
                                                                )}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!sendResult.success && (
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{sendResult.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters Dialog */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black bg-opacity-25 z-40 flex items-center justify-center p-4 backdrop-filter backdrop-blur-sm">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">Filter Users</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Filter Content */}
                            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-6">
                                    {/* Login Type Filter */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Login Type</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {['EMAIL', 'GOOGLE', 'FACEBOOK', 'PHONE'].map(type => (
                                                <label
                                                    key={type}
                                                    className={`
                            flex items-center p-2.5 rounded-md border cursor-pointer
                            ${filters.loginType.includes(type)
                                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                            : 'border-gray-200 hover:bg-gray-50'
                                                        }
                          `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={filters.loginType.includes(type)}
                                                        onChange={() => toggleLoginType(type)}
                                                    />
                                                    <span className="ml-2 text-sm">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Email Verification */}
                                            <div>
                                                <label className="text-sm text-gray-600 block mb-1">Email Verified</label>
                                                <div className="flex">
                                                    <button
                                                        onClick={() => setVerificationStatus('email', true)}
                                                        className={`
                              flex-1 py-1.5 text-sm rounded-l-md border
                              ${filters.verificationStatus.email === true
                                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }
                            `}
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={() => setVerificationStatus('email', false)}
                                                        className={`
                              flex-1 py-1.5 text-sm rounded-r-md border-t border-b border-r
                              ${filters.verificationStatus.email === false
                                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }
                            `}
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Phone Verification */}
                                            <div>
                                                <label className="text-sm text-gray-600 block mb-1">Phone Verified</label>
                                                <div className="flex">
                                                    <button
                                                        onClick={() => setVerificationStatus('phone', true)}
                                                        className={`
                              flex-1 py-1.5 text-sm rounded-l-md border
                              ${filters.verificationStatus.phone === true
                                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }
                            `}
                                                    >
                                                        Yes
                                                    </button>
                                                    <button
                                                        onClick={() => setVerificationStatus('phone', false)}
                                                        className={`
                              flex-1 py-1.5 text-sm rounded-r-md border-t border-b border-r
                              ${filters.verificationStatus.phone === false
                                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }
                            `}
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Status */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Status</h3>
                                        <div className="flex">
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, activityStatus: 'active' }))}
                                                className={`
                          flex-1 py-2 text-sm rounded-l-md border
                          ${filters.activityStatus === 'active'
                                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                Active (30 days)
                                            </button>
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, activityStatus: 'inactive' }))}
                                                className={`
                          flex-1 py-2 text-sm rounded-r-md border-t border-b border-r
                          ${filters.activityStatus === 'inactive'
                                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                Inactive
                                            </button>

                                            {filters.activityStatus && (
                                                <button
                                                    onClick={() => setFilters(prev => ({ ...prev, activityStatus: '' }))}
                                                    className="ml-2 p-1.5 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
                                                    title="Clear activity filter"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date Range */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Registration Date Range</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600 block mb-1">From</label>
                                                <input
                                                    type="date"
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    value={filters.dateRange.start}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        dateRange: {
                                                            ...prev.dateRange,
                                                            start: e.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600 block mb-1">To</label>
                                                <input
                                                    type="date"
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    value={filters.dateRange.end}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        dateRange: {
                                                            ...prev.dateRange,
                                                            end: e.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none rounded-md mr-2"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Selection Table */}
                {showUserSelection && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
                        {/* Table Header with Search */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Select Users for Recommendations
                                </h2>

                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            onKeyPress={handleSearchKeyPress}
                                        />
                                    </div>

                                    <button
                                        onClick={executeSearch}
                                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                                        aria-label="Search"
                                    >
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </button>

                                    <button
                                        onClick={() => fetchUsers(pagination.page, pagination.limit)}
                                        disabled={loading}
                                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                                        aria-label="Refresh"
                                    >
                                        <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    checked={selectedUsers.length === users.length && users.length > 0}
                                                    onChange={toggleSelectAll}
                                                />
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('name')}
                                        >
                                            <div className="flex items-center">
                                                <span>User</span>
                                                {sortField === 'name' && (
                                                    <ArrowDownUp className="ml-1 h-3 w-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('history.searchHistory')}
                                        >
                                            <div className="flex items-center">
                                                <span>Searches</span>
                                                {sortField === 'history.searchHistory' && (
                                                    <ArrowDownUp className="ml-1 h-3 w-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSortChange('lastLogin')}
                                        >
                                            <div className="flex items-center">
                                                <span>Last Login</span>
                                                {sortField === 'lastLogin' && (
                                                    <ArrowDownUp className="ml-1 h-3 w-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={selectedUsers.includes(user._id)}
                                                        onChange={() => toggleUserSelection(user._id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name || 'Unnamed User'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email || 'No email'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getSearchCount(user)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(user.lastLogin)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {isUserEligible(user) ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Eligible
                                                        </span>
                                                    ) : !user.email ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                            No Email
                                                        </span>
                                                    ) : getSearchCount(user) === 0 ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            No Searches
                                                        </span>
                                                    ) : user.profile?.notifications?.email === false ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Opted Out
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            Recent Email
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => fetchUsers(Math.max(1, pagination.page - 1), pagination.limit, searchQuery)}
                                        disabled={pagination.page <= 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => fetchUsers(Math.min(pagination.pages, pagination.page + 1), pagination.limit, searchQuery)}
                                        disabled={pagination.page >= pagination.pages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{Math.min(pagination.total, (pagination.page - 1) * pagination.limit + 1)}</span> to <span className="font-medium">{Math.min(pagination.total, pagination.page * pagination.limit)}</span> of <span className="font-medium">{pagination.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => fetchUsers(Math.max(1, pagination.page - 1), pagination.limit, searchQuery)}
                                                disabled={pagination.page <= 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <ChevronUp className="h-5 w-5 transform rotate-90" />
                                            </button>

                                            {Array.from({ length: Math.min(5, pagination.pages) }).map((_, index) => {
                                                let pageNum;

                                                if (pagination.pages <= 5) {
                                                    pageNum = index + 1;
                                                } else if (pagination.page <= 3) {
                                                    pageNum = index + 1;
                                                } else if (pagination.page >= pagination.pages - 2) {
                                                    pageNum = pagination.pages - 4 + index;
                                                } else {
                                                    pageNum = pagination.page - 2 + index;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => fetchUsers(pageNum, pagination.limit, searchQuery)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                              ${pageNum === pagination.page
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }
                            `}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => fetchUsers(Math.min(pagination.pages, pagination.page + 1), pagination.limit, searchQuery)}
                                                disabled={pagination.page >= pagination.pages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">Next</span>
                                                <ChevronDown className="h-5 w-5 transform rotate-90" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="text-sm text-gray-700">
                                {selectedUsers.length > 0 ? (
                                    <span>{selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected</span>
                                ) : (
                                    <span>No users selected</span>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                {selectedUsers.length > 0 && (
                                    <button
                                        onClick={() => setSelectedUsers([])}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Clear Selection
                                    </button>
                                )}

                                <button
                                    onClick={sendRecommendationsToSelected}
                                    disabled={selectedUsers.length === 0 || sendingEmails}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {sendingEmails ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Recommendations
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminEmailDashboard;