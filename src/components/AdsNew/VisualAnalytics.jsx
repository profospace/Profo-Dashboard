// import React, { useState, useEffect } from 'react';
// import { BarChart3, PieChart, Calendar, TrendingUp, Eye, MousePointer, Users, MapPin, Filter } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

// const VisualAnalytics = ({ base_url, getAuthConfig }) => {
//     const [ads, setAds] = useState([]);
//     const [analyticsData, setAnalyticsData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [dateRange, setDateRange] = useState({
//         startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//         endDate: new Date().toISOString().split('T')[0]
//     });
//     const [selectedCategory, setSelectedCategory] = useState('all');
//     const [viewType, setViewType] = useState('overview');

//     const COLORS = {
//         BANNER: '#3b82f6',
//         POPUP: '#8b5cf6',
//         INTERSTITIAL: '#f59e0b',
//         NATIVE: '#10b981',
//         VIDEO: '#ef4444'
//     };

//     useEffect(() => {
//         fetchAnalyticsData();
//     }, [dateRange, selectedCategory]);

//     const fetchAnalyticsData = async () => {
//         try {
//             setLoading(true);

//             // Fetch all ads
//             const adsResponse = await fetch(`${base_url}/api/ads?limit=1000`, getAuthConfig());
//             const adsData = await adsResponse.json();

//             if (adsData.success) {
//                 const allAds = adsData.ads;
//                 setAds(allAds);

//                 // Process analytics data
//                 const processedData = await processAnalyticsData(allAds);
//                 setAnalyticsData(processedData);
//             }
//         } catch (error) {
//             console.error('Error fetching analytics data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const processAnalyticsData = async (allAds) => {
//         const filteredAds = selectedCategory === 'all'
//             ? allAds
//             : allAds.filter(ad => ad.type === selectedCategory);

//         // Category breakdown
//         const categoryBreakdown = {};
//         const locationData = [];
//         const performanceOverTime = {};
//         const statusBreakdown = { active: 0, inactive: 0 };

//         // Process each ad
//         for (const ad of filteredAds) {
//             // Category breakdown
//             if (!categoryBreakdown[ad.type]) {
//                 categoryBreakdown[ad.type] = {
//                     count: 0,
//                     impressions: 0,
//                     clicks: 0,
//                     conversions: 0,
//                     totalBudget: 0,
//                     spent: 0
//                 };
//             }

//             categoryBreakdown[ad.type].count++;
//             categoryBreakdown[ad.type].impressions += ad.analytics?.impressions || 0;
//             categoryBreakdown[ad.type].clicks += ad.analytics?.clicks || 0;
//             categoryBreakdown[ad.type].conversions += ad.analytics?.conversions || 0;
//             categoryBreakdown[ad.type].totalBudget += ad.budget?.total || 0;
//             categoryBreakdown[ad.type].spent += ad.budget?.spent || 0;

//             // Status breakdown
//             if (ad.isActive) {
//                 statusBreakdown.active++;
//             } else {
//                 statusBreakdown.inactive++;
//             }

//             // Location data for ads with location targeting
//             if (ad.locationTargeting?.isLocationBased && ad.locationTargeting.center) {
//                 locationData.push({
//                     id: ad.adId,
//                     name: ad.name,
//                     type: ad.type,
//                     lat: ad.locationTargeting.center.latitude,
//                     lng: ad.locationTargeting.center.longitude,
//                     radius: ad.locationTargeting.radius,
//                     impressions: ad.analytics?.impressions || 0,
//                     clicks: ad.analytics?.clicks || 0,
//                     isActive: ad.isActive
//                 });
//             }

//             // Try to fetch detailed analytics for performance over time
//             try {
//                 const analyticsResponse = await fetch(
//                     `${base_url}/api/ads/${ad.adId}/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
//                     getAuthConfig()
//                 );
//                 const detailedAnalytics = await analyticsResponse.json();

//                 if (detailedAnalytics.success && detailedAnalytics.analytics?.detailed?.interactionsByDate) {
//                     Object.entries(detailedAnalytics.analytics.detailed.interactionsByDate).forEach(([date, data]) => {
//                         if (!performanceOverTime[date]) {
//                             performanceOverTime[date] = {
//                                 date,
//                                 impressions: 0,
//                                 clicks: 0,
//                                 conversions: 0
//                             };
//                         }
//                         performanceOverTime[date].impressions += data.impressions || 0;
//                         performanceOverTime[date].clicks += data.clicks || 0;
//                         performanceOverTime[date].conversions += data.conversions || 0;
//                     });
//                 }
//             } catch (error) {
//                 console.log(`Could not fetch analytics for ad ${ad.adId}`);
//             }
//         }

//         // Convert category breakdown to chart format
//         const categoryChartData = Object.entries(categoryBreakdown).map(([type, data]) => ({
//             name: type,
//             count: data.count,
//             impressions: data.impressions,
//             clicks: data.clicks,
//             conversions: data.conversions,
//             ctr: data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) : 0,
//             totalBudget: data.totalBudget,
//             spent: data.spent,
//             color: COLORS[type]
//         }));

//         // Convert performance over time to chart format
//         const performanceChartData = Object.values(performanceOverTime)
//             .sort((a, b) => new Date(a.date) - new Date(b.date))
//             .map(item => ({
//                 ...item,
//                 ctr: item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : 0
//             }));

//         // Calculate totals
//         const totals = {
//             totalAds: filteredAds.length,
//             totalImpressions: categoryChartData.reduce((sum, item) => sum + item.impressions, 0),
//             totalClicks: categoryChartData.reduce((sum, item) => sum + item.clicks, 0),
//             totalConversions: categoryChartData.reduce((sum, item) => sum + item.conversions, 0),
//             totalBudget: categoryChartData.reduce((sum, item) => sum + item.totalBudget, 0),
//             totalSpent: categoryChartData.reduce((sum, item) => sum + item.spent, 0),
//             averageCTR: 0
//         };

//         totals.averageCTR = totals.totalImpressions > 0
//             ? ((totals.totalClicks / totals.totalImpressions) * 100).toFixed(2)
//             : 0;

//         return {
//             categoryBreakdown: categoryChartData,
//             performanceOverTime: performanceChartData,
//             locationData,
//             statusBreakdown,
//             totals,
//             filteredAds
//         };
//     };

//     const renderOverviewCharts = () => (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Category Breakdown - Bar Chart */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                     <BarChart3 size={20} className="mr-2" />
//                     Ads by Category
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={analyticsData?.categoryBreakdown || []}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="count" fill="#3b82f6" name="Ad Count" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* Performance Pie Chart */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                     <PieChart size={20} className="mr-2" />
//                     Impressions by Category
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <RechartsPieChart>
//                         <RechartsPieChart data={analyticsData?.categoryBreakdown || []}>
//                             {analyticsData?.categoryBreakdown?.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                         </RechartsPieChart>
//                         <Tooltip formatter={(value) => [value.toLocaleString(), 'Impressions']} />
//                         <Legend />
//                     </RechartsPieChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );

//     const renderPerformanceCharts = () => (
//         <div className="space-y-6">
//             {/* Performance Over Time */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                     <TrendingUp size={20} className="mr-2" />
//                     Performance Over Time
//                 </h3>
//                 <ResponsiveContainer width="100%" height={400}>
//                     <AreaChart data={analyticsData?.performanceOverTime || []}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fill="#93c5fd" name="Impressions" />
//                         <Area type="monotone" dataKey="clicks" stroke="#10b981" fill="#86efac" name="Clicks" />
//                     </AreaChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* CTR Trend */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Click-Through Rate Trend</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={analyticsData?.performanceOverTime || []}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" />
//                         <YAxis />
//                         <Tooltip formatter={(value) => [`${value}%`, 'CTR']} />
//                         <Line type="monotone" dataKey="ctr" stroke="#f59e0b" strokeWidth={3} name="CTR %" />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );

