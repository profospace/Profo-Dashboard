import React, { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import StatsSection from '../components/StatsSection';
import { base_url } from '../../utils/base_url';

const UserDashboard = () => {
    // State management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        pageSize: 10
    });
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        phone: '',
        loginType: ''
    });

    // Fetch users on component mount and when filters or pagination changes
    useEffect(() => {
        fetchUsers();
    }, [pagination.currentPage, filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: pagination.currentPage,
                limit: pagination.pageSize
            });

            // Add filters if they exist
            if (filters.name) params.append('name', filters.name);
            if (filters.email) params.append('email', filters.email);
            if (filters.phone) params.append('phone', filters.phone);
            if (filters.loginType) params.append('loginType', filters.loginType);

            // Fetch data from API
            const response = await fetch(`${base_url}/paginated?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('authToken') || ''
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            

            setUsers(data.users);
            setPagination({
                ...pagination,
                totalPages: data.pagination.pages,
                totalUsers: data.pagination.total
            });
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again later.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (field, value) => {
        setFilters({ ...filters, [field]: value });
        setPagination({ ...pagination, currentPage: 1 });
    };

    const handleLoginTypeChange = (value) => {
        setFilters({ ...filters, loginType: value });
        setPagination({ ...pagination, currentPage: 1 });
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            email: '',
            phone: '',
            loginType: ''
        });
        setPagination({ ...pagination, currentPage: 1 });
    };

    const handlePageChange = (newPage) => {
        setPagination({ ...pagination, currentPage: newPage });
    };

    return (
        <div className="user-dashboard max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management Dashboard</h1>

            {/* Search and Filters */}
            <div className="mb-8">
                <SearchBar
                    filters={filters}
                    onSearch={handleSearch}
                />
                <FilterSection
                    loginType={filters.loginType}
                    onLoginTypeChange={handleLoginTypeChange}
                    onResetFilters={resetFilters}
                />
            </div>

            {/* Stats Section */}
            <StatsSection
                totalUsers={pagination.totalUsers}
                users={users}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* User Grid */}
            {!loading && !error && (
                <>
                    {users.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No users found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {users.map(user => (
                                <UserCard key={user._id} user={user} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default UserDashboard;