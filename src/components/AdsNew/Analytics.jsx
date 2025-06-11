import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointer, Users, Calendar } from 'lucide-react';

const Analytics = ({ base_url, getAuthConfig }) => {
    const [ads, setAds] = useState([]);
    const [selectedAd, setSelectedAd] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [overallStats, setOverallStats] = useState({
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        averageCTR: 0
    });

    useEffect(() => {
        fetchAds();
    }, []);

    useEffect(() => {
        if (selectedAd) {
            fetchAdAnalytics();
        }
    }, [selectedAd, dateRange]);

    const fetchAds = async () => {
        try {
            const response = await fetch(`${base_url}/api/ads?limit=100`, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setAds(data.ads);
                calculateOverallStats(data.ads);
                if (data.ads.length > 0 && !selectedAd) {
                    setSelectedAd(data.ads[0].adId);
                }
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    const fetchAdAnalytics = async () => {
        if (!selectedAd) return;

        try {
            setLoading(true);
            const url = `${base_url}/api/ads/${selectedAd}/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
            const response = await fetch(url, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallStats = (adsData) => {
        const stats = adsData.reduce((acc, ad) => {
            acc.totalImpressions += ad.analytics?.impressions || 0;
            acc.totalClicks += ad.analytics?.clicks || 0;
            acc.totalConversions += ad.analytics?.conversions || 0;
            return acc;
        }, { totalImpressions: 0, totalClicks: 0, totalConversions: 0 });

        stats.averageCTR = stats.totalImpressions > 0
            ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)
            : 0;

        setOverallStats(stats);
    };

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtext && (
                        <p className="text-sm text-gray-500 mt-1">{subtext}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Track performance and analyze your advertising campaigns</p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Impressions"
                    value={overallStats.totalImpressions.toLocaleString()}
                    icon={Eye}
                    color="bg-blue-500"
                    subtext="All campaigns"
                />
                <StatCard
                    title="Total Clicks"
                    value={overallStats.totalClicks.toLocaleString()}
                    icon={MousePointer}
                    color="bg-green-500"
                    subtext="All campaigns"
                />
                <StatCard
                    title="Total Conversions"
                    value={overallStats.totalConversions.toLocaleString()}
                    icon={TrendingUp}
                    color="bg-purple-500"
                    subtext="All campaigns"
                />
                <StatCard
                    title="Average CTR"
                    value={`${overallStats.averageCTR}%`}
                    icon={BarChart3}
                    color="bg-orange-500"
                    subtext="Click-through rate"
                />
            </div>

            {/* Ad Selection and Date Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Ad Campaign</label>
                        <select
                            value={selectedAd}
                            onChange={(e) => setSelectedAd(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select an ad...</option>
                            {ads.map((ad) => (
                                <option key={ad.adId} value={ad.adId}>
                                    {ad.name} ({ad.type?.type})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analytics */}
            {selectedAd && (
                <div className="space-y-6">
                    {loading ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : analytics ? (
                        <>
                            {/* Basic Analytics */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <Eye size={32} className="mx-auto text-blue-600 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{analytics.basic?.impressions || 0}</p>
                                        <p className="text-sm text-gray-600">Impressions</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <MousePointer size={32} className="mx-auto text-green-600 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{analytics.basic?.clicks || 0}</p>
                                        <p className="text-sm text-gray-600">Clicks</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <TrendingUp size={32} className="mx-auto text-purple-600 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{analytics.basic?.ctr?.toFixed(2) || 0}%</p>
                                        <p className="text-sm text-gray-600">Click-Through Rate</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Analytics */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Daily Performance */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Calendar size={20} className="mr-2" />
                                        Daily Performance
                                    </h3>
                                    {analytics.detailed?.interactionsByDate && Object.keys(analytics.detailed.interactionsByDate).length > 0 ? (
                                        <div className="space-y-3">
                                            {Object.entries(analytics.detailed.interactionsByDate)
                                                .sort(([a], [b]) => new Date(b) - new Date(a))
                                                .slice(0, 7)
                                                .map(([date, data]) => (
                                                    <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <span className="text-sm font-medium text-gray-900">{formatDate(date)}</span>
                                                        <div className="flex space-x-4 text-sm text-gray-600">
                                                            <span className="flex items-center">
                                                                <Eye size={14} className="mr-1" />
                                                                {data.impressions || 0}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <MousePointer size={14} className="mr-1" />
                                                                {data.clicks || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p>No daily performance data available for the selected period</p>
                                        </div>
                                    )}
                                </div>

                                {/* User Engagement */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Users size={20} className="mr-2" />
                                        User Engagement
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Unique Users</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {analytics.detailed?.uniqueUsers || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Total Impressions</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {analytics.detailed?.totalImpressions || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Total Clicks</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {analytics.detailed?.totalClicks || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Conversions</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {analytics.detailed?.totalConversions || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No analytics data available for this ad</p>
                        </div>
                    )}
                </div>
            )}

            {!selectedAd && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Select an ad campaign to view detailed analytics</p>
                </div>
            )}
        </div>
    );
};

export default Analytics;