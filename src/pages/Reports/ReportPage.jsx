// src/pages/ReportAdmin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// Import icons
import { FiChevronLeft, FiChevronRight, FiFilter, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiClock, FiXCircle, FiPhone, FiHome } from 'react-icons/fi';
import { BiBuilding, BiBuildings } from 'react-icons/bi';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const ReportPage = () => {
    // State variables
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({
        statusCounts: {},
        entityTypeCounts: {},
        problemCounts: {}
    });

    // Filter state
    const [filters, setFilters] = useState({
        status: '',
        entityType: '',
        problem: ''
    });

    // For report update
    const [statusUpdate, setStatusUpdate] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    // Constants for display labels
    const statusLabels = {
        pending: 'Pending',
        reviewing: 'Reviewing',
        resolved: 'Resolved',
        dismissed: 'Dismissed'
    };

    const entityTypeLabels = {
        property: 'Property',
        project: 'Project',
        building: 'Building'
    };

    const problemLabels = {
        incorrect_info: 'Incorrect Information',
        scam: 'Scam',
        unavailable: 'Unavailable',
        duplicate: 'Duplicate',
        other: 'Other'
    };

    // Status badge colors
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        reviewing: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        dismissed: 'bg-gray-100 text-gray-800'
    };

    // Icons for entity types
    const entityIcons = {
        property: <FiHome className="w-5 h-5 text-indigo-500" />,
        project: <BiBuildings className="w-5 h-5 text-purple-500" />,
        building: <BiBuilding className="w-5 h-5 text-blue-500" />
    };

    // Fetch reports on initial load and when filters change
    useEffect(() => {
        fetchReports();
        fetchStats();
    }, [currentPage, filters]);

    // Fetch reports from API
    const fetchReports = async () => {
        try {
            setLoading(true);

            // Build query string for filters
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '')
                )
            }).toString();

            const response = await axios.get(`${base_url}/api/report?${queryParams}`, getAuthConfig());

            if (response.data.success) {
                setReports(response.data.data);
                setTotalPages(response.data.totalPages);
                setTotalReports(response.data.total);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load reports. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch report statistics
    const fetchStats = async () => {
        try {
            const response = await axios.get(`${base_url}/api/report/stats` , getAuthConfig());

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            status: '',
            entityType: '',
            problem: ''
        });
        setCurrentPage(1);
    };

    // Open modal with report details
    const openReportModal = (report) => {
        setSelectedReport(report);
        setStatusUpdate(report.status);
        setAdminNotes('');
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
        setStatusUpdate('');
        setAdminNotes('');
    };

    // Handle report status update
    const updateReportStatus = async () => {
        try {
            if (!selectedReport || !statusUpdate) return;

            const response = await axios.put(
                `${base_url}/api/report/${selectedReport._id}`,
                {
                    status: statusUpdate,
                    adminNotes: adminNotes.trim() ? adminNotes : undefined
                },
                getAuthConfig()
            );

            if (response.data.success) {
                toast.success(`Report status updated to ${statusLabels[statusUpdate]}`);

                // Update report in state
                setReports(reports.map(report =>
                    report._id === selectedReport._id ? response.data.data : report
                ));

                // Refresh stats
                fetchStats();

                // Close modal
                closeModal();
            }
        } catch (error) {
            console.error('Error updating report status:', error);
            toast.error('Failed to update report status. Please try again.');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Status icon component
    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'pending':
                return <FiAlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'reviewing':
                return <FiClock className="w-5 h-5 text-blue-600" />;
            case 'resolved':
                return <FiCheckCircle className="w-5 h-5 text-green-600" />;
            case 'dismissed':
                return <FiXCircle className="w-5 h-5 text-gray-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="">

            <div className="mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
                        <p className="text-gray-600">Manage and resolve user reports</p>
                    </div>

                    <button
                        onClick={fetchReports}
                        className="mt-3 md:mt-0 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        <FiRefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Total Reports</h3>
                        <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.statusCounts?.pending || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Reviewing</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.statusCounts?.reviewing || 0}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.statusCounts?.resolved || 0}</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex items-center mb-4">
                        <FiFilter className="w-5 h-5 text-gray-500 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="resolved">Resolved</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                            <select
                                id="entityType"
                                name="entityType"
                                value={filters.entityType}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Entity Types</option>
                                <option value="property">Property</option>
                                <option value="project">Project</option>
                                <option value="building">Building</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">Problem Type</label>
                            <select
                                id="problem"
                                name="problem"
                                value={filters.problem}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Problem Types</option>
                                <option value="incorrect_info">Incorrect Information</option>
                                <option value="scam">Scam</option>
                                <option value="unavailable">Unavailable</option>
                                <option value="duplicate">Duplicate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Entity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reported By
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact Info
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Problem
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            Loading reports...
                                        </td>
                                    </tr>
                                ) : reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No reports found.
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        {entityIcons[report.entityType]}
                                                    </div>
                                                    <div className="ml-2">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {report.entityTitle || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {entityTypeLabels[report.entityType]} #{report.entityId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {report.createdBy?.name || 'Unknown User'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {report.createdBy?.email || 'No email'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <FiPhone className="w-4 h-4 mr-1 text-gray-500" />
                                                    Reporter: {report.reporterPhone || 'N/A'}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <FiPhone className="w-3 h-3 mr-1 text-gray-400" />
                                                    Entity: {report.entityPhone || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {problemLabels[report.problem]}
                                                </div>
                                                {report.description && (
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                                        {report.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                                                    <StatusIcon status={report.status} className="mr-1" />
                                                    {statusLabels[report.status]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(report.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openReportModal(report)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && reports.length > 0 && (
                        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{reports.length}</span> of{' '}
                                        <span className="font-medium">{totalReports}</span> reports
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>

                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            // Handle pagination display logic
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === pageNum
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedReport && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                            {entityIcons[selectedReport.entityType]}
                                            <span className="ml-2">Report Details</span>
                                        </h3>

                                        <div className="mt-4 border-t border-gray-200 pt-4">
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Entity Type</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{entityTypeLabels[selectedReport.entityType]}</dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Entity ID</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedReport.entityId}</dd>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Entity Name</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedReport.entityTitle || 'N/A'}</dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Problem Type</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{problemLabels[selectedReport.problem]}</dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedReport.status]}`}>
                                                            <StatusIcon status={selectedReport.status} className="mr-1" />
                                                            {statusLabels[selectedReport.status]}
                                                        </span>
                                                    </dd>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                                        {selectedReport.description || 'No description provided'}
                                                    </dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Reporter</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedReport.createdBy?.name || 'Unknown'}
                                                    </dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Reporter Phone</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedReport.reporterPhone || 'N/A'}
                                                    </dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Entity Phone</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedReport.entityPhone || 'N/A'}
                                                    </dd>
                                                </div>

                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">Reported On</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {formatDate(selectedReport.createdAt)}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="statusUpdate" className="block text-sm font-medium text-gray-700 mb-1">
                                                Update Status
                                            </label>
                                            <select
                                                id="statusUpdate"
                                                value={statusUpdate}
                                                onChange={(e) => setStatusUpdate(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewing">Reviewing</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="dismissed">Dismissed</option>
                                            </select>
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                                                Admin Notes
                                            </label>
                                            <textarea
                                                id="adminNotes"
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                rows={3}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Add notes about this report..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={updateReportStatus}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Update Status
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
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

export default ReportPage;