// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { Eye, MousePointer, TrendingUp, Users, Calendar, Filter, Search, Download, RefreshCw, MapPin } from 'lucide-react';

// const Interactions = () => {
//     const [adId, setAdId] = useState('');
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [filters, setFilters] = useState({
//         interactionType: '',
//         startDate: '',
//         endDate: '',
//         page: 1,
//         limit: 20
//     });
//     const [searchTerm, setSearchTerm] = useState('');

//     // Mock data for demonstration
//     const mockData = {
//         ad: {
//             adId: 'AD001',
//             name: 'Premium Property Banner',
//             description: 'Luxury apartments in downtown area',
//             type: 'BANNER',
//             priority: 5,
//             isActive: true,
//             createdAt: '2024-01-15T10:30:00Z'
//         },
//         interactions: [
//             {
//                 _id: '1',
//                 userId: {
//                     _id: 'user1',
//                     name: 'John Doe',
//                     email: 'john@example.com',
//                     phone: '+1234567890',
//                     profile: { avatar: null, address: 'New York, NY' },
//                     loginType: 'EMAIL',
//                     isPhoneVerified: true,
//                     lastLogin: '2024-01-20T15:30:00Z'
//                 },
//                 interactionType: 'click',
//                 location: { latitude: 40.7128, longitude: -74.0060 },
//                 timestamp: '2024-01-20T15:30:00Z'
//             },
//             {
//                 _id: '2',
//                 userId: {
//                     _id: 'user2',
//                     name: 'Jane Smith',
//                     email: 'jane@example.com',
//                     phone: '+1234567891',
//                     profile: { avatar: null, address: 'Los Angeles, CA' },
//                     loginType: 'GOOGLE',
//                     isPhoneVerified: false,
//                     lastLogin: '2024-01-20T14:20:00Z'
//                 },
//                 interactionType: 'impression',
//                 location: { latitude: 34.0522, longitude: -118.2437 },
//                 timestamp: '2024-01-20T14:20:00Z'
//             }
//         ],
//         stats: {
//             summary: {
//                 totalInteractions: 145,
//                 totalImpressions: 100,
//                 totalClicks: 35,
//                 totalConversions: 10,
//                 ctr: 35.0,
//                 conversionRate: 28.57,
//                 uniqueUsers: 89
//             },
//             byType: [
//                 { type: 'impression', count: 100, uniqueUsers: 89, percentage: '68.97' },
//                 { type: 'click', count: 35, uniqueUsers: 28, percentage: '24.14' },
//                 { type: 'conversion', count: 10, uniqueUsers: 10, percentage: '6.90' }
//             ],
//             dailyTrend: [
//                 { date: '2024-01-15', total: 12, impressions: 8, clicks: 3, conversions: 1 },
//                 { date: '2024-01-16', total: 18, impressions: 12, clicks: 5, conversions: 1 },
//                 { date: '2024-01-17', total: 25, impressions: 18, clicks: 6, conversions: 1 },
//                 { date: '2024-01-18', total: 32, impressions: 22, clicks: 8, conversions: 2 },
//                 { date: '2024-01-19', total: 28, impressions: 20, clicks: 6, conversions: 2 },
//                 { date: '2024-01-20', total: 30, impressions: 20, clicks: 7, conversions: 3 }
//             ]
//         },
//         pagination: {
//             currentPage: 1,
//             totalPages: 8,
//             totalInteractions: 145,
//             hasNext: true,
//             hasPrevious: false
//         }
//     };

//     useEffect(() => {
//         if (adId) {
//             fetchInteractions();
//         }
//     }, [adId, filters]);

//     const fetchInteractions = async () => {
//         setLoading(true);
//         try {
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             setData(mockData);
//         } catch (error) {
//             console.error('Error fetching interactions:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleFilterChange = (key, value) => {
//         setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//     };

//     const getInteractionIcon = (type) => {
//         switch (type) {
//             case 'impression': return <Eye className="w-4 h-4 text-blue-500" />;
//             case 'click': return <MousePointer className="w-4 h-4 text-green-500" />;
//             case 'conversion': return <TrendingUp className="w-4 h-4 text-purple-500" />;
//             default: return <Eye className="w-4 h-4 text-gray-500" />;
//         }
//     };

//     const getInteractionBadgeColor = (type) => {
//         switch (type) {
//             case 'impression': return 'bg-blue-100 text-blue-800';
//             case 'click': return 'bg-green-100 text-green-800';
//             case 'conversion': return 'bg-purple-100 text-purple-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

//     const filteredInteractions = data?.interactions?.filter(interaction => {
//         const matchesSearch = !searchTerm ||
//             interaction.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             interaction.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesType = !filters.interactionType || interaction.interactionType === filters.interactionType;

//         return matchesSearch && matchesType;
//     }) || [];

//     if (!adId) {
//         return (
//             <div className="min-h-screen bg-gray-50 p-6">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//                         <div className="mb-6">
//                             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <BarChart className="w-8 h-8 text-blue-600" />
//                             </div>
//                             <h1 className="text-2xl font-bold text-gray-900 mb-2">Ad Interactions Dashboard</h1>
//                             <p className="text-gray-600">Enter an Ad ID to view detailed interaction analytics</p>
//                         </div>

//                         <div className="max-w-md mx-auto">
//                             <div className="flex gap-3">
//                                 <input
//                                     type="text"
//                                     placeholder="Enter Ad ID (e.g., AD001)"
//                                     value={adId}
//                                     onChange={(e) => setAdId(e.target.value)}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                                 <button
//                                     onClick={() => adId && fetchInteractions()}
//                                     disabled={!adId}
//                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                                 >
//                                     Analyze
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">{data?.ad?.name || 'Ad Analytics'}</h1>
//                             <p className="text-gray-600 mt-1">
//                                 {data?.ad?.description} • {data?.ad?.type} • ID: {data?.ad?.adId}
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => setAdId('')}
//                                 className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
//                             >
//                                 Change Ad
//                             </button>
//                             <button
//                                 onClick={fetchInteractions}
//                                 disabled={loading}
//                                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
//                             >
//                                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                                 Refresh
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//                         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                         <p className="text-gray-600">Loading interaction data...</p>
//                     </div>
//                 ) : data ? (
//                     <>
//                         {/* Stats Cards */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-600">Total Interactions</p>
//                                         <p className="text-2xl font-bold text-gray-900">{data.stats.summary.totalInteractions}</p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                                         <BarChart className="w-6 h-6 text-blue-600" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-600">Click Rate</p>
//                                         <p className="text-2xl font-bold text-gray-900">{data.stats.summary.ctr}%</p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                                         <MousePointer className="w-6 h-6 text-green-600" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
//                                         <p className="text-2xl font-bold text-gray-900">{data.stats.summary.conversionRate}%</p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                                         <TrendingUp className="w-6 h-6 text-purple-600" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-600">Unique Users</p>
//                                         <p className="text-2xl font-bold text-gray-900">{data.stats.summary.uniqueUsers}</p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                                         <Users className="w-6 h-6 text-orange-600" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Charts */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                             {/* Daily Trend Chart */}
//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Interaction Trend</h3>
//                                 <ResponsiveContainer width="100%" height={300}>
//                                     <LineChart data={data.stats.dailyTrend}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis dataKey="date" />
//                                         <YAxis />
//                                         <Tooltip />
//                                         <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
//                                         <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
//                                         <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" strokeWidth={2} />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </div>

//                             {/* Interaction Type Distribution */}
//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Distribution</h3>
//                                 <ResponsiveContainer width="100%" height={300}>
//                                     <PieChart>
//                                         <Pie
//                                             data={data.stats.byType}
//                                             cx="50%"
//                                             cy="50%"
//                                             labelLine={false}
//                                             label={({ type, percentage }) => `${type} (${percentage}%)`}
//                                             outerRadius={80}
//                                             fill="#8884d8"
//                                             dataKey="count"
//                                         >
//                                             {data.stats.byType.map((entry, index) => (
//                                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                             ))}
//                                         </Pie>
//                                         <Tooltip />
//                                     </PieChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         </div>

//                         {/* Filters and Search */}
//                         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//                             <div className="flex flex-wrap gap-4 items-center">
//                                 <div className="flex items-center gap-2">
//                                     <Search className="w-4 h-4 text-gray-500" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search users..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>

//                                 <select
//                                     value={filters.interactionType}
//                                     onChange={(e) => handleFilterChange('interactionType', e.target.value)}
//                                     className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 >
//                                     <option value="">All Interactions</option>
//                                     <option value="impression">Impressions</option>
//                                     <option value="click">Clicks</option>
//                                     <option value="conversion">Conversions</option>
//                                 </select>

//                                 <input
//                                     type="date"
//                                     value={filters.startDate}
//                                     onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                                     className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />

//                                 <input
//                                     type="date"
//                                     value={filters.endDate}
//                                     onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                                     className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>

//                         {/* Interactions Table */}
//                         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                             <div className="px-6 py-4 border-b border-gray-200">
//                                 <h3 className="text-lg font-semibold text-gray-900">User Interactions</h3>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     Showing {filteredInteractions.length} of {data.pagination.totalInteractions} interactions
//                                 </p>
//                             </div>

//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interaction</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredInteractions.map((interaction) => (
//                                             <tr key={interaction._id} className="hover:bg-gray-50">
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                                                             <span className="text-sm font-medium text-gray-700">
//                                                                 {interaction.userId?.name?.charAt(0) || 'U'}
//                                                             </span>
//                                                         </div>
//                                                         <div className="ml-4">
//                                                             <div className="text-sm font-medium text-gray-900">
//                                                                 {interaction.userId?.name || 'Unknown User'}
//                                                             </div>
//                                                             <div className="text-sm text-gray-500">
//                                                                 {interaction.userId?.email}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center gap-2">
//                                                         {getInteractionIcon(interaction.interactionType)}
//                                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInteractionBadgeColor(interaction.interactionType)}`}>
//                                                             {interaction.interactionType}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     {interaction.location?.latitude && interaction.location?.longitude ? (
//                                                         <div className="flex items-center gap-1 text-sm text-gray-600">
//                                                             <MapPin className="w-3 h-3" />
//                                                             <span>
//                                                                 {interaction.location.latitude.toFixed(4)}, {interaction.location.longitude.toFixed(4)}
//                                                             </span>
//                                                         </div>
//                                                     ) : (
//                                                         <span className="text-sm text-gray-400">No location</span>
//                                                     )}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                     {formatDate(interaction.timestamp)}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${interaction.userId?.isPhoneVerified
//                                                                 ? 'bg-green-100 text-green-800'
//                                                                 : 'bg-yellow-100 text-yellow-800'
//                                                             }`}>
//                                                             {interaction.userId?.isPhoneVerified ? 'Verified' : 'Unverified'}
//                                                         </span>
//                                                         <span className="text-xs text-gray-500">
//                                                             {interaction.userId?.loginType}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* Pagination */}
//                             {data.pagination.totalPages > 1 && (
//                                 <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                                     <div className="flex-1 flex justify-between sm:hidden">
//                                         <button
//                                             disabled={!data.pagination.hasPrevious}
//                                             className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             Previous
//                                         </button>
//                                         <button
//                                             disabled={!data.pagination.hasNext}
//                                             className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             Next
//                                         </button>
//                                     </div>
//                                     <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                                         <div>
//                                             <p className="text-sm text-gray-700">
//                                                 Showing page <span className="font-medium">{data.pagination.currentPage}</span> of{' '}
//                                                 <span className="font-medium">{data.pagination.totalPages}</span> pages
//                                             </p>
//                                         </div>
//                                         <div>
//                                             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                                                 <button
//                                                     disabled={!data.pagination.hasPrevious}
//                                                     onClick={() => handleFilterChange('page', data.pagination.currentPage - 1)}
//                                                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                 >
//                                                     <span className="sr-only">Previous</span>
//                                                     <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </button>

//                                                 {[...Array(Math.min(5, data.pagination.totalPages))].map((_, i) => {
//                                                     const pageNum = i + 1;
//                                                     const isActive = pageNum === data.pagination.currentPage;
//                                                     return (
//                                                         <button
//                                                             key={pageNum}
//                                                             onClick={() => handleFilterChange('page', pageNum)}
//                                                             className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${isActive
//                                                                     ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                                                                     : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                                                                 }`}
//                                                         >
//                                                             {pageNum}
//                                                         </button>
//                                                     );
//                                                 })}

//                                                 <button
//                                                     disabled={!data.pagination.hasNext}
//                                                     onClick={() => handleFilterChange('page', data.pagination.currentPage + 1)}
//                                                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                 >
//                                                     <span className="sr-only">Next</span>
//                                                     <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </button>
//                                             </nav>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Additional Stats */}
//                         <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Breakdown</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                 {data.stats.byType.map((stat, index) => (
//                                     <div key={stat.type} className="text-center p-4 bg-gray-50 rounded-lg">
//                                         <div className="flex items-center justify-center mb-2">
//                                             {getInteractionIcon(stat.type)}
//                                         </div>
//                                         <h4 className="text-lg font-semibold text-gray-900 capitalize">{stat.type}</h4>
//                                         <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
//                                         <p className="text-sm text-gray-600">{stat.uniqueUsers} unique users</p>
//                                         <p className="text-sm text-gray-600">{stat.percentage}% of total</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Export Button */}
//                         <div className="mt-6 flex justify-end">
//                             <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
//                                 <Download className="w-4 h-4" />
//                                 Export Data
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//                         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                             </svg>
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
//                         <p className="text-gray-600">No interactions found for Ad ID: {adId}</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Interactions;


import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, MousePointer, Target, Users, TrendingUp, MapPin, Calendar, Clock, BarChart3 } from 'lucide-react';

