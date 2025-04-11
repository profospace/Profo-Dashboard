import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiChevronDown,
    FiChevronUp,
    FiFilter,
    FiSearch,
    FiEye,
    FiTrash2,
    FiX,
    FiRefreshCw
} from 'react-icons/fi';
import { base_url } from '../../../utils/base_url';

const ExportConfigsList = () => {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        type: '',
        search: '',
        startDate: '',
        endDate: '',
        version: '',
        sort: 'exportedAt',
        order: 'desc',
        page: 1,
        limit: 10
    });

    // Pagination state
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        page: 1
    });

    // Available filter options
    const typeOptions = ['project', 'property', 'building'];

    const fetchConfigs = async () => {
        setLoading(true);
        setError(null);

        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await axios.get(`${base_url}/api/export-configs?${queryParams}`);
            setConfigs(response.data.data);
            setPagination({
                total: response.data.total,
                pages: response.data.pages,
                page: response.data.page
            });
        } catch (err) {
            setError('Failed to fetch export configurations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, [filters.page, filters.limit, filters.sort, filters.order]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Reset to first page when applying new filters
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchConfigs();
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            search: '',
            startDate: '',
            endDate: '',
            version: '',
            sort: 'exportedAt',
            order: 'desc',
            page: 1,
            limit: 10
        });
        fetchConfigs();
    };

    const handleSort = (field) => {
        setFilters(prev => ({
            ...prev,
            sort: field,
            order: prev.sort === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const handleView = (targetId) => {
        navigate(`/viewer?id=${targetId}`);
    };

    const handleDelete = async (targetId) => {
        if (deleteConfirmation !== targetId) {
            setDeleteConfirmation(targetId);
            return;
        }

        setIsDeleting(true);
        try {
            await axios.delete(`${base_url}/api/export-config/${targetId}`);
            // Refresh the list after deletion
            fetchConfigs();
            // Show success notification (you can implement this with a library or custom component)
        } catch (err) {
            setError('Failed to delete export configuration');
            console.error(err);
        } finally {
            setDeleteConfirmation(null);
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const renderSortIcon = (field) => {
        if (filters.sort !== field) return null;
        return filters.order === 'asc'
            ? <FiChevronUp className="w-4 h-4 ml-1" />
            : <FiChevronDown className="w-4 h-4 ml-1" />;
    };

    const renderPagination = () => {
        const { page, pages, total } = pagination;

        return (
            <div className="flex items-center justify-between mt-6 px-4">
                <div className="text-sm text-gray-600">
                    Showing {Math.min((page - 1) * filters.limit + 1, total)} to {Math.min(page * filters.limit, total)} of {total} results
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => handleFilterChange('page', Math.max(1, page - 1))}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
                    >
                        Previous
                    </button>

                    {[...Array(Math.min(5, pages))].map((_, i) => {
                        const pageNum = page <= 3
                            ? i + 1
                            : page >= pages - 2
                                ? pages - 4 + i
                                : page - 2 + i;

                        if (pageNum <= 0 || pageNum > pages) return null;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handleFilterChange('page', pageNum)}
                                className={`px-3 py-1 rounded-md ${pageNum === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handleFilterChange('page', Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className={`px-3 py-1 rounded-md ${page === pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto ">
            <div className="bg-white  rounded-lg overflow-hidden">
                <div className="border-b flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Export Configurations</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                            <FiFilter className="w-5 h-5 mr-2" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        <button
                            onClick={fetchConfigs}
                            className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                        >
                            <FiRefreshCw className="w-5 h-5 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="bg-gray-50 p-6 border-b border-gray-200 transition-all duration-300">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiSearch className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        placeholder="Target ID or building name"
                                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {typeOptions.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Version</label>
                                <input
                                    type="text"
                                    value={filters.version}
                                    onChange={(e) => handleFilterChange('version', e.target.value)}
                                    placeholder="e.g. 1.0.0"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Results Per Page</label>
                                <select
                                    value={filters.limit}
                                    onChange={(e) => handleFilterChange('limit', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>

                            <div className="md:col-span-3 flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 p-4 border-l-4 border-red-500">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('targetId')}
                                        >
                                            <div className="flex items-center">
                                                Target ID
                                                {renderSortIcon('targetId')}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('targetType')}
                                        >
                                            <div className="flex items-center">
                                                Type
                                                {renderSortIcon('targetType')}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('version')}
                                        >
                                            <div className="flex items-center">
                                                Version
                                                {renderSortIcon('version')}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('exportedAt')}
                                        >
                                            <div className="flex items-center">
                                                Exported At
                                                {renderSortIcon('exportedAt')}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Buildings
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {configs.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                No export configurations found
                                            </td>
                                        </tr>
                                    ) : (
                                        configs.map((config) => (
                                            <tr key={config.targetId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{config.targetId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${config.targetType === 'project' ? 'bg-blue-100 text-blue-800' :
                                                            config.targetType === 'property' ? 'bg-green-100 text-green-800' :
                                                                'bg-purple-100 text-purple-800'}`}
                                                    >
                                                        {config.targetType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{config.version}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{formatDate(config.exportedAt)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{config.buildings?.length || 0} buildings</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleView(config.targetId)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <FiEye className="w-5 h-5 mr-1" />
                                                            View
                                                        </button>
                                                        {deleteConfirmation === config.targetId ? (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-red-600 text-xs">Confirm?</span>
                                                                <button
                                                                    onClick={cancelDelete}
                                                                    className="text-gray-500 hover:text-gray-700"
                                                                    disabled={isDeleting}
                                                                >
                                                                    <FiX className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(config.targetId)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    disabled={isDeleting}
                                                                >
                                                                    {isDeleting ? (
                                                                        <div className="w-5 h-5 border-t-2 border-red-600 rounded-full animate-spin"></div>
                                                                    ) : (
                                                                        <FiTrash2 className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleDelete(config.targetId)}
                                                                className="text-red-600 hover:text-red-900 flex items-center"
                                                            >
                                                                <FiTrash2 className="w-5 h-5 mr-1" />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {configs.length > 0 && renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExportConfigsList;