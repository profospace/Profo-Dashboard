import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, MousePointer, Users, TrendingUp, Calendar, Zap, Target } from 'lucide-react';

const Overview = ({ base_url, getAuthConfig }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('totalInteractions');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${base_url}/api/ads/stats/overview`, getAuthConfig());
            const result = await response.json();

            if (result.success) {
                setData(result.data || []);
            } else {
                setError(result.message || 'Failed to fetch overview data');
            }
        } catch (err) {
            console.error('Error fetching overview:', err);
            setError('Failed to fetch overview data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sortedData = [...data].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'name':
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
                break;
            case 'totalInteractions':
                aValue = a.interactionStats?.totalInteractions || 0;
                bValue = b.interactionStats?.totalInteractions || 0;
                break;
            case 'uniqueUsers':
                aValue = a.interactionStats?.uniqueUsers || 0;
                bValue = b.interactionStats?.uniqueUsers || 0;
                break;
            case 'recentInteractions':
                aValue = a.interactionStats?.recentInteractions || 0;
                bValue = b.interactionStats?.recentInteractions || 0;
                break;
            case 'ctr':
                aValue = a.interactionStats?.ctr || 0;
                bValue = b.interactionStats?.ctr || 0;
                break;
            case 'priority':
                aValue = a.priority || 0;
                bValue = b.priority || 0;
                break;
            default:
                aValue = a.createdAt || '';
                bValue = b.createdAt || '';
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const totalStats = data.reduce((acc, ad) => {
        const stats = ad.interactionStats || {};
        return {
            totalAds: acc.totalAds + 1,
            totalInteractions: acc.totalInteractions + (stats.totalInteractions || 0),
            totalUniqueUsers: acc.totalUniqueUsers + (stats.uniqueUsers || 0),
            totalRecentInteractions: acc.totalRecentInteractions + (stats.recentInteractions || 0),
            activeAds: acc.activeAds + (ad.isActive ? 1 : 0)
        };
    }, {
        totalAds: 0,
        totalInteractions: 0,
        totalUniqueUsers: 0,
        totalRecentInteractions: 0,
        activeAds: 0
    });

    const getAdTypeColor = (type) => {
        const colors = {
            BANNER: 'bg-blue-100 text-blue-800',
            POPUP: 'bg-purple-100 text-purple-800',
            INTERSTITIAL: 'bg-orange-100 text-orange-800',
            NATIVE: 'bg-green-100 text-green-800',
            VIDEO: 'bg-red-100 text-red-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getPerformanceLevel = (interactions) => {
        if (interactions >= 1000) return { level: 'High', color: 'text-green-600', icon: '🔥' };
        if (interactions >= 100) return { level: 'Medium', color: 'text-yellow-600', icon: '⚡' };
        if (interactions > 0) return { level: 'Low', color: 'text-blue-600', icon: '📈' };
        return { level: 'None', color: 'text-gray-500', icon: '💤' };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ads Overview</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchOverview}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ads Overview</h2>
                <p className="text-gray-600">Performance summary of all your advertising campaigns</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Ads</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStats.totalAds}</p>
                            <p className="text-sm text-green-600">{totalStats.activeAds} active</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStats.totalInteractions.toLocaleString()}</p>
                            <p className="text-sm text-blue-600">{totalStats.totalRecentInteractions} in 24h</p>
                        </div>
                        <Eye className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Unique Users</p>
                            <p className="text-2xl font-bold text-gray-900">{totalStats.totalUniqueUsers.toLocaleString()}</p>
                            <p className="text-sm text-purple-600">Reached</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {data.length > 0
                                    ? (data.reduce((acc, ad) => acc + (ad.interactionStats?.ctr || 0), 0) / data.length).toFixed(2)
                                    : 0}%
                            </p>
                            <p className="text-sm text-orange-600">Click rate</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="totalInteractions">Sort by Total Interactions</option>
                            <option value="uniqueUsers">Sort by Unique Users</option>
                            <option value="recentInteractions">Sort by Recent Activity</option>
                            <option value="ctr">Sort by CTR</option>
                            <option value="priority">Sort by Priority</option>
                            <option value="name">Sort by Name</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="desc">Highest First</option>
                            <option value="asc">Lowest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Ads Performance Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interactions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.map((ad) => {
                                const stats = ad.interactionStats || {};
                                const performance = getPerformanceLevel(stats.totalInteractions || 0);

                                return (
                                    <tr key={ad.adId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    Priority: {ad.priority || 1} • Created {formatDate(ad.createdAt)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAdTypeColor(ad.type)}`}>
                                                {ad.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {ad.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{performance.icon}</span>
                                                <span className={`text-sm font-medium ${performance.color}`}>
                                                    {performance.level}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {(stats.totalInteractions || 0).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1">
                                                <Users size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-900">
                                                    {(stats.uniqueUsers || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {(stats.ctr || 0).toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1">
                                                <Zap size={14} className="text-yellow-500" />
                                                <span className="text-sm text-gray-900">
                                                    {(stats.recentInteractions || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">last 24h</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {sortedData.length === 0 && (
                    <div className="text-center py-12">
                        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-2">No ads found</p>
                        <p className="text-sm text-gray-400">Create your first ad campaign to see performance data</p>
                    </div>
                )}
            </div>

            {/* Performance Insights */}
            {data.length > 0 && (
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-blue-900">Top Performer</span>
                            </div>
                            <p className="text-sm text-blue-800">
                                {sortedData[0]?.name} leads with {(sortedData[0]?.interactionStats?.totalInteractions || 0).toLocaleString()} interactions
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-900">Active Campaigns</span>
                            </div>
                            <p className="text-sm text-green-800">
                                {totalStats.activeAds} of {totalStats.totalAds} campaigns are currently active
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-purple-900">Audience Reach</span>
                            </div>
                            <p className="text-sm text-purple-800">
                                Reached {totalStats.totalUniqueUsers.toLocaleString()} unique users across all campaigns
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;