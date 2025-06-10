// src/components/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import UserFilters from './UserFilters';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';
import { ConfirmationModal } from '../common/Modal';
import { userService } from '../../api/apiService';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [sortOption, setSortOption] = useState('createdAt:desc');

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        userId: null,
        userName: '',
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch users on component mount and when filters, search, sort, or pagination changes
    useEffect(() => {
        fetchUsers();
    }, [pagination.page, searchTerm, sortOption, filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                sort: sortOption,
                filters,
            });

            setUsers(response.users);
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on new search
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on sort change
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter change
    };

    const handleResetFilters = () => {
        setFilters({});
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter reset
    };

    const handleDeleteUser = async(userId, userName) => {
        setDeleteModal({
            isOpen: true,
            userId,
            userName,
        });

        const response = await axios.delete(`${base_url}/api/delete/user/${userId}`)
        
            console.log(response)
    };

    const confirmDeleteUser = async () => {
        try {
            setIsDeleting(true);
            await userService.deleteUser(deleteModal.userId);

            // Remove user from list without refetching
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== deleteModal.userId)
            );

            // Adjust pagination if needed
            setPagination((prev) => ({
                ...prev,
                total: prev.total - 1,
                pages: Math.ceil((prev.total - 1) / prev.limit),
            }));

            // Go to previous page if current page is now empty
            if (users.length === 1 && pagination.page > 1) {
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
            }

            // Close modal
            setDeleteModal({ isOpen: false, userId: null, userName: '' });
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user. Please try again later.');
        } finally {
            setIsDeleting(false);
        }
    };


    const [trackedUsers , setTrackedUsers] = useState([])
    const getAllTrackedUsers = async()=>{
        const response = await axios.get(`${base_url}/api/admin/tracking/current` , getAuthConfig())

        console.log(response?.data?.data?.trackedUsers)

        if (response?.status === 200){
            setTrackedUsers(response?.data?.data?.trackedUsers)
        }
    }


    useEffect(
        ()=>{
            getAllTrackedUsers()
        },[]
    )


    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <SearchBar onSearch={handleSearch} placeholder="Search by name, email or phone..." />

                    <div className="w-full md:w-auto">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="createdAt:desc">Newest First</option>
                            <option value="createdAt:asc">Oldest First</option>
                            <option value="name:asc">Name (A-Z)</option>
                            <option value="name:desc">Name (Z-A)</option>
                            <option value="lastLogin:desc">Recent Activity</option>
                        </select>
                    </div>
                </div>

                <UserFilters onApplyFilters={handleApplyFilters} onResetFilters={handleResetFilters} />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : users.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-gray-500">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onDeleteUser={handleDeleteUser}
                            trackedUsers={trackedUsers}
                        />
                    ))}

                    {pagination.pages > 1 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete ${deleteModal.userName}? This action cannot be undone.`}
                confirmText={isDeleting ? 'Deleting...' : 'Delete User'}
                confirmVariant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default UserList;