const Interactions = ({ base_url, getAuthConfig, adId, onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        interactionType: '',
        startDate: '',
        endDate: '',
        sortBy: 'timestamp',
        sortOrder: 'desc'
    });

    useEffect(() => {
        if (adId) {
            fetchInteractions();
        }
    }, [adId, currentPage, filters]);

    const fetchInteractions = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = `${base_url}/api/ads/interactions/${adId}?page=${currentPage}&limit=20`;

            if (filters.interactionType) url += `&interactionType=${filters.interactionType}`;
            if (filters.startDate) url += `&startDate=${filters.startDate}`;
            if (filters.endDate) url += `&endDate=${filters.endDate}`;
            if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
            if (filters.sortOrder) url += `&sortOrder=${filters.sortOrder}`;

            const response = await fetch(url, getAuthConfig());
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Failed to fetch interactions');
            }
        } catch (err) {
            console.error('Error fetching interactions:', err);
            setError('Failed to fetch interactions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInteractionIcon = (type) => {
        switch (type) {
            case 'impression': return <Eye size={16} className="text-blue-500" />;
            case 'click': return <MousePointer size={16} className="text-green-500" />;
            case 'conversion': return <Target size={16} className="text-purple-500" />;
            default: return <BarChart3 size={16} className="text-gray-500" />;
        }
    };

    const getInteractionColor = (type) => {
        switch (type) {
            case 'impression': return 'bg-blue-100 text-blue-800';
            case 'click': return 'bg-green-100 text-green-800';
            case 'conversion': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && !data) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
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
                <div className="flex items-center space-x-4 mb-6">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Ad Interactions</h2>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchInteractions}
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
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Ad Interactions</h2>
                    {data?.ad && (
                        <p className="text-gray-600">{data.ad.name} ({data.ad.type})</p>
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            {data?.stats?.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                                <p className="text-2xl font-bold text-gray-900">{data.stats.summary.totalImpressions?.toLocaleString() || 0}</p>
                            </div>
                            <Eye className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                                <p className="text-2xl font-bold text-gray-900">{data.stats.summary.totalClicks?.toLocaleString() || 0}</p>
                            </div>
                            <MousePointer className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">CTR</p>
                                <p className="text-2xl font-bold text-gray-900">{data.stats.summary.ctr?.toFixed(2) || 0}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                                <p className="text-2xl font-bold text-gray-900">{data.stats.summary.uniqueUsers?.toLocaleString() || 0}</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <select
                        value={filters.interactionType}
                        onChange={(e) => handleFilterChange('interactionType', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        <option value="impression">Impressions</option>
                        <option value="click">Clicks</option>
                        <option value="conversion">Conversions</option>
                    </select>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Start Date"
                    />

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="End Date"
                    />

                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="timestamp">Sort by Date</option>
                        <option value="interactionType">Sort by Type</option>
                    </select>

                    <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Interaction Stats by Type */}
            {data?.stats?.byType && data.stats.byType.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {data.stats.byType.map((stat) => (
                            <div key={stat.type} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        {getInteractionIcon(stat.type)}
                                        <span className="font-medium text-gray-900 capitalize">{stat.type}</span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInteractionColor(stat.type)}`}>
                                        {stat.percentage}%
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stat.count?.toLocaleString() || 0}</p>
                                <p className="text-sm text-gray-500">{stat.uniqueUsers || 0} unique users</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Interactions List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Interactions</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.interactions?.map((interaction) => (
                                <tr key={interaction._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {interaction.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {interaction.userId?.name || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {interaction.userId?.email || interaction.userId?.phone || 'No contact'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {getInteractionIcon(interaction.interactionType)}
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInteractionColor(interaction.interactionType)}`}>
                                                {interaction.interactionType}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                                            <Calendar size={14} />
                                            <span>{formatDate(interaction.timestamp)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {interaction.location?.latitude && interaction.location?.longitude ? (
                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                <MapPin size={14} />
                                                <span>
                                                    {interaction.location.latitude.toFixed(3)}, {interaction.location.longitude.toFixed(3)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">No location</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">
                                            {interaction.deviceInfo || 'Unknown'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!data?.interactions || data.interactions.length === 0) && (
                    <div className="text-center py-12">
                        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No interactions found for the selected criteria</p>
                    </div>
                )}

                {/* Pagination */}
                {data?.pagination && data.pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing page {data.pagination.currentPage} of {data.pagination.totalPages}
                            ({data.pagination.totalInteractions} total interactions)
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={!data.pagination.hasPrevious}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={!data.pagination.hasNext}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interactions;