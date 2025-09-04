// import React, { useState, useEffect } from 'react';
// import {
//     DollarSign,
//     Users,
//     TrendingUp,
//     Home,
//     CreditCard,
//     Eye,
//     Calendar,
//     Activity,
//     ArrowUp,
//     ArrowDown
// } from 'lucide-react';
// import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';

// const RazorpayDashboard = () => {
//     const [dashboardData, setDashboardData] = useState({
//         totalRevenue: 0,
//         totalUsers: 0,
//         totalProperties: 0,
//         totalTransactions: 0,
//         recentTransactions: [],
//         revenueChart: [],
//         userGrowth: [],
//         topProperties: [],
//         walletStats: {
//             totalRecharges: 0,
//             totalDeductions: 0,
//             avgWalletBalance: 0
//         }
//     });

//     const [loading, setLoading] = useState(true);
//     const [timeFilter, setTimeFilter] = useState('7d');


//     useEffect(() => {
//         fetchDashboardData();
//     }, [timeFilter]);

//     const fetchDashboardData = async () => {
//         try {
//             setLoading(true);

//             // Fetch real data from your backend endpoints
//             const [
//                 dashboardStatsResponse,
//                 revenueChartResponse,
//                 userGrowthResponse,
//                 topPropertiesResponse
//             ] = await Promise.all([
//                 fetch(`${base_url}/api/wallet/dashboard-stats?period=${timeFilter}`, getAuthConfig()),
//                 fetch(`${base_url}/api/wallet/revenue-chart?period=${timeFilter}`, getAuthConfig()),
//                 fetch(`${base_url}/api/wallet/user-growth`, getAuthConfig()),
//                 fetch(`${base_url}/api/wallet/top-properties`, getAuthConfig())
//             ]);

//             if (!dashboardStatsResponse.ok) {
//                 throw new Error('Failed to fetch dashboard stats');
//             }

//             const dashboardStats = await dashboardStatsResponse.json();
//             const revenueChart = await revenueChartResponse.json();
//             const userGrowth = await userGrowthResponse.json();
//             const topProperties = await topPropertiesResponse.json();

//             setDashboardData({
//                 totalRevenue: dashboardStats.totalRevenue,
//                 totalUsers: dashboardStats.totalUsers,
//                 totalProperties: dashboardStats.totalProperties,
//                 totalTransactions: dashboardStats.totalTransactions,
//                 recentTransactions: dashboardStats.recentTransactions,
//                 revenueChart: revenueChart,
//                 userGrowth: userGrowth,
//                 topProperties: topProperties,
//                 walletStats: dashboardStats.walletStats
//             });

//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//             // Fallback to mock data on error for development
//             setDashboardData({
//                 totalRevenue: 125840,
//                 totalUsers: 2847,
//                 totalProperties: 1256,
//                 totalTransactions: 4582,
//                 recentTransactions: generateMockTransactions(),
//                 revenueChart: generateRevenueData(),
//                 userGrowth: generateUserGrowthData(),
//                 topProperties: generateTopPropertiesData(),
//                 walletStats: {
//                     totalRecharges: 89420,
//                     totalDeductions: 67580,
//                     avgWalletBalance: 245
//                 }
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateMockTransactions = () => [
//         { id: '1', user: 'john@example.com', amount: 50, type: 'CREDIT', status: 'SUCCESSFUL', date: '2024-08-05T10:30:00Z' },
//         { id: '2', user: 'jane@example.com', amount: 25, type: 'DEBIT', status: 'SUCCESSFUL', date: '2024-08-05T09:15:00Z' },
//         { id: '3', user: 'bob@example.com', amount: 100, type: 'CREDIT', status: 'SUCCESSFUL', date: '2024-08-05T08:45:00Z' },
//         { id: '4', user: 'alice@example.com', amount: 25, type: 'DEBIT', status: 'SUCCESSFUL', date: '2024-08-04T18:20:00Z' },
//         { id: '5', user: 'charlie@example.com', amount: 75, type: 'CREDIT', status: 'SUCCESSFUL', date: '2024-08-04T16:10:00Z' }
//     ];

//     const generateRevenueData = () => [
//         { date: '2024-07-29', revenue: 1200 },
//         { date: '2024-07-30', revenue: 1450 },
//         { date: '2024-07-31', revenue: 1320 },
//         { date: '2024-08-01', revenue: 1680 },
//         { date: '2024-08-02', revenue: 1520 },
//         { date: '2024-08-03', revenue: 1890 },
//         { date: '2024-08-04', revenue: 2100 },
//         { date: '2024-08-05', revenue: 1950 }
//     ];

//     const generateUserGrowthData = () => [
//         { month: 'Jan', users: 1200 },
//         { month: 'Feb', users: 1450 },
//         { month: 'Mar', users: 1680 },
//         { month: 'Apr', users: 1920 },
//         { month: 'May', users: 2150 },
//         { month: 'Jun', users: 2420 },
//         { month: 'Jul', users: 2680 },
//         { month: 'Aug', users: 2847 }
//     ];

//     const generateTopPropertiesData = () => [
//         { name: 'Luxury Apartments', interactions: 145, revenue: 3625 },
//         { name: 'Villa Complex', interactions: 128, revenue: 3200 },
//         { name: 'Commercial Space', interactions: 96, revenue: 2400 },
//         { name: 'Studio Apartments', interactions: 84, revenue: 2100 },
//         { name: 'Penthouse Suite', interactions: 72, revenue: 1800 }
//     ];

//     const StatCard = ({ title, value, icon: Icon, change, changeType, color = "blue" }) => (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//                     <p className="text-2xl font-bold text-gray-900">{value}</p>
//                     {change && (
//                         <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
//                             }`}>
//                             {changeType === 'increase' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
//                             <span className="ml-1">{change}</span>
//                         </div>
//                     )}
//                 </div>
//                 <div className={`p-3 rounded-full bg-${color}-50`}>
//                     <Icon className={`w-6 h-6 text-${color}-600`} />
//                 </div>
//             </div>
//         </div>
//     );

//     const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;
//     const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center py-6">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 Overview of your property management platform
//                             </p>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <select
//                                 value={timeFilter}
//                                 onChange={(e) => setTimeFilter(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="7d">Last 7 days</option>
//                                 <option value="30d">Last 30 days</option>
//                                 <option value="90d">Last 90 days</option>
//                                 <option value="1y">Last year</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <StatCard
//                         title="Total Revenue"
//                         value={formatCurrency(dashboardData.totalRevenue)}
//                         icon={DollarSign}
//                         change="+12.5%"
//                         changeType="increase"
//                         color="green"
//                     />
//                     <StatCard
//                         title="Total Users"
//                         value={dashboardData.totalUsers.toLocaleString()}
//                         icon={Users}
//                         change="+8.2%"
//                         changeType="increase"
//                         color="blue"
//                     />
//                     <StatCard
//                         title="Properties Listed"
//                         value={dashboardData.totalProperties.toLocaleString()}
//                         icon={Home}
//                         change="+5.4%"
//                         changeType="increase"
//                         color="purple"
//                     />
//                     <StatCard
//                         title="Transactions"
//                         value={dashboardData.totalTransactions.toLocaleString()}
//                         icon={CreditCard}
//                         change="+15.3%"
//                         changeType="increase"
//                         color="orange"
//                     />
//                 </div>

//                 {/* Charts Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Revenue Chart */}
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
//                             <TrendingUp className="w-5 h-5 text-green-600" />
//                         </div>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <AreaChart data={dashboardData.revenueChart}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis
//                                     dataKey="date"
//                                     tickFormatter={(value) => {
//                                         const date = new Date(value);
//                                         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//                                     }}
//                                 />
//                                 <YAxis tickFormatter={(value) => `₹${value}`} />
//                                 <Tooltip
//                                     formatter={(value) => [formatCurrency(value), 'Revenue']}
//                                     labelFormatter={(value) => {
//                                         const date = new Date(value);
//                                         return date.toLocaleDateString('en-US', {
//                                             weekday: 'long',
//                                             year: 'numeric',
//                                             month: 'long',
//                                             day: 'numeric'
//                                         });
//                                     }}
//                                 />
//                                 <Area
//                                     type="monotone"
//                                     dataKey="revenue"
//                                     stroke="#10b981"
//                                     fill="#10b981"
//                                     fillOpacity={0.1}
//                                 />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     </div>

//                     {/* User Growth Chart */}
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
//                             <Users className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <LineChart data={dashboardData.userGrowth}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="month" />
//                                 <YAxis />
//                                 <Tooltip
//                                     formatter={(value, name) => [
//                                         value.toLocaleString(),
//                                         name === 'users' ? 'Total Users' : 'New Users'
//                                     ]}
//                                 />
//                                 <Line
//                                     type="monotone"
//                                     dataKey="users"
//                                     stroke="#3b82f6"
//                                     strokeWidth={3}
//                                     dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
//                                     name="users"
//                                 />
//                                 {dashboardData.userGrowth[0]?.newUsers && (
//                                     <Line
//                                         type="monotone"
//                                         dataKey="newUsers"
//                                         stroke="#10b981"
//                                         strokeWidth={2}
//                                         strokeDasharray="5 5"
//                                         dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
//                                         name="newUsers"
//                                     />
//                                 )}
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 {/* Wallet Stats and Top Properties */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     {/* Wallet Statistics */}
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Wallet Statistics</h3>
//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">Total Recharges</span>
//                                 <span className="font-semibold text-green-600">
//                                     {formatCurrency(dashboardData.walletStats.totalRecharges)}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">Total Deductions</span>
//                                 <span className="font-semibold text-orange-600">
//                                     {formatCurrency(dashboardData.walletStats.totalDeductions)}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">Avg Wallet Balance</span>
//                                 <span className="font-semibold text-blue-600">
//                                     {formatCurrency(dashboardData.walletStats.avgWalletBalance)}
//                                 </span>
//                             </div>
//                             <div className="pt-4 border-t">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm font-medium text-gray-900">Net Revenue</span>
//                                     <span className="font-bold text-gray-900">
//                                         {formatCurrency(dashboardData.walletStats.totalDeductions)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Top Properties */}
//                     <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Properties</h3>
//                         <div className="space-y-4">
//                             {dashboardData.topProperties.map((property, index) => (
//                                 <div key={property.propertyId || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
//                                     <div className="flex items-center">
//                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${index === 0 ? 'bg-yellow-500' :
//                                                 index === 1 ? 'bg-gray-400' :
//                                                     index === 2 ? 'bg-orange-600' : 'bg-blue-500'
//                                             }`}>
//                                             {index + 1}
//                                         </div>
//                                         <div className="ml-3">
//                                             <p className="font-medium text-gray-900">{property.name}</p>
//                                             <p className="text-sm text-gray-500">{property.interactions} </p>
//                                         </div>
//                                     </div>
//                                     <div className="text-right">
//                                         <p className="font-semibold text-gray-900">{formatCurrency(property.revenue)}</p>
//                                         <p className="text-sm text-gray-500">Revenue</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Recent Transactions */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
//                         <Activity className="w-5 h-5 text-gray-400" />
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         User
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Amount
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Type
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Date
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {dashboardData.recentTransactions.map((transaction) => (
//                                     <tr key={transaction.id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                             {transaction.user}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                             {formatCurrency(transaction.amount)}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.type === 'CREDIT'
//                                                     ? 'bg-green-100 text-green-800'
//                                                     : 'bg-orange-100 text-orange-800'
//                                                 }`}>
//                                                 {transaction.type}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                                                 {transaction.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {formatDate(transaction.date)}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RazorpayDashboard;

// import React, { useState, useEffect } from 'react';
// import AdminAPI from './adminApi';
// import {
//     Users,
//     CreditCard,
//     TrendingUp,
//     DollarSign,
//     Activity,
//     ChevronDown,
//     Calendar,
//     Bell,
//     Search,
//     Filter
// } from 'lucide-react';
// import StatsCards from '../../components/RazorpayDashboard/StatsCards';
// import TransactionChart from '../../components/RazorpayDashboard/TransactionChart';
// import UserAnalytics from '../../components/RazorpayDashboard/UserAnalytics';
// import PlanAnalytics from '../../components/RazorpayDashboard/PlanAnalytics';
// import RecentActivity from '../../components/RazorpayDashboard/RecentActivity';
// import UserTable from '../../components/RazorpayDashboard/UserTable';
// import Suggestions from '../../components/RazorpayDashboard/Suggestions';

// const RazorpayDashboard = () => {
//     const [dateRange, setDateRange] = useState('7d');
//     const [activeTab, setActiveTab] = useState('overview');
//     const [dashboardData, setDashboardData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const dateRanges = [
//         { value: '24h', label: 'Last 24 Hours' },
//         { value: '7d', label: 'Last 7 Days' },
//         { value: '30d', label: 'Last 30 Days' },
//         { value: '90d', label: 'Last 90 Days' }
//     ];

//     const tabs = [
//         { id: 'overview', label: 'Overview', icon: Activity },
//         { id: 'users', label: 'Users', icon: Users },
//         { id: 'transactions', label: 'Transactions', icon: CreditCard },
//         { id: 'plans', label: 'Plans', icon: TrendingUp }
//     ];

//     useEffect(() => {
//         fetchDashboardData();
//     }, [dateRange]);

//     const fetchDashboardData = async () => {
//         setLoading(true);
//         try {
//             // Fetch all dashboard data from APIs
//             const [stats, transactions, users, plans, recentActivity, suggestions] = await Promise.all([
//                 AdminAPI.getDashboardStats(dateRange),
//                 AdminAPI.getTransactionAnalytics(dateRange),
//                 AdminAPI.getUserAnalytics(dateRange),
//                 AdminAPI.getPlanAnalytics(dateRange),
//                 AdminAPI.getRecentActivity(10),
//                 AdminAPI.getSuggestions()
//             ]);

//             setDashboardData({
//                 stats,
//                 transactions,
//                 users,
//                 plans,
//                 recentActivity,
//                 suggestions
//             });
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//             // Set empty data on error to prevent crashes
//             setDashboardData({
//                 stats: {
//                     totalUsers: 0,
//                     totalUsersGrowth: 0,
//                     activeUsers: 0,
//                     activeUsersGrowth: 0,
//                     totalRevenue: 0,
//                     revenueGrowth: 0,
//                     plansPurchased: 0,
//                     plansPurchasedGrowth: 0,
//                     walletBalance: 0,
//                     walletBalanceGrowth: 0,
//                     propertyInteractions: 0,
//                     propertyInteractionsGrowth: 0
//                 },
//                 transactions: { labels: [], datasets: [] },
//                 users: { newUsers: [], activeUsers: [], userEngagement: 0, avgSessionTime: '0m' },
//                 plans: { planDistribution: [], revenue: {} },
//                 recentActivity: [],
//                 suggestions: []
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="flex items-center space-x-4">
//                     <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                     <span className="text-gray-600 font-medium">Loading dashboard...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <header className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//                             <p className="text-gray-600 mt-1">Monitor your platform's performance and user activity</p>
//                         </div>

//                         <div className="flex items-center space-x-4">
//                             {/* Date Range Selector */}
//                             <div className="relative">
//                                 <select
//                                     value={dateRange}
//                                     onChange={(e) => setDateRange(e.target.value)}
//                                     className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 >
//                                     {dateRanges.map(range => (
//                                         <option key={range.value} value={range.value}>
//                                             {range.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                             </div>

//                             <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
//                                 <Bell className="w-5 h-5" />
//                                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Navigation Tabs */}
//                     <div className="mt-6 border-b border-gray-200">
//                         <nav className="flex space-x-8">
//                             {tabs.map(tab => {
//                                 const Icon = tab.icon;
//                                 return (
//                                     <button
//                                         key={tab.id}
//                                         onClick={() => setActiveTab(tab.id)}
//                                         className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
//                                                 ? 'border-blue-500 text-blue-600'
//                                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                             }`}
//                                     >
//                                         <Icon className="w-4 h-4" />
//                                         <span>{tab.label}</span>
//                                     </button>
//                                 );
//                             })}
//                         </nav>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="p-6">
//                 {activeTab === 'overview' && (
//                     <div className="space-y-6">
//                         <StatsCards stats={dashboardData.stats} />

//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <TransactionChart data={dashboardData.transactions} />
//                             <UserAnalytics data={dashboardData.users} />
//                         </div>

//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <PlanAnalytics data={dashboardData.plans} />
//                             <RecentActivity activities={dashboardData.recentActivity} />
//                         </div>

//                         <Suggestions suggestions={dashboardData.suggestions} />
//                     </div>
//                 )}

//                 {activeTab === 'users' && (
//                     <UserTable adminAPI={AdminAPI} />
//                 )}

//                 {activeTab === 'transactions' && (
//                     <div className="space-y-6">
//                         <TransactionChart data={dashboardData.transactions} fullWidth />
//                         <RecentActivity activities={dashboardData.recentActivity} showAll />
//                     </div>
//                 )}

//                 {activeTab === 'plans' && (
//                     <div className="space-y-6">
//                         <PlanAnalytics data={dashboardData.plans} detailed />
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default RazorpayDashboard;


import React, { useState, useEffect } from 'react';
import AdminAPI from './adminApi';
import {
    Users,
    CreditCard,
    TrendingUp,
    DollarSign,
    Activity,
    ChevronDown,
    Bell,
    UserCheck,
    PieChart,
    BarChart3,
    Target,
    Wallet
} from 'lucide-react';
import StatsCards from '../../components/RazorpayDashboard/StatsCards';
import TransactionChart from '../../components/RazorpayDashboard/TransactionChart';
import UserAnalytics from '../../components/RazorpayDashboard/UserAnalytics';
import PlanAnalytics from '../../components/RazorpayDashboard/PlanAnalytics';
import RecentActivity from '../../components/RazorpayDashboard/RecentActivity';
import UserTable from '../../components/RazorpayDashboard/UserTable';
import Suggestions from '../../components/RazorpayDashboard/Suggestions';
import UserDetails from '../../components/RazorpayDashboard/UserDetails';
import PlanDetails from '../../components/RazorpayDashboard/PlanDetails';
import RevenueAnalytics from '../../components/RazorpayDashboard/RevenueAnalytics';
import UserActivity from '../../components/RazorpayDashboard/UserActivity';
import WalletAnalytics from '../../components/RazorpayDashboard/WalletAnalytics';
import AdminUsersPage from './AdminUsersPage';

const RazorpayDashboard = () => {
    const [dateRange, setDateRange] = useState('7d');
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("dashboardData", dashboardData)

    const dateRanges = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'user-details', label: 'User Details', icon: UserCheck },
        { id: 'transactions', label: 'Transactions', icon: CreditCard },
        { id: 'plans', label: 'Plans', icon: TrendingUp },
        { id: 'plan-details', label: 'Plan Details', icon: Target },
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'activity', label: 'Activity', icon: BarChart3 },
        { id: 'wallet', label: 'Wallet Analytics', icon: Wallet },
        { id: 'wallet-detail', label: 'Wallet Detail', icon: Wallet },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [stats, transactions, users, plans, recentActivity, suggestions] = await Promise.all([
                AdminAPI.getDashboardStats(dateRange),
                AdminAPI.getTransactionAnalytics(dateRange),
                AdminAPI.getUserAnalytics(dateRange),
                AdminAPI.getPlanAnalytics(dateRange),
                AdminAPI.getRecentActivity(10),
                AdminAPI.getSuggestions()
            ]);

            setDashboardData({
                stats,
                transactions,
                users,
                plans,
                recentActivity,
                suggestions
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setDashboardData({
                stats: {
                    totalUsers: 0,
                    totalUsersGrowth: 0,
                    activeUsers: 0,
                    activeUsersGrowth: 0,
                    totalRevenue: 0,
                    revenueGrowth: 0,
                    plansPurchased: 0,
                    plansPurchasedGrowth: 0,
                    walletBalance: 0,
                    walletBalanceGrowth: 0,
                    propertyInteractions: 0,
                    propertyInteractionsGrowth: 0,
                    totalPaidUsers: 0,
                    paidUsersGrowth: 0
                },
                transactions: { labels: [], datasets: [] },
                users: { newUsers: [], activeUsers: [], userEngagement: 0, avgSessionTime: '0m' },
                plans: { planDistribution: [], revenue: {} },
                recentActivity: [],
                suggestions: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Monitor your platform's performance and user activity</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {dateRanges.map(range => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mt-6 border-b border-gray-200">
                        <nav className="flex space-x-6 overflow-x-auto">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <StatsCards stats={dashboardData.stats} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TransactionChart data={dashboardData.transactions} />
                            <UserAnalytics data={dashboardData?.users} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PlanAnalytics data={dashboardData.plans} />
                            <RecentActivity activities={dashboardData.recentActivity} />
                        </div>

                        <Suggestions suggestions={dashboardData.suggestions} />
                    </div>
                )}

                {activeTab === 'users' && (
                    <UserTable adminAPI={AdminAPI} />
                )}

                {activeTab === 'user-details' && (
                    <UserDetails adminAPI={AdminAPI} />
                )}

                {activeTab === 'transactions' && (
                    <div className="space-y-6">
                        <TransactionChart data={dashboardData.transactions} fullWidth />
                        <RecentActivity activities={dashboardData.recentActivity} showAll />
                    </div>
                )}

                {activeTab === 'plans' && (
                    <div className="space-y-6">
                        <PlanAnalytics data={dashboardData.plans} detailed />
                    </div>
                )}

                {activeTab === 'plan-details' && (
                    <PlanDetails adminAPI={AdminAPI} />
                )}

                {activeTab === 'revenue' && (
                    <RevenueAnalytics adminAPI={AdminAPI} dateRange={dateRange} />
                )}

                {activeTab === 'activity' && (
                    <UserActivity adminAPI={AdminAPI} dateRange={dateRange} />
                )}

                {activeTab === 'wallet' && (
                    <WalletAnalytics adminAPI={AdminAPI} dateRange={dateRange} />
                )}
                {activeTab === 'wallet-detail' && (
                    <AdminUsersPage />
                )}
            </main>
        </div>
    );
};

export default RazorpayDashboard;