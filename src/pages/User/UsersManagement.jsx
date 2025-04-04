import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserTable from '../../components/User/UserTable';
import UserFilters from '../../components/User/UserFilters';
import Pagination from '../../components/User/Pagination';
import UserCard from '../../components/User/UserCard';
import { base_url } from '../../../utils/base_url';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Filter and sort state
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    loginType: '',
    isPhoneVerified: '',
    createdAfter: '',
    createdBefore: '',
    lastLoginAfter: '',
    lastLoginBefore: '',
  });

  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch users with current pagination, filters, and sorting
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination?.page,
        limit: pagination?.limit,
        sortBy: sorting?.sortBy,
        sortOrder: sorting?.sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await axios.get(`${base_url}/api/get-all-user/paginated?${params}`);
      console.log(response)
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on initial load and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [pagination?.page, pagination?.limit, sorting?.sortBy, sorting?.sortOrder]);

  // Handle filter submit
  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchUsers();
  };

  // Handle sorting change
  const handleSortChange = (sortBy, sortOrder) => {
    setSorting({ sortBy, sortOrder });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle view user history
  const handleViewHistory = (userId) => {
    navigate(`/user-activity/${userId}/history`);
  };

  // Toggle view mode between table and card
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'table' ? 'card' : 'table');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={toggleViewMode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </button>
      </div>

      <UserFilters filters={filters} onSubmit={handleFilterSubmit} />

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
          {viewMode === 'table' ? (
            <UserTable
              users={users}
              onSort={handleSortChange}
              currentSort={sorting}
              onViewHistory={handleViewHistory}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={pagination?.page}
            totalPages={pagination?.pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;