//     const renderDetailedAnalytics = () => (
//         <div className="space-y-6">
//             {/* Detailed Category Performance */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Category Performance</h3>
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="border-b">
//                                 <th className="text-left py-2">Category</th>
//                                 <th className="text-right py-2">Ads</th>
//                                 <th className="text-right py-2">Impressions</th>
//                                 <th className="text-right py-2">Clicks</th>
//                                 <th className="text-right py-2">CTR</th>
//                                 <th className="text-right py-2">Budget</th>
//                                 <th className="text-right py-2">Spent</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {analyticsData?.categoryBreakdown?.map((category) => (
//                                 <tr key={category.name} className="border-b">
//                                     <td className="py-3">
//                                         <div className="flex items-center">
//                                             <div
//                                                 className="w-4 h-4 rounded mr-2"
//                                                 style={{ backgroundColor: category.color }}
//                                             ></div>
//                                             {category.name}
//                                         </div>
//                                     </td>
//                                     <td className="text-right py-3">{category.count}</td>
//                                     <td className="text-right py-3">{category.impressions.toLocaleString()}</td>
//                                     <td className="text-right py-3">{category.clicks.toLocaleString()}</td>
//                                     <td className="text-right py-3">{category.ctr}%</td>
//                                     <td className="text-right py-3">${category.totalBudget.toFixed(2)}</td>
//                                     <td className="text-right py-3">${category.spent.toFixed(2)}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Location Performance */}
//             {analyticsData?.locationData?.length > 0 && (
//                 <div className="bg-white p-6 rounded-xl border border-gray-200">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                         <MapPin size={20} className="mr-2" />
//                         Location-Based Ads Performance
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {analyticsData.locationData.map((location) => (
//                             <div key={location.id} className="border rounded-lg p-4">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <h4 className="font-medium text-gray-900 truncate">{location.name}</h4>
//                                     <span className={`px-2 py-1 text-xs rounded ${location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                         {location.isActive ? 'Active' : 'Inactive'}
//                                     </span>
//                                 </div>
//                                 <div className="text-sm text-gray-600 space-y-1">
//                                     <p>Type: {location.type}</p>
//                                     <p>Radius: {location.radius} km</p>
//                                     <p>Impressions: {location.impressions.toLocaleString()}</p>
//                                     <p>Clicks: {location.clicks.toLocaleString()}</p>
//                                     <p className="text-xs text-gray-500">
//                                         Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     const StatCard = ({ title, value, icon: Icon, color, change }) => (
//         <div className="bg-white p-6 rounded-xl border border-gray-200">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-sm font-medium text-gray-600">{title}</p>
//                     <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//                     {change && (
//                         <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                             {change >= 0 ? '+' : ''}{change}% vs last period
//                         </p>
//                     )}
//                 </div>
//                 <div className={`p-3 rounded-full ${color}`}>
//                     <Icon size={24} className="text-white" />
//                 </div>
//             </div>
//         </div>
//     );

//     if (loading) {
//         return (
//             <div className="p-6">
//                 <div className="animate-pulse space-y-6">
//                     <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {[1, 2, 3, 4].map((i) => (
//                             <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
//                         ))}
//                     </div>
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {[1, 2].map((i) => (
//                             <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Visual Analytics</h2>
//                 <p className="text-gray-600">Comprehensive visual insights into your advertising campaigns</p>
//             </div>

//             {/* Filters */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
//                 <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
//                     <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <input
//                                     type="date"
//                                     value={dateRange.startDate}
//                                     onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//                                     className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                                 <input
//                                     type="date"
//                                     value={dateRange.endDate}
//                                     onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//                                     className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                             <select
//                                 value={selectedCategory}
//                                 onChange={(e) => setSelectedCategory(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="all">All Categories</option>
//                                 <option value="BANNER">Banner</option>
//                                 <option value="POPUP">Popup</option>
//                                 <option value="INTERSTITIAL">Interstitial</option>
//                                 <option value="NATIVE">Native</option>
//                                 <option value="VIDEO">Video</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
//                             <select
//                                 value={viewType}
//                                 onChange={(e) => setViewType(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="overview">Overview</option>
//                                 <option value="performance">Performance Trends</option>
//                                 <option value="detailed">Detailed Analytics</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Summary Stats */}
//             {analyticsData && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <StatCard
//                         title="Total Ads"
//                         value={analyticsData.totals.totalAds}
//                         icon={BarChart3}
//                         color="bg-blue-500"
//                     />
//                     <StatCard
//                         title="Total Impressions"
//                         value={analyticsData.totals.totalImpressions.toLocaleString()}
//                         icon={Eye}
//                         color="bg-green-500"
//                     />
//                     <StatCard
//                         title="Total Clicks"
//                         value={analyticsData.totals.totalClicks.toLocaleString()}
//                         icon={MousePointer}
//                         color="bg-purple-500"
//                     />
//                     <StatCard
//                         title="Average CTR"
//                         value={`${analyticsData.totals.averageCTR}%`}
//                         icon={TrendingUp}
//                         color="bg-orange-500"
//                     />
//                 </div>
//             )}

//             {/* Charts based on view type */}
//             {analyticsData && (
//                 <div>
//                     {viewType === 'overview' && renderOverviewCharts()}
//                     {viewType === 'performance' && renderPerformanceCharts()}
//                     {viewType === 'detailed' && renderDetailedAnalytics()}
//                 </div>
//             )}

//             {!analyticsData && !loading && (
//                 <div className="text-center py-12">
//                     <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
//                     <p className="text-gray-500">No analytics data available</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VisualAnalytics;


import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, PieChart, Calendar, TrendingUp, Eye, MousePointer, Users, MapPin, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const VisualAnalytics = ({ base_url, getAuthConfig }) => {
    const [ads, setAds] = useState([]);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewType, setViewType] = useState('overview');
    const [showActiveOnly, setShowActiveOnly] = useState(true);
    const [selectedMapAd, setSelectedMapAd] = useState(null);

    // Google Maps refs
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markersRef = useRef([]);

    const COLORS = {
        BANNER: '#3b82f6',
        POPUP: '#8b5cf6',
        INTERSTITIAL: '#f59e0b',
        NATIVE: '#10b981',
        VIDEO: '#ef4444'
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [dateRange, selectedCategory]);

    useEffect(() => {
        if (viewType === 'map' && analyticsData?.locationData) {
            initializeGoogleMap();
        }
    }, [viewType, analyticsData, selectedCategory, showActiveOnly]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);

            // Fetch all ads
            const adsResponse = await fetch(`${base_url}/api/ads?limit=1000`, getAuthConfig());
            const adsData = await adsResponse.json();

            if (adsData.success) {
                const allAds = adsData.ads;
                setAds(allAds);

                // Process analytics data
                const processedData = await processAnalyticsData(allAds);
                setAnalyticsData(processedData);
            }
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processAnalyticsData = async (allAds) => {
        const filteredAds = selectedCategory === 'all'
            ? allAds
            : allAds.filter(ad => ad.type === selectedCategory);

        // Category breakdown
        const categoryBreakdown = {};
        const locationData = [];
        const performanceOverTime = {};
        const statusBreakdown = { active: 0, inactive: 0 };

        // Process each ad
        for (const ad of filteredAds) {
            // Category breakdown
            if (!categoryBreakdown[ad.type]) {
                categoryBreakdown[ad.type] = {
                    count: 0,
                    impressions: 0,
                    clicks: 0,
                    conversions: 0,
                    totalBudget: 0,
                    spent: 0
                };
            }

            categoryBreakdown[ad.type].count++;
            categoryBreakdown[ad.type].impressions += ad.analytics?.impressions || 0;
            categoryBreakdown[ad.type].clicks += ad.analytics?.clicks || 0;
            categoryBreakdown[ad.type].conversions += ad.analytics?.conversions || 0;
            categoryBreakdown[ad.type].totalBudget += ad.budget?.total || 0;
            categoryBreakdown[ad.type].spent += ad.budget?.spent || 0;

            // Status breakdown
            if (ad.isActive) {
                statusBreakdown.active++;
            } else {
                statusBreakdown.inactive++;
            }

            // Location data for ads with location targeting
            if (ad.locationTargeting?.isLocationBased && ad.locationTargeting.center) {
                locationData.push({
                    id: ad.adId,
                    name: ad.name,
                    type: ad.type,
                    lat: ad.locationTargeting.center.latitude,
                    lng: ad.locationTargeting.center.longitude,
                    radius: ad.locationTargeting.radius,
                    impressions: ad.analytics?.impressions || 0,
                    clicks: ad.analytics?.clicks || 0,
                    isActive: ad.isActive,
                    scheduling: ad.scheduling
                });
            }

            // Try to fetch detailed analytics for performance over time
            try {
                const analyticsResponse = await fetch(
                    `${base_url}/api/ads/${ad.adId}/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                    getAuthConfig()
                );
                const detailedAnalytics = await analyticsResponse.json();

                if (detailedAnalytics.success && detailedAnalytics.analytics?.detailed?.interactionsByDate) {
                    Object.entries(detailedAnalytics.analytics.detailed.interactionsByDate).forEach(([date, data]) => {
                        if (!performanceOverTime[date]) {
                            performanceOverTime[date] = {
                                date,
                                impressions: 0,
                                clicks: 0,
                                conversions: 0
                            };
                        }
                        performanceOverTime[date].impressions += data.impressions || 0;
                        performanceOverTime[date].clicks += data.clicks || 0;
                        performanceOverTime[date].conversions += data.conversions || 0;
                    });
                }
            } catch (error) {
                console.log(`Could not fetch analytics for ad ${ad.adId}`);
            }
        }

        // Convert category breakdown to chart format
        const categoryChartData = Object.entries(categoryBreakdown).map(([type, data]) => ({
            name: type,
            count: data.count,
            impressions: data.impressions,
            clicks: data.clicks,
            conversions: data.conversions,
            ctr: data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) : 0,
            totalBudget: data.totalBudget,
            spent: data.spent,
            color: COLORS[type]
        }));

        // Convert performance over time to chart format
        const performanceChartData = Object.values(performanceOverTime)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(item => ({
                ...item,
                ctr: item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) : 0
            }));

        // Calculate totals
        const totals = {
            totalAds: filteredAds.length,
            totalImpressions: categoryChartData.reduce((sum, item) => sum + item.impressions, 0),
            totalClicks: categoryChartData.reduce((sum, item) => sum + item.clicks, 0),
            totalConversions: categoryChartData.reduce((sum, item) => sum + item.conversions, 0),
            totalBudget: categoryChartData.reduce((sum, item) => sum + item.totalBudget, 0),
            totalSpent: categoryChartData.reduce((sum, item) => sum + item.spent, 0),
            averageCTR: 0
        };

        totals.averageCTR = totals.totalImpressions > 0
            ? ((totals.totalClicks / totals.totalImpressions) * 100).toFixed(2)
            : 0;

        return {
            categoryBreakdown: categoryChartData,
            performanceOverTime: performanceChartData,
            locationData,
            statusBreakdown,
            totals,
            filteredAds
        };
    };

    const initializeGoogleMap = () => {
        if (!window.google) {
            loadGoogleMapsScript();
            return;
        }

        if (!mapRef.current) return;

        // Initialize Google Map
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 26.8467, lng: 80.9462 }, // Default to Lucknow
            zoom: 10,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        googleMapRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(({ marker, circle }) => {
            marker.setMap(null);
            circle.setMap(null);
        });
        markersRef.current = [];

        // Filter ads based on current filters
        const filteredLocationData = analyticsData.locationData.filter(ad => {
            const categoryMatch = selectedCategory === 'all' || ad.type === selectedCategory;
            const statusMatch = !showActiveOnly || ad.isActive;
            const dateMatch = isAdActiveInDateRange(ad);
            return categoryMatch && statusMatch && dateMatch;
        });

        // Add markers for each ad
        filteredLocationData.forEach(ad => {
            addAdMarker(map, ad);
        });

        // Fit bounds to show all markers
        if (filteredLocationData.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            filteredLocationData.forEach(ad => {
                bounds.extend(new window.google.maps.LatLng(ad.lat, ad.lng));
            });
            map.fitBounds(bounds);
        }
    };

    const loadGoogleMapsScript = () => {
        if (window.google) return;

        const script = document.createElement('script');
        // Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleMap;
        document.head.appendChild(script);
    };

    const addAdMarker = (map, ad) => {
        const position = { lat: ad.lat, lng: ad.lng };

        // Create custom marker icon based on ad type
        const markerIcon = {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: COLORS[ad.type],
            fillOpacity: ad.isActive ? 0.9 : 0.5,
            strokeColor: '#ffffff',
            strokeWeight: 2
        };

        const marker = new window.google.maps.Marker({
            position: position,
            map: map,
            icon: markerIcon,
            title: ad.name
        });

        // Create radius circle
        const circle = new window.google.maps.Circle({
            strokeColor: COLORS[ad.type],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: COLORS[ad.type],
            fillOpacity: 0.15,
            map: map,
            center: position,
            radius: ad.radius * 1000 // Convert km to meters
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
            content: createMarkerInfoContent(ad)
        });

        marker.addListener('click', () => {
            // Close any open info windows
            markersRef.current.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });

            infoWindow.open(map, marker);
            setSelectedMapAd(ad);
        });

        // Store marker and circle references
        markersRef.current.push({ marker, circle, infoWindow });
    };

    const createMarkerInfoContent = (ad) => {
        const performanceData = getAdPerformanceInDateRange(ad);
        return `
            <div style="padding: 8px; min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${ad.name}</h4>
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; width: 12px; height: 12px; background-color: ${COLORS[ad.type]}; border-radius: 50%; margin-right: 6px;"></span>
                    <span style="font-size: 14px; color: #374151;">${ad.type}</span>
                </div>
                <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
                    <div><strong>Status:</strong> <span style="color: ${ad.isActive ? '#10b981' : '#ef4444'}">${ad.isActive ? 'Active' : 'Inactive'}</span></div>
                    <div><strong>Radius:</strong> ${ad.radius} km</div>
                    <div><strong>Impressions:</strong> ${performanceData.impressions.toLocaleString()}</div>
                    <div><strong>Clicks:</strong> ${performanceData.clicks.toLocaleString()}</div>
                    <div><strong>CTR:</strong> ${performanceData.ctr}%</div>
                    ${ad.scheduling?.isScheduled ? `
                        <div style="margin-top: 4px; font-size: 11px;">
                            <strong>Schedule:</strong><br>
                            ${new Date(ad.scheduling.startDate).toLocaleDateString()} - 
                            ${new Date(ad.scheduling.endDate).toLocaleDateString()}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    const isAdActiveInDateRange = (ad) => {
        if (!ad.scheduling?.isScheduled) return true;

        const adStart = new Date(ad.scheduling.startDate);
        const adEnd = new Date(ad.scheduling.endDate);
        const rangeStart = new Date(dateRange.startDate);
        const rangeEnd = new Date(dateRange.endDate);

        // Check if ad schedule overlaps with selected date range
        return !(adEnd < rangeStart || adStart > rangeEnd);
    };

    const getAdPerformanceInDateRange = (ad) => {
        // Calculate performance metrics for the selected date range
        const impressions = ad.impressions || 0;
        const clicks = ad.clicks || 0;
        const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';

        return { impressions, clicks, ctr };
    };

    const renderMapView = () => (
        <div className="space-y-6">
            {/* Map Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showActiveOnly"
                                checked={showActiveOnly}
                                onChange={(e) => setShowActiveOnly(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showActiveOnly" className="text-sm font-medium text-gray-700">
                                Show Active Ads Only
                            </label>
                        </div>

                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="BANNER">Banner</option>
                                <option value="POPUP">Popup</option>
                                <option value="INTERSTITIAL">Interstitial</option>
                                <option value="NATIVE">Native</option>
                                <option value="VIDEO">Video</option>
                            </select>
                        </div>
                    </div>

                    {/* Map Legend */}
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(COLORS).map(([type, color]) => (
                            <div key={type} className="flex items-center space-x-1">
                                <div
                                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                                    style={{ backgroundColor: color }}
                                ></div>
                                <span className="text-xs text-gray-600">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPin size={20} className="mr-2" />
                        Ads Location Map
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({analyticsData?.locationData?.filter(ad => {
                                const categoryMatch = selectedCategory === 'all' || ad.type === selectedCategory;
                                const statusMatch = !showActiveOnly || ad.isActive;
                                return categoryMatch && statusMatch;
                            }).length || 0} ads shown)
                        </span>
                    </h3>
                </div>
                <div
                    ref={mapRef}
                    className="w-full"
                    style={{ height: '600px' }}
                />
            </div>

            {/* Map Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Location Coverage</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Locations:</span>
                            <span className="font-medium">{analyticsData?.locationData?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Active Ads:</span>
                            <span className="font-medium text-green-600">
                                {analyticsData?.locationData?.filter(ad => ad.isActive).length || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Inactive Ads:</span>
                            <span className="font-medium text-red-600">
                                {analyticsData?.locationData?.filter(ad => !ad.isActive).length || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Performance by Location</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Impressions:</span>
                            <span className="font-medium">
                                {analyticsData?.locationData?.reduce((sum, ad) => sum + (ad.impressions || 0), 0).toLocaleString() || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Clicks:</span>
                            <span className="font-medium">
                                {analyticsData?.locationData?.reduce((sum, ad) => sum + (ad.clicks || 0), 0).toLocaleString() || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg. CTR:</span>
                            <span className="font-medium">
                                {(() => {
                                    const totalImpressions = analyticsData?.locationData?.reduce((sum, ad) => sum + (ad.impressions || 0), 0) || 0;
                                    const totalClicks = analyticsData?.locationData?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0;
                                    return totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) + '%' : '0.00%';
                                })()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Category Distribution</h4>
                    <div className="space-y-2">
                        {Object.keys(COLORS).map(type => {
                            const count = analyticsData?.locationData?.filter(ad => ad.type === type).length || 0;
                            const percentage = analyticsData?.locationData?.length > 0
                                ? ((count / analyticsData.locationData.length) * 100).toFixed(1)
                                : 0;
                            return (
                                <div key={type} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[type] }}
                                        ></div>
                                        <span className="text-sm text-gray-600">{type}:</span>
                                    </div>
                                    <span className="text-sm font-medium">{count} ({percentage}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selected Ad Details */}
            {selectedMapAd && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Selected Ad Details</h4>
                        <button
                            onClick={() => setSelectedMapAd(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-medium text-gray-900 mb-3">Basic Information</h5>
                            <div className="space-y-2 text-sm">
                                <div><strong>Name:</strong> {selectedMapAd.name}</div>
                                <div><strong>Type:</strong> {selectedMapAd.type}</div>
                                <div><strong>Status:</strong>
                                    <span className={`ml-1 px-2 py-1 rounded text-xs ${selectedMapAd.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {selectedMapAd.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div><strong>Location:</strong> {selectedMapAd.lat.toFixed(4)}, {selectedMapAd.lng.toFixed(4)}</div>
                                <div><strong>Radius:</strong> {selectedMapAd.radius} km</div>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-medium text-gray-900 mb-3">Performance Metrics</h5>
                            <div className="space-y-2 text-sm">
                                <div><strong>Impressions:</strong> {(selectedMapAd.impressions || 0).toLocaleString()}</div>
                                <div><strong>Clicks:</strong> {(selectedMapAd.clicks || 0).toLocaleString()}</div>
                                <div><strong>CTR:</strong> {getAdPerformanceInDateRange(selectedMapAd).ctr}%</div>
                                {selectedMapAd.scheduling?.isScheduled && (
                                    <div>
                                        <strong>Schedule:</strong><br />
                                        <span className="text-xs text-gray-600">
                                            {new Date(selectedMapAd.scheduling.startDate).toLocaleDateString()} -
                                            {new Date(selectedMapAd.scheduling.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderOverviewCharts = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown - Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 size={20} className="mr-2" />
                    Ads by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData?.categoryBreakdown || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" name="Ad Count" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Performance Pie Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart size={20} className="mr-2" />
                    Impressions by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                        <RechartsPieChart data={analyticsData?.categoryBreakdown || []}>
                            {analyticsData?.categoryBreakdown?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </RechartsPieChart>
                        <Tooltip formatter={(value) => [value.toLocaleString(), 'Impressions']} />
                        <Legend />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderPerformanceCharts = () => (
        <div className="space-y-6">
            {/* Performance Over Time */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp size={20} className="mr-2" />
                    Performance Over Time
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analyticsData?.performanceOverTime || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fill="#93c5fd" name="Impressions" />
                        <Area type="monotone" dataKey="clicks" stroke="#10b981" fill="#86efac" name="Clicks" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* CTR Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Click-Through Rate Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData?.performanceOverTime || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'CTR']} />
                        <Line type="monotone" dataKey="ctr" stroke="#f59e0b" strokeWidth={3} name="CTR %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderDetailedAnalytics = () => (
        <div className="space-y-6">
            {/* Detailed Category Performance */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Category Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Category</th>
                                <th className="text-right py-2">Ads</th>
                                <th className="text-right py-2">Impressions</th>
                                <th className="text-right py-2">Clicks</th>
                                <th className="text-right py-2">CTR</th>
                                <th className="text-right py-2">Budget</th>
                                <th className="text-right py-2">Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData?.categoryBreakdown?.map((category) => (
                                <tr key={category.name} className="border-b">
                                    <td className="py-3">
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded mr-2"
                                                style={{ backgroundColor: category.color }}
                                            ></div>
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="text-right py-3">{category.count}</td>
                                    <td className="text-right py-3">{category.impressions.toLocaleString()}</td>
                                    <td className="text-right py-3">{category.clicks.toLocaleString()}</td>
                                    <td className="text-right py-3">{category.ctr}%</td>
                                    <td className="text-right py-3">${category.totalBudget.toFixed(2)}</td>
                                    <td className="text-right py-3">${category.spent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Location Performance */}
            {analyticsData?.locationData?.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin size={20} className="mr-2" />
                        Location-Based Ads Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analyticsData.locationData.map((location) => (
                            <div key={location.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 truncate">{location.name}</h4>
                                    <span className={`px-2 py-1 text-xs rounded ${location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {location.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Type: {location.type}</p>
                                    <p>Radius: {location.radius} km</p>
                                    <p>Impressions: {location.impressions.toLocaleString()}</p>
                                    <p>Clicks: {location.clicks.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">
                                        Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const StatCard = ({ title, value, icon: Icon, color, change }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change}% vs last period
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
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Visual Analytics</h2>
                <p className="text-gray-600">Comprehensive visual insights into your advertising campaigns</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="BANNER">Banner</option>
                                <option value="POPUP">Popup</option>
                                <option value="INTERSTITIAL">Interstitial</option>
                                <option value="NATIVE">Native</option>
                                <option value="VIDEO">Video</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                            <select
                                value={viewType}
                                onChange={(e) => setViewType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="overview">Overview</option>
                                <option value="performance">Performance Trends</option>
                                <option value="detailed">Detailed Analytics</option>
                                <option value="map">Map View</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Ads"
                        value={analyticsData.totals.totalAds}
                        icon={BarChart3}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Impressions"
                        value={analyticsData.totals.totalImpressions.toLocaleString()}
                        icon={Eye}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Clicks"
                        value={analyticsData.totals.totalClicks.toLocaleString()}
                        icon={MousePointer}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Average CTR"
                        value={`${analyticsData.totals.averageCTR}%`}
                        icon={TrendingUp}
                        color="bg-orange-500"
                    />
                </div>
            )}

            {/* Charts based on view type */}
            {analyticsData && (
                <div>
                    {viewType === 'overview' && renderOverviewCharts()}
                    {viewType === 'performance' && renderPerformanceCharts()}
                    {viewType === 'detailed' && renderDetailedAnalytics()}
                    {viewType === 'map' && renderMapView()}
                </div>
            )}

            {!analyticsData && !loading && (
                <div className="text-center py-12">
                    <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No analytics data available</p>
                </div>
            )}
        </div>
    );
};

export default VisualAnalytics;