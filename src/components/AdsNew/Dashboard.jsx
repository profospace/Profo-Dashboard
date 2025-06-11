import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MousePointer, Eye, DollarSign, MapPin } from 'lucide-react';

const Dashboard = ({ base_url, getAuthConfig }) => {
    const [stats, setStats] = useState({
        totalAds: 0,
        activeAds: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalSpent: 0,
        ctr: 0
    });
    const [recentAds, setRecentAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all ads to calculate stats
            const response = await fetch(`${base_url}/api/ads?limit=100`, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                const ads = data.ads;

                // Calculate stats
                const totalImpressions = ads.reduce((sum, ad) => sum + (ad.analytics?.impressions || 0), 0);
                const totalClicks = ads.reduce((sum, ad) => sum + (ad.analytics?.clicks || 0), 0);
                const totalSpent = ads.reduce((sum, ad) => sum + (ad.budget?.spent || 0), 0);
                const activeAds = ads.filter(ad => ad.isActive).length;
                const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

                setStats({
                    totalAds: ads.length,
                    activeAds,
                    totalImpressions,
                    totalClicks,
                    totalSpent,
                    ctr
                });

                // Get recent ads (last 5)
                setRecentAds(ads.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, change }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change}% from last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Monitor your advertising performance and manage campaigns</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Ads"
                    value={stats.totalAds}
                    icon={TrendingUp}
                    color="bg-blue-500"
                    change={5}
                />
                <StatCard
                    title="Active Ads"
                    value={stats.activeAds}
                    icon={Users}
                    color="bg-green-500"
                    change={12}
                />
                <StatCard
                    title="Total Impressions"
                    value={stats.totalImpressions.toLocaleString()}
                    icon={Eye}
                    color="bg-purple-500"
                    change={8}
                />
                <StatCard
                    title="Total Clicks"
                    value={stats.totalClicks.toLocaleString()}
                    icon={MousePointer}
                    color="bg-orange-500"
                    change={15}
                />
                <StatCard
                    title="Click-Through Rate"
                    value={`${stats.ctr}%`}
                    icon={TrendingUp}
                    color="bg-indigo-500"
                    change={3}
                />
                <StatCard
                    title="Total Spent"
                    value={`$${stats.totalSpent.toFixed(2)}`}
                    icon={DollarSign}
                    color="bg-red-500"
                    change={-2}
                />
            </div>

            {/* Recent Ads */}
            <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Ads</h3>
                <div className="space-y-4">
                    {recentAds.map((ad) => (
                        <div key={ad.adId} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div className={`w-3 h-3 rounded-full ${ad.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{ad.name}</h4>
                                    <p className="text-sm text-gray-500">{ad.type?.type || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {ad.analytics?.impressions || 0} impressions
                                </p>
                                <p className="text-sm text-gray-500">
                                    {ad.analytics?.clicks || 0} clicks
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentAds.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No ads found. Create your first ad to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;