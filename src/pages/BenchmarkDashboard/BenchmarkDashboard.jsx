import React, { useState, useEffect } from 'react';
import { base_url } from '../../../utils/base_url';

const BenchmarkDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({});
    const [filters, setFilters] = useState({
        endpoint: '',
        userId: '',
        status: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const API_BASE_URL = base_url;

    // Fetch logs with filters
    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.endpoint) params.append('endpoint', filters.endpoint);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.status) params.append('status', filters.status);

            const response = await fetch(`${API_BASE_URL}/api/benchmark/logs?${params}`);
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
        setIsLoading(false);
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/benchmark/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Test API endpoints
    const testEndpoint = async (endpoint, method = 'GET', userId = 'test-user') => {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                }
            };

            if (method === 'POST') {
                options.body = JSON.stringify({ name: 'Test User', email: 'test@example.com' });
            }

            await fetch(`${API_BASE_URL}${endpoint}`, options);
        } catch (error) {
            // Expected for some test endpoints (like 404s)
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({ endpoint: '', userId: '', status: '' });
    };

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    // Get status color
    const getStatusColor = (status) => {
        return status === 'Success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    };

    // Get response time color
    const getResponseTimeColor = (time) => {
        if (time < 200) return 'text-green-600';
        if (time < 500) return 'text-yellow-600';
        return 'text-red-600';
    };

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [filters]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchLogs();
                fetchStats();
            }, 3000); // Refresh every 3 seconds

            return () => clearInterval(interval);
        }
    }, [autoRefresh, filters]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">API Benchmark Dashboard</h1>
                    <p className="text-gray-600">Monitor and analyze API performance in real-time</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Requests</h3>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalRequests || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Success Rate</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {stats.totalRequests ? Math.round((stats.successRequests / stats.totalRequests) * 100) : 0}%
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Response Time</h3>
                        <p className="text-2xl font-bold text-blue-600">{Math.round(stats.avgResponseTime || 0)}ms</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Error Requests</h3>
                        <p className="text-2xl font-bold text-red-600">{stats.errorRequests || 0}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Endpoint</label>
                            <input
                                type="text"
                                value={filters.endpoint}
                                onChange={(e) => handleFilterChange('endpoint', e.target.value)}
                                placeholder="e.g., /api/users"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1 min-w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by User ID</label>
                            <input
                                type="text"
                                value={filters.userId}
                                onChange={(e) => handleFilterChange('userId', e.target.value)}
                                placeholder="e.g., user123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1 min-w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="Success">Success</option>
                                <option value="Error">Error</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-md transition-colors ${autoRefresh
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                        </button>
                        <button
                            onClick={() => { fetchLogs(); fetchStats(); }}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh Now'}
                        </button>
                    </div>

                    {/* Test Buttons */}
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Test API Endpoints:</h4>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => testEndpoint('/users')}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                                GET /users
                            </button>
                            <button
                                onClick={() => testEndpoint('/users/1')}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                                GET /users/1
                            </button>
                            <button
                                onClick={() => testEndpoint('/users/999')}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                                GET /users/999 (404)
                            </button>
                            <button
                                onClick={() => testEndpoint('/users', 'POST')}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                            >
                                POST /users
                            </button>
                            <button
                                onClick={() => testEndpoint('/products')}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                                GET /products
                            </button>
                            <button
                                onClick={() => testEndpoint('/orders')}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                                GET /orders (random error)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent API Calls</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Route
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Response Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-wrap text-sm font-mono text-gray-900">
                                            {log.route}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                                    log.method === 'POST' ? 'bg-green-100 text-green-800' :
                                                        log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getResponseTimeColor(log.responseTime)}`}>
                                            {log.responseTime}ms
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                                {log.status} ({log.statusCode})
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {log.userId?._id}<br/>
                                            {log.userId?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {logs.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No API logs found. {isLoading ? 'Loading...' : 'Try testing some endpoints above.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkDashboard;