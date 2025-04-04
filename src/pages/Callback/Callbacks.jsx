import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { base_url } from '../../../utils/base_url';

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getBadgeColor = () => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
            {status}
        </span>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Previous
                        </button>

                        {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

// Main Component
const Callbacks = () => {
    // State
    const [callbacks, setCallbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        totalRecords: 0
    });
    const [builders, setBuilders] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        builderId: '',
        phoneNumber: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10
    });

    // Update callback status modal
    const [showModal, setShowModal] = useState(false);
    const [selectedCallback, setSelectedCallback] = useState(null);
    const [updateData, setUpdateData] = useState({
        status: '',
        notes: ''
    });

    // Fetch callbacks with current filters
    const fetchCallbacks = async () => {
        setLoading(true);
        try {
            const params = { ...filters };

            const response = await axios.get(`${base_url}/api/callback/admin/callbacks`, { params });

            setCallbacks(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching callbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch builders for filter dropdown
    const fetchBuilders = async () => {
        try {
            const response = await axios.get(`${base_url}/builders`);
            console.log(response)
            setBuilders(response.data);
        } catch (error) {
            console.error('Error fetching builders:', error);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchCallbacks();
        fetchBuilders();
    }, []);

    // Refetch when filters or page changes
    useEffect(() => {
        fetchCallbacks();
    }, [filters.page, filters.limit]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to first page on filter change
        }));
    };

    // Apply filters
    const applyFilters = (e) => {
        e.preventDefault();
        fetchCallbacks();
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            status: '',
            builderId: '',
            phoneNumber: '',
            startDate: '',
            endDate: '',
            page: 1,
            limit: 10
        });
        fetchCallbacks();
    };

    // Handle page change
    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    // Open update modal
    const openUpdateModal = (callback) => {
        setSelectedCallback(callback);
        setUpdateData({
            status: callback.status,
            notes: callback.notes || ''
        });
        setShowModal(true);
    };

    // Update callback status
    const updateCallbackStatus = async () => {
        try {
            await axios.patch(`${base_url}/api/callback/admin/callbacks/${selectedCallback._id}`, updateData);
            fetchCallbacks();
            setShowModal(false);
        } catch (error) {
            console.error('Error updating callback:', error);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Callback Requests</h1>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Filters</h2>
                    <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        {/* Builder Filter */}
                        <div>
                            <label htmlFor="builderId" className="block text-sm font-medium text-gray-700">Builder</label>
                            <select
                                id="builderId"
                                name="builderId"
                                value={filters.builderId}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">All Builders</option>
                                {builders.map(builder => (
                                    <option key={builder._id} value={builder._id}>
                                        {builder.name} - {builder.company}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phone Number Filter */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={filters.phoneNumber}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Search by phone number"
                            />
                        </div>

                        {/* Date Range Filters */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">From Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">To Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-end space-x-3">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Callbacks Table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Callback Requests ({pagination.totalRecords})
                        </h3>
                        <div className="flex items-center">
                            <label htmlFor="limit" className="mr-2 text-sm text-gray-600">Show:</label>
                            <select
                                id="limit"
                                name="limit"
                                value={filters.limit}
                                onChange={handleFilterChange}
                                className="block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : callbacks.length === 0 ? (
                        <div className="px-4 py-16 text-center text-gray-500">
                            No callback requests found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Builder
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone Number
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Requested Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {callbacks.map((callback) => (
                                        <tr key={callback._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {callback.builder?.name || 'N/A'}
                                                {callback.builder?.company && (
                                                    <span className="text-gray-500 text-xs block">
                                                        {callback.builder.company}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {callback.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {callback.requestedTime}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={callback.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(callback.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {callback.notes || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openUpdateModal(callback)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && callbacks.length > 0 && (
                        <Pagination
                            currentPage={pagination.current}
                            totalPages={pagination.total}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

            {/* Update Status Modal */}
            {showModal && selectedCallback && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Update Callback
                                        </h3>

                                        <div className="mb-4">
                                            <label htmlFor="modal-status" className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                id="modal-status"
                                                value={updateData.status}
                                                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="modal-notes" className="block text-sm font-medium text-gray-700">Notes</label>
                                            <textarea
                                                id="modal-notes"
                                                value={updateData.notes}
                                                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                                                rows="3"
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Add notes about this callback"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={updateCallbackStatus}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default Callbacks;