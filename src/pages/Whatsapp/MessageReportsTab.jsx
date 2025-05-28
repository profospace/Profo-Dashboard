import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Filter, Search, Calendar, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const MessageReportsTab = () => {
    const [messages, setMessages] = useState([]);
    const [instances, setInstances] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [filters, setFilters] = useState({
        instanceId: '',
        direction: '',
        status: '',
        messageType: '',
        startDate: '',
        endDate: '',
        phoneNumber: ''
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0
    });

    useEffect(() => {
        fetchMessages();
        fetchInstances();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [filters]);

    const fetchMessages = async (page = 1) => {
        try {
            const params = new URLSearchParams({
                ...filters,
                page: page.toString(),
                limit: '20'
            });

            const response = await fetch(`${base_url}/api/messages/history?${params}`, getAuthConfig());
            const data = await response.json();

            setMessages(data.messages || []);
            setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInstances = async () => {
        try {
            const response = await fetch(`${base_url}/api/devices`, getAuthConfig());
            const data = await response.json();
            setInstances(data);
        } catch (error) {
            console.error('Error fetching instances:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${base_url}/api/messages/stats`, getAuthConfig());
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const exportMessages = async () => {
        setExporting(true);
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`${base_url}/api/messages/export?${params}`, getAuthConfig());

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `messages_report_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error exporting messages:', error);
            alert('Failed to export messages');
        } finally {
            setExporting(false);
        }
    };

    const applyFilters = () => {
        fetchMessages(1);
        fetchStats();
    };

    const clearFilters = () => {
        setFilters({
            instanceId: '',
            direction: '',
            status: '',
            messageType: '',
            startDate: '',
            endDate: '',
            phoneNumber: ''
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            sent: 'bg-green-100 text-green-800',
            delivered: 'bg-blue-100 text-blue-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getDirectionColor = (direction) => {
        return direction === 'incoming'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Message Reports</h2>
                    <p className="text-gray-600 mt-1">View detailed message analytics and reports</p>
                </div>
                <button
                    onClick={exportMessages}
                    disabled={exporting}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-150 flex items-center space-x-2 disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Messages</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {stats.overview?.total?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">Last 7 days</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                            <p className="text-2xl font-bold text-green-900 mt-2">
                                {stats.overview?.sent?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-600">
                            {stats.overview?.total > 0 ?
                                Math.round((stats.overview.sent / stats.overview.total) * 100) : 0}% success rate
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Auto Replies</p>
                            <p className="text-2xl font-bold text-purple-900 mt-2">
                                {stats.overview?.autoReplies?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-600">Automated responses</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Failed Messages</p>
                            <p className="text-2xl font-bold text-red-900 mt-2">
                                {stats.overview?.failed?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-600">Need attention</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filters
                    </h3>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instance</label>
                        <select
                            value={filters.instanceId}
                            onChange={(e) => setFilters({ ...filters, instanceId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Instances</option>
                            {instances.map((instance) => (
                                <option key={instance._id} value={instance._id}>{instance.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                        <select
                            value={filters.direction}
                            onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Directions</option>
                            <option value="incoming">Incoming</option>
                            <option value="outgoing">Outgoing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="delivered">Delivered</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message Type</label>
                        <select
                            value={filters.messageType}
                            onChange={(e) => setFilters({ ...filters, messageType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={filters.phoneNumber}
                                onChange={(e) => setFilters({ ...filters, phoneNumber: e.target.value })}
                                placeholder="Search by phone number"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={applyFilters}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center space-x-2"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Apply Filters</span>
                    </button>
                </div>
            </div>

            {/* Messages Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Message History</h3>
                        <span className="text-sm text-gray-600">
                            Showing {messages.length} of {pagination.total} messages
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Reply</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No messages found matching your criteria</p>
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(msg.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {msg.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDirectionColor(msg.direction)}`}>
                                                {msg.direction}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                            {msg.messageType}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                            <div className="truncate" title={msg.content}>
                                                {msg.content.length > 50 ? `${msg.content.substring(0, 50)}...` : msg.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(msg.status)}`}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {msg.isAutoReply ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No</span>
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
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Page {pagination.current} of {pagination.pages}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => fetchMessages(pagination.current - 1)}
                                    disabled={pagination.current <= 1}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchMessages(pagination.current + 1)}
                                    disabled={pagination.current >= pagination.pages}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Daily Trend Chart */}
            {stats.daily && stats.daily.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Daily Message Trend
                    </h3>
                    <div className="space-y-3">
                        {stats.daily.slice(-7).map((day, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 w-24">{day.date}</span>
                                <div className="flex-1 mx-4">
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(day.total / Math.max(...stats.daily.map(d => d.total))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-gray-900 w-16 text-right">
                                    {day.total}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageReportsTab;