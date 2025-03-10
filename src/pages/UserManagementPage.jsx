import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPaginatedUsers,
    getUserById,
    setPage,
    setFilters
} from '../redux/features/Users/usersSlice';
import SearchBar from '../components/SearchBar';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import StatsSection from '../components/StatsSection';
import UserCard from '../components/UserCard';

const UserManagementPage = () => {
    const dispatch = useDispatch();
    const { users, pagination, isLoading, isError, message } = useSelector(
        (state) => state.users
    );

    const [filters, setLocalFilters] = useState({
        name: '',
        email: '',
        phone: '',
        loginType: ''
    });

    useEffect(() => {
        dispatch(getPaginatedUsers({
            page: pagination.currentPage,
            limit: pagination.pageSize,
            filters
        }));
    }, [dispatch, pagination.currentPage, filters]);

    const handleSearch = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setLocalFilters(newFilters);
        dispatch(setFilters(newFilters));
    };

    const handleLoginTypeChange = (value) => {
        const newFilters = { ...filters, loginType: value };
        setLocalFilters(newFilters);
        dispatch(setFilters(newFilters));
    };

    const resetFilters = () => {
        const resetFilters = {
            name: '',
            email: '',
            phone: '',
            loginType: ''
        };
        setLocalFilters(resetFilters);
        dispatch(setFilters(resetFilters));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <div className="bg-white shadow-md rounded-lg p-6">
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
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading users...</span>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}

                {/* User Grid */}
                {!isLoading && !isError && (
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
        </div>
    );
};

export default UserManagementPage;