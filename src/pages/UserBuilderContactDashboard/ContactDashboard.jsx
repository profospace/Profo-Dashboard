// import React, { useState, useEffect } from 'react';
// import { getAuthConfig } from '../../../utils/authConfig';
// import { base_url } from '../../../utils/base_url';

// const ContactDashboard = () => {
//     const [interactions, setInteractions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredInteractions, setFilteredInteractions] = useState([]);
//     const [stats, setStats] = useState({
//         totalContacts: 0,
//         todayContacts: 0,
//         entityBreakdown: []
//     });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pagination, setPagination] = useState({});

//     // // Get admin token from localStorage
//     // const getAuthToken = () => {
//     //     return localStorage.getItem('adminToken') || localStorage.getItem('authToken');
//     // };


//     // Fetch contact interactions
//     const fetchContactInteractions = async (page = 1) => {
//         try {
//             setLoading(true);
//             // const token = getAuthToken();

//             // if (!token) {
//             //     throw new Error('No authentication token found');
//             // }

//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions?page=${page}&limit=50`, getAuthConfig());

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.success) {
//                 setInteractions(data.data);
//                 setFilteredInteractions(data.data);
//                 setPagination(data.pagination);
//             } else {
//                 throw new Error(data.message || 'Failed to fetch interactions');
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error('Error fetching contact interactions:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch statistics
//     const fetchStats = async () => {
//         try {
//             // const token = getAuthToken();

//             // if (!token) return;

//             const response = await fetch('${base_url}/properties-interaction/api/admin/contact-interactions/stats', getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setStats(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching stats:', err);
//         }
//     };

//     // Handle search functionality
//     useEffect(() => {
//         if (!searchTerm.trim()) {
//             setFilteredInteractions(interactions);
//             return;
//         }

//         const filtered = interactions.filter(interaction => {
//             const searchLower = searchTerm.toLowerCase();
//             return (
//                 interaction.user?.name?.toLowerCase().includes(searchLower) ||
//                 interaction.user?.email?.toLowerCase().includes(searchLower) ||
//                 interaction.builder?.name?.toLowerCase().includes(searchLower) ||
//                 interaction.builder?.company?.toLowerCase().includes(searchLower) ||
//                 interaction.target?.title?.toLowerCase().includes(searchLower)
//             );
//         });

//         setFilteredInteractions(filtered);
//     }, [searchTerm, interactions]);

//     // Initial data fetch
//     useEffect(() => {
//         fetchContactInteractions();
//         fetchStats();
//     }, []);

//     // Handle page change
//     const handlePageChange = (newPage) => {
//         setCurrentPage(newPage);
//         fetchContactInteractions(newPage);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Get badge color for entity type
//     const getEntityBadgeColor = (entityType) => {
//         switch (entityType) {
//             case 'PROPERTY':
//                 return 'bg-blue-100 text-blue-800';
//             case 'PROJECT':
//                 return 'bg-green-100 text-green-800';
//             case 'BUILDING':
//                 return 'bg-purple-100 text-purple-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
//                     <div className="flex items-center">
//                         <div className="text-red-400 mr-3">
//                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                         <div>
//                             <h3 className="text-red-800 font-medium">Error Loading Data</h3>
//                             <p className="text-red-700 text-sm mt-1">{error}</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => fetchContactInteractions()}
//                         className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     console.log('stats' , stats)

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="py-6">
//                         <h1 className="text-3xl font-bold text-gray-900">Contact Interactions Dashboard</h1>
//                         <p className="mt-2 text-gray-600">Monitor and manage user contact requests</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Cards */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Total Contacts</div>
//                                     <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Today's Contacts</div>
//                                     <div className="text-2xl font-bold text-gray-900">{stats.todayContacts}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Entity Types</div>
//                                     <div className="text-2xl font-bold text-gray-900">{stats.entityBreakdown.length}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="bg-white shadow-sm rounded-lg mb-6">
//                     <div className="p-6">
//                         <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Search by user name, email, builder name, or property title..."
//                                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Interactions Table */}
//                 <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Builder</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filteredInteractions.length > 0 ? (
//                                     filteredInteractions.map((interaction) => (
//                                         <tr key={interaction.id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {interaction.user?.name || 'Unknown User'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.user?.email || 'No Email'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {interaction.builder?.name || 'Unknown Builder'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.builder?.company || 'No Company'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {interaction.target?.title || 'Unknown Target'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.target?.location || 'Unknown Location'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(interaction.interactionEntity)}`}>
//                                                     {interaction.target?.type || interaction.interactionEntity}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">
//                                                     {interaction.phoneNumber || 'No Phone'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.location?.city || 'Unknown City'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatDate(interaction.timestamp)}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                                             {searchTerm ? 'No interactions found matching your search.' : 'No contact interactions found.'}
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     {pagination.totalPages > 1 && (
//                         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                             <div className="flex-1 flex justify-between sm:hidden">
//                                 <button
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={!pagination.hasPrevPage}
//                                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                                 >
//                                     Previous
//                                 </button>
//                                 <button
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={!pagination.hasNextPage}
//                                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                                 <div>
//                                     <p className="text-sm text-gray-700">
//                                         Showing page <span className="font-medium">{pagination.page}</span> of{' '}
//                                         <span className="font-medium">{pagination.totalPages}</span>
//                                         {' '}({pagination.total} total interactions)
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                                         <button
//                                             onClick={() => handlePageChange(currentPage - 1)}
//                                             disabled={!pagination.hasPrevPage}
//                                             className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                                         >
//                                             Previous
//                                         </button>
//                                         <button
//                                             onClick={() => handlePageChange(currentPage + 1)}
//                                             disabled={!pagination.hasNextPage}
//                                             className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                                         >
//                                             Next
//                                         </button>
//                                     </nav>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactDashboard;

// import React, { useState, useEffect } from 'react';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';

// const ContactDashboard = () => {
//     const [interactions, setInteractions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredInteractions, setFilteredInteractions] = useState([]);
//     const [stats, setStats] = useState({
//         totalContacts: 0,
//         todayContacts: 0,
//         entityBreakdown: []
//     });
//     const [detailedMetrics, setDetailedMetrics] = useState(null);
//     const [revenueInsights, setRevenueInsights] = useState(null);
//     const [selectedPeriod, setSelectedPeriod] = useState('day');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pagination, setPagination] = useState({});


//     // Fetch contact interactions
//     const fetchContactInteractions = async (page = 1) => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions?page=${page}&limit=50`, getAuthConfig());

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.success) {
//                 setInteractions(data.data);
//                 setFilteredInteractions(data.data);
//                 setPagination(data.pagination);
//             } else {
//                 throw new Error(data.message || 'Failed to fetch interactions');
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error('Error fetching contact interactions:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch statistics
//     const fetchStats = async () => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/stats`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setStats(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching stats:', err);
//         }
//     };

//     // Fetch detailed metrics
//     const fetchDetailedMetrics = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/detailed-metrics?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setDetailedMetrics(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching detailed metrics:', err);
//         }
//     };

//     // Fetch revenue insights
//     const fetchRevenueInsights = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/revenue-insights?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setRevenueInsights(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching revenue insights:', err);
//         }
//     };

//     // Handle search functionality
//     useEffect(() => {
//         if (!searchTerm.trim()) {
//             setFilteredInteractions(interactions);
//             return;
//         }

//         const filtered = interactions.filter(interaction => {
//             const searchLower = searchTerm.toLowerCase();
//             return (
//                 interaction.user?.name?.toLowerCase().includes(searchLower) ||
//                 interaction.user?.email?.toLowerCase().includes(searchLower) ||
//                 interaction.builder?.name?.toLowerCase().includes(searchLower) ||
//                 interaction.builder?.company?.toLowerCase().includes(searchLower) ||
//                 interaction.target?.title?.toLowerCase().includes(searchLower)
//             );
//         });

//         setFilteredInteractions(filtered);
//     }, [searchTerm, interactions]);

//     // Initial data fetch
//     useEffect(() => {
//         fetchContactInteractions();
//         fetchStats();
//         fetchDetailedMetrics(selectedPeriod);
//         fetchRevenueInsights(selectedPeriod);
//     }, []);

//     // Fetch metrics when period changes
//     useEffect(() => {
//         fetchDetailedMetrics(selectedPeriod);
//         fetchRevenueInsights(selectedPeriod);
//     }, [selectedPeriod]);

//     // Handle page change
//     const handlePageChange = (newPage) => {
//         setCurrentPage(newPage);
//         fetchContactInteractions(newPage);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Format currency
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount);
//     };

//     // Get badge color for entity type
//     const getEntityBadgeColor = (entityType) => {
//         switch (entityType) {
//             case 'PROPERTY':
//                 return 'bg-blue-100 text-blue-800';
//             case 'PROJECT':
//                 return 'bg-green-100 text-green-800';
//             case 'BUILDING':
//                 return 'bg-purple-100 text-purple-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
//                     <div className="flex items-center">
//                         <div className="text-red-400 mr-3">
//                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                         <div>
//                             <h3 className="text-red-800 font-medium">Error Loading Data</h3>
//                             <p className="text-red-700 text-sm mt-1">{error}</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => fetchContactInteractions()}
//                         className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="py-6">
//                         <h1 className="text-3xl font-bold text-gray-900">Contact Interactions Dashboard</h1>
//                         <p className="mt-2 text-gray-600">Monitor and manage user contact requests</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Period Selector */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//                 <div className="flex space-x-2 mb-6">
//                     <button
//                         onClick={() => setSelectedPeriod('day')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'day'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                             }`}
//                     >
//                         Today
//                     </button>
//                     <button
//                         onClick={() => setSelectedPeriod('week')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'week'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                             }`}
//                     >
//                         This Week
//                     </button>
//                     <button
//                         onClick={() => setSelectedPeriod('month')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'month'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                             }`}
//                     >
//                         This Month
//                     </button>
//                 </div>
//             </div>

//             {/* Basic Stats Cards */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Total Contacts</div>
//                                     <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Today's Contacts</div>
//                                     <div className="text-2xl font-bold text-gray-900">{stats.todayContacts}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
//                                     <div className="text-2xl font-bold text-gray-900">
//                                         {detailedMetrics?.conversionMetrics?.totalUsers > 0
//                                             ? `${((detailedMetrics.conversionMetrics.viewedAndContacted / detailedMetrics.conversionMetrics.totalUsers) * 100).toFixed(1)}%`
//                                             : '0%'
//                                         }
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1zM4 9a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                                 <div className="ml-4">
//                                     <div className="text-sm font-medium text-gray-500">Potential Revenue</div>
//                                     <div className="text-2xl font-bold text-gray-900">
//                                         {revenueInsights ? formatCurrency(revenueInsights.totalPotentialRevenue) : '₹0'}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Top Users and Properties Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Top Users */}
//                     <div className="bg-white shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Most Active Users</h3>
//                             <div className="space-y-3">
//                                 {detailedMetrics?.topUsers?.map((user, index) => (
//                                     <div key={user.userId} className="flex items-center justify-between">
//                                         <div className="flex items-center">
//                                             <div className="flex-shrink-0">
//                                                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
//                                                     <span className="text-sm font-medium text-gray-600">{index + 1}</span>
//                                                 </span>
//                                             </div>
//                                             <div className="ml-3">
//                                                 <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
//                                                 <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
//                                             </div>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-sm font-semibold text-gray-900">{user.contactCount} contacts</p>
//                                             <p className="text-xs text-gray-500">Last: {new Date(user.lastContact).toLocaleDateString()}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Top Properties */}
//                     <div className="bg-white shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Most Contacted Properties</h3>
//                             <div className="space-y-3">
//                                 {detailedMetrics?.topProperties?.map((prop, index) => (
//                                     <div key={prop._id.entityId} className="flex items-center justify-between">
//                                         <div className="flex items-center">
//                                             <div className="flex-shrink-0">
//                                                 <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
//                                                     <span className="text-sm font-medium text-blue-600">{index + 1}</span>
//                                                 </span>
//                                             </div>
//                                             <div className="ml-3 flex-1">
//                                                 <p className="text-sm font-medium text-gray-900 truncate">
//                                                     {prop.details?.title || 'Unknown Property'}
//                                                 </p>
//                                                 <p className="text-xs text-gray-500">{prop.details?.location || 'Location N/A'}</p>
//                                             </div>
//                                         </div>
//                                         <div className="text-right ml-2">
//                                             <p className="text-sm font-semibold text-gray-900">{prop.contactCount} contacts</p>
//                                             <p className="text-xs text-gray-500">{prop.uniqueUserCount} users</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Additional Insights Row */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                     {/* Location Insights */}
//                     <div className="bg-white shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h3>
//                             <div className="space-y-2">
//                                 {detailedMetrics?.locationInsights?.map((location, index) => (
//                                     <div key={location.city} className="flex justify-between items-center">
//                                         <span className="text-sm text-gray-600">{location.city}</span>
//                                         <span className="text-sm font-medium text-gray-900">{location.count} contacts</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Builder Performance */}
//                     <div className="bg-white shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Top Builders</h3>
//                             <div className="space-y-2">
//                                 {detailedMetrics?.builderPerformance?.map((builder) => (
//                                     <div key={builder.builderId} className="flex justify-between items-center">
//                                         <span className="text-sm text-gray-600 truncate">{builder.name || 'Unknown'}</span>
//                                         <span className="text-sm font-medium text-gray-900">{builder.contactCount} contacts</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Peak Hours */}
//                     <div className="bg-white shadow-sm rounded-lg">
//                         <div className="p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Contact Hours</h3>
//                             <div className="space-y-2">
//                                 {detailedMetrics?.hourlyTrends?.slice(0, 5).map((hour) => (
//                                     <div key={hour._id} className="flex justify-between items-center">
//                                         <span className="text-sm text-gray-600">{hour._id}:00 - {hour._id + 1}:00</span>
//                                         <span className="text-sm font-medium text-gray-900">{hour.count} contacts</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="bg-white shadow-sm rounded-lg mb-6">
//                     <div className="p-6">
//                         <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Search by user name, email, builder name, or property title..."
//                                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Interactions Table */}
//                 <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Builder</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filteredInteractions.length > 0 ? (
//                                     filteredInteractions.map((interaction) => (
//                                         <tr key={interaction.id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {interaction.user?.name || 'Unknown User'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.user?.email || 'No Email'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {interaction.builder?.name || 'Unknown Builder'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.builder?.company || 'No Company'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm font-medium text-gray-900">
//                                                     {interaction.target?.title || 'Unknown Target'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.target?.location || 'Unknown Location'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(interaction.interactionEntity)}`}>
//                                                     {interaction.target?.type || interaction.interactionEntity}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900">
//                                                     {interaction.phoneNumber || 'No Phone'}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     {interaction.location?.city || 'Unknown City'}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatDate(interaction.timestamp)}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                                             {searchTerm ? 'No interactions found matching your search.' : 'No contact interactions found.'}
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     {pagination.totalPages > 1 && (
//                         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                             <div className="flex-1 flex justify-between sm:hidden">
//                                 <button
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={!pagination.hasPrevPage}
//                                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                                 >
//                                     Previous
//                                 </button>
//                                 <button
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={!pagination.hasNextPage}
//                                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                                 <div>
//                                     <p className="text-sm text-gray-700">
//                                         Showing page <span className="font-medium">{pagination.page}</span> of{' '}
//                                         <span className="font-medium">{pagination.totalPages}</span>
//                                         {' '}({pagination.total} total interactions)
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                                         <button
//                                             onClick={() => handlePageChange(currentPage - 1)}
//                                             disabled={!pagination.hasPrevPage}
//                                             className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                                         >
//                                             Previous
//                                         </button>
//                                         <button
//                                             onClick={() => handlePageChange(currentPage + 1)}
//                                             disabled={!pagination.hasNextPage}
//                                             className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                                         >
//                                             Next
//                                         </button>
//                                     </nav>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactDashboard;


// import React, { useState, useEffect } from 'react';
// import { Calendar, TrendingUp, TrendingDown, Users, Home, Phone, Clock, DollarSign, Award, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';

// const ContactDashboard = () => {
//     const [interactions, setInteractions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredInteractions, setFilteredInteractions] = useState([]);
//     const [stats, setStats] = useState({
//         totalContacts: 0,
//         todayContacts: 0,
//         entityBreakdown: []
//     });
//     const [detailedMetrics, setDetailedMetrics] = useState(null);
//     const [revenueInsights, setRevenueInsights] = useState(null);
//     const [buyerPropensity, setBuyerPropensity] = useState([]);
//     const [propertyPerformance, setPropertyPerformance] = useState(null);
//     const [calendarData, setCalendarData] = useState(null);
//     const [predictiveInsights, setPredictiveInsights] = useState(null);
//     const [selectedPeriod, setSelectedPeriod] = useState('day');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pagination, setPagination] = useState({});
//     const [activeTab, setActiveTab] = useState('overview');
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());



//     // Fetch contact interactions
//     const fetchContactInteractions = async (page = 1) => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions?page=${page}&limit=50`, getAuthConfig());

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data.success) {
//                 setInteractions(data.data);
//                 setFilteredInteractions(data.data);
//                 setPagination(data.pagination);
//             } else {
//                 throw new Error(data.message || 'Failed to fetch interactions');
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error('Error fetching contact interactions:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch statistics
//     const fetchStats = async () => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/stats`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setStats(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching stats:', err);
//         }
//     };

//     // Fetch detailed metrics
//     const fetchDetailedMetrics = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/detailed-metrics?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setDetailedMetrics(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching detailed metrics:', err);
//         }
//     };

//     // Fetch revenue insights
//     const fetchRevenueInsights = async (period) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/revenue-insights?period=${period}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setRevenueInsights(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching revenue insights:', err);
//         }
//     };

//     // Fetch buyer propensity scores
//     const fetchBuyerPropensity = async () => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/buyer-propensity?limit=20`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setBuyerPropensity(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching buyer propensity:', err);
//         }
//     };

//     // Fetch property performance
//     const fetchPropertyPerformance = async () => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/property-performance?period=30`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setPropertyPerformance(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching property performance:', err);
//         }
//     };

//     // Fetch calendar data
//     const fetchCalendarData = async (month, year) => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/calendar-view?month=${month + 1}&year=${year}`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setCalendarData(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching calendar data:', err);
//         }
//     };

//     // Fetch predictive insights
//     const fetchPredictiveInsights = async () => {
//         try {
//             const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/predictive-insights`, getAuthConfig());

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setPredictiveInsights(data.data);
//                 }
//             }
//         } catch (err) {
//             console.error('Error fetching predictive insights:', err);
//         }
//     };

//     // Handle search functionality
//     useEffect(() => {
//         if (!searchTerm.trim()) {
//             setFilteredInteractions(interactions);
//             return;
//         }

//         const filtered = interactions.filter(interaction => {
//             const searchLower = searchTerm.toLowerCase();
//             return (
//                 interaction.user?.name?.toLowerCase().includes(searchLower) ||
//                 interaction.user?.email?.toLowerCase().includes(searchLower) ||
//                 interaction.builder?.name?.toLowerCase().includes(searchLower) ||
//                 interaction.builder?.company?.toLowerCase().includes(searchLower) ||
//                 interaction.target?.title?.toLowerCase().includes(searchLower)
//             );
//         });

//         setFilteredInteractions(filtered);
//     }, [searchTerm, interactions]);

//     // Initial data fetch
//     useEffect(() => {
//         fetchContactInteractions();
//         fetchStats();
//         fetchDetailedMetrics(selectedPeriod);
//         fetchRevenueInsights(selectedPeriod);
//         fetchBuyerPropensity();
//         fetchPropertyPerformance();
//         fetchCalendarData(selectedMonth, selectedYear);
//         fetchPredictiveInsights();
//     }, []);

//     // Fetch metrics when period changes
//     useEffect(() => {
//         fetchDetailedMetrics(selectedPeriod);
//         fetchRevenueInsights(selectedPeriod);
//     }, [selectedPeriod]);

//     // Fetch calendar data when month changes
//     useEffect(() => {
//         fetchCalendarData(selectedMonth, selectedYear);
//     }, [selectedMonth, selectedYear]);

//     // Handle page change
//     const handlePageChange = (newPage) => {
//         setCurrentPage(newPage);
//         fetchContactInteractions(newPage);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Format currency
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount);
//     };

//     // Get propensity score color
//     const getPropensityColor = (score) => {
//         if (score >= 80) return 'text-green-600 bg-green-100';
//         if (score >= 60) return 'text-yellow-600 bg-yellow-100';
//         if (score >= 40) return 'text-orange-600 bg-orange-100';
//         return 'text-red-600 bg-red-100';
//     };

//     // Get badge color for entity type
//     const getEntityBadgeColor = (entityType) => {
//         switch (entityType) {
//             case 'PROPERTY':
//                 return 'bg-blue-100 text-blue-800';
//             case 'PROJECT':
//                 return 'bg-green-100 text-green-800';
//             case 'BUILDING':
//                 return 'bg-purple-100 text-purple-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     // Calendar component
//     const CalendarView = () => {
//         const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
//         const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//         const getDayData = (day) => {
//             if (!calendarData?.dailyInteractions) return null;
//             const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//             return calendarData.dailyInteractions.find(d => d._id === dateStr);
//         };

//         return (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-lg font-medium text-gray-900">Interaction Calendar</h3>
//                     <div className="flex items-center space-x-2">
//                         <button onClick={() => {
//                             if (selectedMonth === 0) {
//                                 setSelectedMonth(11);
//                                 setSelectedYear(selectedYear - 1);
//                             } else {
//                                 setSelectedMonth(selectedMonth - 1);
//                             }
//                         }} className="p-2 hover:bg-gray-100 rounded">
//                             <ChevronLeft className="w-5 h-5" />
//                         </button>
//                         <span className="font-medium">{monthNames[selectedMonth]} {selectedYear}</span>
//                         <button onClick={() => {
//                             if (selectedMonth === 11) {
//                                 setSelectedMonth(0);
//                                 setSelectedYear(selectedYear + 1);
//                             } else {
//                                 setSelectedMonth(selectedMonth + 1);
//                             }
//                         }} className="p-2 hover:bg-gray-100 rounded">
//                             <ChevronRight className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-7 gap-1">
//                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                         <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
//                             {day}
//                         </div>
//                     ))}

//                     {Array.from({ length: firstDayOfMonth }).map((_, i) => (
//                         <div key={`empty-${i}`} className="aspect-square" />
//                     ))}

//                     {Array.from({ length: daysInMonth }).map((_, i) => {
//                         const day = i + 1;
//                         const dayData = getDayData(day);
//                         return (
//                             <div key={day} className={`aspect-square border rounded-lg p-2 ${dayData ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
//                                 <div className="text-sm font-medium">{day}</div>
//                                 {dayData && (
//                                     <div className="mt-1">
//                                         <div className="text-xs text-blue-600 font-semibold">{dayData.totalCount}</div>
//                                         <div className="text-xs text-gray-500">interactions</div>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {calendarData?.scheduledFollowups?.length > 0 && (
//                     <div className="mt-6">
//                         <h4 className="text-sm font-medium text-gray-900 mb-3">Scheduled Follow-ups</h4>
//                         <div className="space-y-2">
//                             {calendarData.scheduledFollowups.map((followup, idx) => (
//                                 <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-900">{followup.userName}</p>
//                                         <p className="text-xs text-gray-500">{followup.date} at {followup.time}</p>
//                                     </div>
//                                     <Phone className="w-4 h-4 text-gray-400" />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
//                     <div className="flex items-center">
//                         <div className="text-red-400 mr-3">
//                             <AlertCircle className="w-6 h-6" />
//                         </div>
//                         <div>
//                             <h3 className="text-red-800 font-medium">Error Loading Data</h3>
//                             <p className="text-red-700 text-sm mt-1">{error}</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => fetchContactInteractions()}
//                         className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="py-6">
//                         <h1 className="text-3xl font-bold text-gray-900">Contact Interactions Dashboard</h1>
//                         <p className="mt-2 text-gray-600">Monitor and manage user contact requests with AI-powered insights</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Tab Navigation */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//                 <div className="border-b border-gray-200">
//                     <nav className="-mb-px flex space-x-8">
//                         <button
//                             onClick={() => setActiveTab('overview')}
//                             className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             Overview
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('buyers')}
//                             className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'buyers'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             Buyer Insights
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('properties')}
//                             className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'properties'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             Property Performance
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('calendar')}
//                             className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'calendar'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             Calendar
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('insights')}
//                             className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'insights'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                         >
//                             Market Insights
//                         </button>
//                     </nav>
//                 </div>
//             </div>

//             {/* Tab Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 {activeTab === 'overview' && (
//                     <>
//                         {/* Period Selector */}
//                         <div className="flex space-x-2 mb-6">
//                             <button
//                                 onClick={() => setSelectedPeriod('day')}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'day'
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 Today
//                             </button>
//                             <button
//                                 onClick={() => setSelectedPeriod('week')}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'week'
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 This Week
//                             </button>
//                             <button
//                                 onClick={() => setSelectedPeriod('month')}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'month'
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 This Month
//                             </button>
//                         </div>

//                         {/* Basic Stats Cards */}
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                             <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                                 <div className="p-6">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
//                                                 <Phone className="w-5 h-5 text-white" />
//                                             </div>
//                                         </div>
//                                         <div className="ml-4">
//                                             <div className="text-sm font-medium text-gray-500">Total Contacts</div>
//                                             <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                                 <div className="p-6">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
//                                                 <Clock className="w-5 h-5 text-white" />
//                                             </div>
//                                         </div>
//                                         <div className="ml-4">
//                                             <div className="text-sm font-medium text-gray-500">Today's Contacts</div>
//                                             <div className="text-2xl font-bold text-gray-900">{stats.todayContacts}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                                 <div className="p-6">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
//                                                 <TrendingUp className="w-5 h-5 text-white" />
//                                             </div>
//                                         </div>
//                                         <div className="ml-4">
//                                             <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
//                                             <div className="text-2xl font-bold text-gray-900">
//                                                 {detailedMetrics?.conversionMetrics?.totalUsers > 0
//                                                     ? `${((detailedMetrics.conversionMetrics.viewedAndContacted / detailedMetrics.conversionMetrics.totalUsers) * 100).toFixed(1)}%`
//                                                     : '0%'
//                                                 }
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//                                 <div className="p-6">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
//                                                 <DollarSign className="w-5 h-5 text-white" />
//                                             </div>
//                                         </div>
//                                         <div className="ml-4">
//                                             <div className="text-sm font-medium text-gray-500">Potential Revenue</div>
//                                             <div className="text-2xl font-bold text-gray-900">
//                                                 {revenueInsights ? formatCurrency(revenueInsights.totalPotentialRevenue) : '₹0'}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Top Users and Properties Section */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                             {/* Top Users */}
//                             <div className="bg-white shadow-sm rounded-lg">
//                                 <div className="p-6">
//                                     <h3 className="text-lg font-medium text-gray-900 mb-4">Most Active Users</h3>
//                                     <div className="space-y-3">
//                                         {detailedMetrics?.topUsers?.map((user, index) => (
//                                             <div key={user.userId} className="flex items-center justify-between">
//                                                 <div className="flex items-center">
//                                                     <div className="flex-shrink-0">
//                                                         <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
//                                                             <span className="text-sm font-medium text-gray-600">{index + 1}</span>
//                                                         </span>
//                                                     </div>
//                                                     <div className="ml-3">
//                                                         <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
//                                                         <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <p className="text-sm font-semibold text-gray-900">{user.contactCount} contacts</p>
//                                                     <p className="text-xs text-gray-500">Last: {new Date(user.lastContact).toLocaleDateString()}</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Top Properties */}
//                             <div className="bg-white shadow-sm rounded-lg">
//                                 <div className="p-6">
//                                     <h3 className="text-lg font-medium text-gray-900 mb-4">Most Contacted Properties</h3>
//                                     <div className="space-y-3">
//                                         {detailedMetrics?.topProperties?.map((prop, index) => (
//                                             <div key={prop._id.entityId} className="flex items-center justify-between">
//                                                 <div className="flex items-center">
//                                                     <div className="flex-shrink-0">
//                                                         <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
//                                                             <span className="text-sm font-medium text-blue-600">{index + 1}</span>
//                                                         </span>
//                                                     </div>
//                                                     <div className="ml-3 flex-1">
//                                                         <p className="text-sm font-medium text-gray-900 truncate">
//                                                             {prop.details?.title || 'Unknown Property'}
//                                                         </p>
//                                                         <p className="text-xs text-gray-500">{prop.details?.location || 'Location N/A'}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-right ml-2">
//                                                     <p className="text-sm font-semibold text-gray-900">{prop.contactCount} contacts</p>
//                                                     <p className="text-xs text-gray-500">{prop.uniqueUserCount} users</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {activeTab === 'buyers' && (
//                     <div className="space-y-6">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Buyer Propensity Analysis</h2>

//                         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                             <div className="p-6">
//                                 <h3 className="text-lg font-medium text-gray-900 mb-4">High-Intent Buyers</h3>
//                                 <p className="text-sm text-gray-600 mb-6">Users most likely to make a purchase based on behavioral patterns</p>
//                             </div>

//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Properties</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {buyerPropensity.map((buyer) => (
//                                             <tr key={buyer.userId} className="hover:bg-gray-50">
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div>
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {buyer.userInfo.name || 'Unknown'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {buyer.userInfo.email || buyer.userInfo.phone}
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPropensityColor(buyer.propensityScore)}`}>
//                                                             {buyer.propensityScore.toFixed(0)}%
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm text-gray-900">
//                                                         <div className="flex items-center space-x-2">
//                                                             <span>{buyer.metrics.totalInteractions} interactions</span>
//                                                         </div>
//                                                         <div className="text-xs text-gray-500 mt-1">
//                                                             {buyer.metrics.contactCount} contacts • {buyer.metrics.saveCount} saves
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <div className="text-sm">
//                                                         {buyer.recentProperties?.slice(0, 2).map((prop, idx) => (
//                                                             <div key={idx} className="text-gray-600 truncate" style={{ maxWidth: '200px' }}>
//                                                                 • {prop?.post_title || 'Property'}
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="text-sm text-gray-900">
//                                                         {buyer.lastActivityDaysAgo === 0 ? 'Today' :
//                                                             buyer.lastActivityDaysAgo === 1 ? 'Yesterday' :
//                                                                 `${buyer.lastActivityDaysAgo} days ago`}
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
//                                                         Contact Now
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'properties' && propertyPerformance && (
//                     <div className="space-y-6">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Performance Analysis</h2>

//                         {/* High Likelihood Properties */}
//                         <div className="bg-white shadow-sm rounded-lg">
//                             <div className="p-6 border-b border-gray-200">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="text-lg font-medium text-gray-900">Properties Most Likely to Sell</h3>
//                                         <p className="text-sm text-gray-600 mt-1">Based on engagement metrics and market indicators</p>
//                                     </div>
//                                     <Award className="w-8 h-8 text-green-500" />
//                                 </div>
//                             </div>
//                             <div className="divide-y divide-gray-200">
//                                 {propertyPerformance.highLikelihoodProperties?.map((property) => (
//                                     <div key={property.propertyId} className="p-6 hover:bg-gray-50">
//                                         <div className="flex items-start justify-between">
//                                             <div className="flex-1">
//                                                 <h4 className="text-sm font-medium text-gray-900">
//                                                     {property.propertyInfo?.title || 'Property'}
//                                                 </h4>
//                                                 <p className="text-sm text-gray-500 mt-1">
//                                                     {property.propertyInfo?.location} • {formatCurrency(property.propertyInfo?.price || 0)}
//                                                 </p>
//                                                 <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
//                                                     <span>{property.metrics.totalViews} views</span>
//                                                     <span>{property.metrics.totalContacts} contacts</span>
//                                                     <span>{property.metrics.conversionRate.toFixed(1)}% conversion</span>
//                                                     <span>{property.metrics.uniqueUserCount} interested users</span>
//                                                 </div>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPropensityColor(property.saleLikelihoodScore)}`}>
//                                                     {property.saleLikelihoodScore.toFixed(0)}% likely
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Low Performing Properties */}
//                         <div className="bg-white shadow-sm rounded-lg">
//                             <div className="p-6 border-b border-gray-200">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <h3 className="text-lg font-medium text-gray-900">Low Performing Properties</h3>
//                                         <p className="text-sm text-gray-600 mt-1">Properties that need attention or price adjustment</p>
//                                     </div>
//                                     <AlertCircle className="w-8 h-8 text-red-500" />
//                                 </div>
//                             </div>
//                             <div className="divide-y divide-gray-200">
//                                 {propertyPerformance.lowPerformingProperties?.map((property) => (
//                                     <div key={property.propertyId} className="p-6 hover:bg-gray-50">
//                                         <div className="flex items-start justify-between">
//                                             <div className="flex-1">
//                                                 <h4 className="text-sm font-medium text-gray-900">
//                                                     {property.propertyInfo?.title || 'Property'}
//                                                 </h4>
//                                                 <p className="text-sm text-gray-500 mt-1">
//                                                     {property.propertyInfo?.location} • {formatCurrency(property.propertyInfo?.price || 0)}
//                                                 </p>
//                                                 <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
//                                                     <span className="text-red-600">{property.metrics.totalViews} views only</span>
//                                                     <span>{property.metrics.daysOnMarket} days on market</span>
//                                                     <span>{property.metrics.daysSinceLastActivity} days since last activity</span>
//                                                 </div>
//                                             </div>
//                                             <div className="ml-4">
//                                                 <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">
//                                                     Needs Review
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'calendar' && (
//                     <CalendarView />
//                 )}

//                 {activeTab === 'insights' && predictiveInsights && (
//                     <div className="space-y-6">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Intelligence</h2>

//                         {/* Market Trend */}
//                         <div className="bg-white shadow-sm rounded-lg p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Market Momentum</h3>
//                             <div className="flex items-center justify-between mb-4">
//                                 <div>
//                                     <p className="text-3xl font-bold text-gray-900">
//                                         {predictiveInsights.insights?.trendDirection || 'Analyzing...'}
//                                     </p>
//                                     <p className="text-sm text-gray-500">Overall market activity trend</p>
//                                 </div>
//                                 <div>
//                                     {predictiveInsights.insights?.trendDirection === 'Upward' ? (
//                                         <TrendingUp className="w-12 h-12 text-green-500" />
//                                     ) : (
//                                         <TrendingDown className="w-12 h-12 text-red-500" />
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Weekly Trends Chart */}
//                             <div className="space-y-2">
//                                 <h4 className="text-sm font-medium text-gray-700">Weekly Activity</h4>
//                                 {predictiveInsights.marketMomentum?.map((week) => (
//                                     <div key={`${week._id.year}-${week._id.week}`} className="flex items-center">
//                                         <span className="text-xs text-gray-500 w-20">Week {week._id.week}</span>
//                                         <div className="flex-1 bg-gray-200 rounded-full h-6 ml-2">
//                                             <div
//                                                 className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
//                                                 style={{ width: `${(week.interactions / Math.max(...predictiveInsights.marketMomentum.map(w => w.interactions))) * 100}%` }}
//                                             >
//                                                 <span className="text-xs text-white font-medium">{week.interactions}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Price Sensitivity */}
//                         <div className="bg-white shadow-sm rounded-lg p-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range Analysis</h3>
//                             <p className="text-sm text-gray-600 mb-4">
//                                 Most active price range: <span className="font-semibold text-gray-900">{predictiveInsights.insights?.mostActivePriceRange}</span>
//                             </p>
//                             <div className="space-y-3">
//                                 {predictiveInsights.priceSensitivity?.map((range) => (
//                                     <div key={range._id.priceRange} className="flex items-center justify-between">
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between mb-1">
//                                                 <span className="text-sm font-medium text-gray-700">{range._id.priceRange}</span>
//                                                 <span className="text-sm text-gray-500">{range.totalInteractions} interactions</span>
//                                             </div>
//                                             <div className="w-full bg-gray-200 rounded-full h-2">
//                                                 <div
//                                                     className="bg-green-500 h-2 rounded-full"
//                                                     style={{ width: `${(range.conversionRate * 100).toFixed(0)}%` }}
//                                                 />
//                                             </div>
//                                             <div className="flex justify-between mt-1">
//                                                 <span className="text-xs text-gray-500">{range.contacts} contacts</span>
//                                                 <span className="text-xs text-gray-500">{(range.conversionRate * 100).toFixed(1)}% conversion</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Actionable Recommendations */}
//                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                             <h3 className="text-lg font-medium text-blue-900 mb-4">AI-Powered Recommendations</h3>
//                             <div className="space-y-3">
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                             <span className="text-blue-600 font-bold text-sm">1</span>
//                                         </div>
//                                     </div>
//                                     <div className="ml-3">
//                                         <p className="text-sm text-blue-900">
//                                             <span className="font-semibold">Focus on {predictiveInsights.insights?.mostActivePriceRange} properties</span>
//                                             {' - '}This price range shows the highest engagement and conversion rates.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                             <span className="text-blue-600 font-bold text-sm">2</span>
//                                         </div>
//                                     </div>
//                                     <div className="ml-3">
//                                         <p className="text-sm text-blue-900">
//                                             <span className="font-semibold">Schedule follow-ups during peak hours</span>
//                                             {' - '}Your data shows highest engagement between {detailedMetrics?.hourlyTrends?.[0]?._id || 10}:00 - {(detailedMetrics?.hourlyTrends?.[0]?._id || 10) + 2}:00.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                             <span className="text-blue-600 font-bold text-sm">3</span>
//                                         </div>
//                                     </div>
//                                     <div className="ml-3">
//                                         <p className="text-sm text-blue-900">
//                                             <span className="font-semibold">Prioritize high-propensity buyers</span>
//                                             {' - '}Contact the top {buyerPropensity.filter(b => b.propensityScore >= 70).length} buyers with 70%+ scores immediately.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Interactions Table - shown only in overview tab */}
//                 {activeTab === 'overview' && (
//                     <>
//                         {/* Search Bar */}
//                         <div className="bg-white shadow-sm rounded-lg mb-6">
//                             <div className="p-6">
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <input
//                                         type="text"
//                                         placeholder="Search by user name, email, builder name, or property title..."
//                                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Interactions Table */}
//                         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Builder</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredInteractions.length > 0 ? (
//                                             filteredInteractions.map((interaction) => (
//                                                 <tr key={interaction.id} className="hover:bg-gray-50">
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {interaction.user?.name || 'Unknown User'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {interaction.user?.email || 'No Email'}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {interaction.builder?.name || 'Unknown Builder'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {interaction.builder?.company || 'No Company'}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {interaction.target?.title || 'Unknown Target'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {interaction.target?.location || 'Unknown Location'}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(interaction.interactionEntity)}`}>
//                                                             {interaction.target?.type || interaction.interactionEntity}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-6 py-4 whitespace-nowrap">
//                                                         <div className="text-sm text-gray-900">
//                                                             {interaction.phoneNumber || 'No Phone'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {interaction.location?.city || 'Unknown City'}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                         {formatDate(interaction.timestamp)}
//                                                     </td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                                                     {searchTerm ? 'No interactions found matching your search.' : 'No contact interactions found.'}
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             {/* Pagination */}
//                             {pagination.totalPages > 1 && (
//                                 <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                                     <div className="flex-1 flex justify-between sm:hidden">
//                                         <button
//                                             onClick={() => handlePageChange(currentPage - 1)}
//                                             disabled={!pagination.hasPrevPage}
//                                             className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                                         >
//                                             Previous
//                                         </button>
//                                         <button
//                                             onClick={() => handlePageChange(currentPage + 1)}
//                                             disabled={!pagination.hasNextPage}
//                                             className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//                                         >
//                                             Next
//                                         </button>
//                                     </div>
//                                     <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                                         <div>
//                                             <p className="text-sm text-gray-700">
//                                                 Showing page <span className="font-medium">{pagination.page}</span> of{' '}
//                                                 <span className="font-medium">{pagination.totalPages}</span>
//                                                 {' '}({pagination.total} total interactions)
//                                             </p>
//                                         </div>
//                                         <div>
//                                             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                                                 <button
//                                                     onClick={() => handlePageChange(currentPage - 1)}
//                                                     disabled={!pagination.hasPrevPage}
//                                                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                                                 >
//                                                     Previous
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handlePageChange(currentPage + 1)}
//                                                     disabled={!pagination.hasNextPage}
//                                                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                                                 >
//                                                     Next
//                                                 </button>
//                                             </nav>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ContactDashboard;


import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Users, Home, Phone, Clock, DollarSign, Award, AlertCircle, ChevronLeft, ChevronRight, X, Eye, ExternalLink, Calculator } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const ContactDashboard = () => {
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInteractions, setFilteredInteractions] = useState([]);
    const [stats, setStats] = useState({
        totalContacts: 0,
        todayContacts: 0,
        entityBreakdown: []
    });
    const [detailedMetrics, setDetailedMetrics] = useState(null);
    const [revenueInsights, setRevenueInsights] = useState(null);
    const [buyerPropensity, setBuyerPropensity] = useState([]);
    const [propertyPerformance, setPropertyPerformance] = useState(null);
    const [calendarData, setCalendarData] = useState(null);
    const [predictiveInsights, setPredictiveInsights] = useState(null);
    const [commissionData, setCommissionData] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('day');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailyDetails, setDailyDetails] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userJourney, setUserJourney] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

   

    // Fetch contact interactions
    const fetchContactInteractions = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions?page=${page}&limit=50`, getAuthConfig());

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setInteractions(data.data);
                setFilteredInteractions(data.data);
                setPagination(data.pagination);
            } else {
                throw new Error(data.message || 'Failed to fetch interactions');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching contact interactions:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/stats`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    // Fetch detailed metrics
    const fetchDetailedMetrics = async (period) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/detailed-metrics?period=${period}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDetailedMetrics(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching detailed metrics:', err);
        }
    };

    // Fetch revenue insights
    const fetchRevenueInsights = async (period) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/revenue-insights?period=${period}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setRevenueInsights(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching revenue insights:', err);
        }
    };

    // Fetch buyer propensity scores
    const fetchBuyerPropensity = async () => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/buyer-propensity?limit=20`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setBuyerPropensity(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching buyer propensity:', err);
        }
    };

    // Fetch property performance
    const fetchPropertyPerformance = async () => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/property-performance?period=30`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPropertyPerformance(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching property performance:', err);
        }
    };

    // Fetch calendar data
    const fetchCalendarData = async (month, year) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/calendar-view?month=${month + 1}&year=${year}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCalendarData(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching calendar data:', err);
        }
    };

    // Fetch predictive insights
    const fetchPredictiveInsights = async () => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/predictive-insights`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPredictiveInsights(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching predictive insights:', err);
        }
    };

    // Fetch commission simulator data
    const fetchCommissionData = async () => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/commission-simulator?period=30&commissionRate=0.01`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCommissionData(data.data);
                }
            }
        } catch (err) {
            console.error('Error fetching commission data:', err);
        }
    };

    // Fetch daily details for calendar click
    const fetchDailyDetails = async (date) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/daily-details?date=${date}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setDailyDetails(data.data);
                    setModalContent('daily');
                    setShowModal(true);
                }
            }
        } catch (err) {
            console.error('Error fetching daily details:', err);
        }
    };

    // Fetch property details
    const fetchPropertyDetails = async (propertyId) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/property-details/${propertyId}?period=30`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPropertyDetails(data.data);
                    setModalContent('property');
                    setShowModal(true);
                }
            }
        } catch (err) {
            console.error('Error fetching property details:', err);
        }
    };

    // Fetch user journey
    const fetchUserJourney = async (userId) => {
        try {
            const response = await fetch(`${base_url}/properties-interaction/api/admin/contact-interactions/user-journey/${userId}`, getAuthConfig());

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUserJourney(data.data);
                    setModalContent('user');
                    setShowModal(true);
                }
            }
        } catch (err) {
            console.error('Error fetching user journey:', err);
        }
    };

    // Handle search functionality
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredInteractions(interactions);
            return;
        }

        const filtered = interactions.filter(interaction => {
            const searchLower = searchTerm.toLowerCase();
            return (
                interaction.user?.name?.toLowerCase().includes(searchLower) ||
                interaction.user?.email?.toLowerCase().includes(searchLower) ||
                interaction.builder?.name?.toLowerCase().includes(searchLower) ||
                interaction.builder?.company?.toLowerCase().includes(searchLower) ||
                interaction.target?.title?.toLowerCase().includes(searchLower)
            );
        });

        setFilteredInteractions(filtered);
    }, [searchTerm, interactions]);

    // Initial data fetch
    useEffect(() => {
        fetchContactInteractions();
        fetchStats();
        fetchDetailedMetrics(selectedPeriod);
        fetchRevenueInsights(selectedPeriod);
        fetchBuyerPropensity();
        fetchPropertyPerformance();
        fetchCalendarData(selectedMonth, selectedYear);
        fetchPredictiveInsights();
        fetchCommissionData();
    }, []);

    // Fetch metrics when period changes
    useEffect(() => {
        fetchDetailedMetrics(selectedPeriod);
        fetchRevenueInsights(selectedPeriod);
    }, [selectedPeriod]);

    // Fetch calendar data when month changes
    useEffect(() => {
        fetchCalendarData(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchContactInteractions(newPage);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get propensity score color
    const getPropensityColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        if (score >= 40) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    // Get badge color for entity type
    const getEntityBadgeColor = (entityType) => {
        switch (entityType) {
            case 'PROPERTY':
                return 'bg-blue-100 text-blue-800';
            case 'PROJECT':
                return 'bg-green-100 text-green-800';
            case 'BUILDING':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Modal Component
    const Modal = () => {
        if (!showModal) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {modalContent === 'daily' && 'Daily Interactions Details'}
                            {modalContent === 'property' && 'Property Analytics'}
                            {modalContent === 'user' && 'User Journey'}
                            {modalContent === 'commission' && 'Commission Simulator'}
                        </h3>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-4 max-h-96 overflow-y-auto">
                        {modalContent === 'daily' && dailyDetails && (
                            <div>
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Summary for {dailyDetails.date}</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Total Interactions</p>
                                            <p className="text-2xl font-bold text-blue-600">{dailyDetails.totalInteractions}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Contacts</p>
                                            <p className="text-2xl font-bold text-green-600">{dailyDetails.summary.contacts}</p>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded">
                                            <p className="text-sm text-gray-600">Views</p>
                                            <p className="text-2xl font-bold text-purple-600">{dailyDetails.summary.visits}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {dailyDetails.interactions.map((interaction, idx) => (
                                        <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {interaction.userId?.name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {interaction.interactionType} • {interaction.formattedTime}
                                                    </p>
                                                    {interaction.targetDetails && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {interaction.targetDetails.title} - {interaction.targetDetails.location}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(interaction.interactionEntity)}`}>
                                                    {interaction.interactionEntity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {modalContent === 'property' && propertyDetails && (
                            <div>
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900">{propertyDetails.property.post_title}</h4>
                                    <p className="text-sm text-gray-600">
                                        {propertyDetails.property.city}, {propertyDetails.property.locality} • {formatCurrency(propertyDetails.property.price)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <div className="bg-blue-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-blue-600">{propertyDetails.property.analytics.totalViews}</p>
                                        <p className="text-sm text-gray-600">Views</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-green-600">{propertyDetails.property.analytics.totalContacts}</p>
                                        <p className="text-sm text-gray-600">Contacts</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-purple-600">{propertyDetails.property.uniqueUserCount}</p>
                                        <p className="text-sm text-gray-600">Interested Users</p>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-yellow-600">{propertyDetails.property.conversionRate}%</p>
                                        <p className="text-sm text-gray-600">Conversion</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 mb-2">Recent Users</h5>
                                    <div className="space-y-2">
                                        {propertyDetails.recentUsers.map((user, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <div>
                                                    <p className="text-sm font-medium">{user.userId?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{user.userId?.email || user.userId?.phone}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">{user.interactionType}</p>
                                                    <p className="text-xs text-gray-500">{new Date(user.timestamp).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {modalContent === 'user' && userJourney && (
                            <div>
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900">{userJourney.user.name}</h4>
                                    <p className="text-sm text-gray-600">{userJourney.user.email} • {userJourney.user.phone}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-blue-600">{userJourney.metrics.totalInteractions}</p>
                                        <p className="text-sm text-gray-600">Total Interactions</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-green-600">{userJourney.metrics.contactsMade}</p>
                                        <p className="text-sm text-gray-600">Contacts Made</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded text-center">
                                        <p className="text-2xl font-bold text-purple-600">{userJourney.metrics.journeyDuration}</p>
                                        <p className="text-sm text-gray-600">Days Active</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h5 className="font-medium text-gray-900">Journey Timeline</h5>
                                    {userJourney.journey.map((step, idx) => (
                                        <div key={idx} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${step.interactionType === 'CONTACT' ? 'bg-green-500' :
                                                        step.interactionType === 'SAVE' ? 'bg-yellow-500' : 'bg-blue-500'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-medium">{step.interactionType}</span>
                                                    {step.targetDetails && (
                                                        <span className="text-gray-600"> - {step.targetDetails.title}</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(step.timestamp).toLocaleDateString()} • Day {step.daysSinceStart}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {modalContent === 'commission' && (
                            <CommissionSimulator commissionData={commissionData} />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Commission Simulator Component
    const CommissionSimulator = ({ commissionData }) => {
        if (!commissionData) return null;

        return (
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Commission Pipeline Overview</h4>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-green-900">Expected Monthly Commission</p>
                            <p className="text-2xl font-bold text-green-700">{formatCurrency(commissionData.projections.monthly)}</p>
                            <p className="text-xs text-green-600 mt-1">Based on {commissionData.commissionRate}% commission rate</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-900">Total Pipeline Value</p>
                            <p className="text-2xl font-bold text-blue-700">{formatCurrency(commissionData.totals.totalPotentialCommission)}</p>
                            <p className="text-xs text-blue-600 mt-1">From {commissionData.totals.totalProperties} properties</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-purple-900">Yearly Projection</p>
                            <p className="text-2xl font-bold text-purple-700">{formatCurrency(commissionData.projections.yearly)}</p>
                            <p className="text-xs text-purple-600 mt-1">If current pace continues</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h5 className="font-medium text-gray-900 mb-3">Pipeline by Probability</h5>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                                <p className="font-medium text-green-900">High Probability (70%+)</p>
                                <p className="text-sm text-green-700">{commissionData.probabilityRanges.high.length} properties</p>
                            </div>
                            <p className="text-lg font-bold text-green-900">{formatCurrency(commissionData.totals.highProbabilityCommission)}</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                                <p className="font-medium text-yellow-900">Medium Probability (40-69%)</p>
                                <p className="text-sm text-yellow-700">{commissionData.probabilityRanges.medium.length} properties</p>
                            </div>
                            <p className="text-lg font-bold text-yellow-900">{formatCurrency(commissionData.totals.mediumProbabilityCommission)}</p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                                {/* <p className="font-medium text-red-900">Low Probability (<40%)</p> */}
                                <p className="text-sm text-red-700">{commissionData.probabilityRanges.low.length} properties</p>
                            </div>
                            <p className="text-lg font-bold text-red-900">{formatCurrency(commissionData.totals.lowProbabilityCommission)}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h5 className="font-medium text-gray-900 mb-3">Top Properties in Pipeline</h5>
                    <div className="space-y-2">
                        {commissionData.pipeline.slice(0, 5).map((prop, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 truncate">{prop.propertyTitle || 'Property'}</p>
                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                        <span>{prop.contactCount} contacts</span>
                                        <span>{prop.uniqueUserCount} users</span>
                                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getPropensityColor(prop.probability)}`}>
                                            {prop.probability}% likely
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="font-medium text-gray-900">{formatCurrency(prop.expectedCommission)}</p>
                                    <p className="text-xs text-gray-500">Expected commission</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Calendar component
    const CalendarView = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const getDayData = (day) => {
            if (!calendarData?.dailyInteractions) return null;
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return calendarData.dailyInteractions.find(d => d._id === dateStr);
        };

        const handleDayClick = (day) => {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setSelectedDate(dateStr);
            fetchDailyDetails(dateStr);
        };

        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Interaction Calendar</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => {
                            if (selectedMonth === 0) {
                                setSelectedMonth(11);
                                setSelectedYear(selectedYear - 1);
                            } else {
                                setSelectedMonth(selectedMonth - 1);
                            }
                        }} className="p-2 hover:bg-gray-100 rounded">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium">{monthNames[selectedMonth]} {selectedYear}</span>
                        <button onClick={() => {
                            if (selectedMonth === 11) {
                                setSelectedMonth(0);
                                setSelectedYear(selectedYear + 1);
                            } else {
                                setSelectedMonth(selectedMonth + 1);
                            }
                        }} className="p-2 hover:bg-gray-100 rounded">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayData = getDayData(day);
                        return (
                            <div
                                key={day}
                                className={`aspect-square border rounded-lg p-2 cursor-pointer transition-colors ${dayData ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleDayClick(day)}
                            >
                                <div className="text-sm font-medium">{day}</div>
                                {dayData && (
                                    <div className="mt-1">
                                        <div className="text-xs text-blue-600 font-semibold">{dayData.totalCount}</div>
                                        <div className="text-xs text-gray-500">interactions</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {calendarData?.scheduledFollowups?.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Scheduled Follow-ups</h4>
                        <div className="space-y-2">
                            {calendarData.scheduledFollowups.map((followup, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{followup.userName}</p>
                                        <p className="text-xs text-gray-500">{followup.date} at {followup.time}</p>
                                    </div>
                                    <Phone className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center">
                        <div className="text-red-400 mr-3">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchContactInteractions()}
                        className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Modal />

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Contact Interactions Dashboard</h1>
                        <p className="mt-2 text-gray-600">Monitor and manage user contact requests with AI-powered insights</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('buyers')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'buyers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Buyer Insights
                        </button>
                        <button
                            onClick={() => setActiveTab('properties')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'properties'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Property Performance
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'calendar'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Calendar
                        </button>
                        <button
                            onClick={() => setActiveTab('insights')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'insights'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Market Insights
                        </button>
                        <button
                            onClick={() => setActiveTab('commission')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'commission'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Calculator className="w-4 h-4 mr-1" />
                            Commission
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'overview' && (
                    <>
                        {/* Period Selector */}
                        <div className="flex space-x-2 mb-6">
                            <button
                                onClick={() => setSelectedPeriod('day')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'day'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('week')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'week'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('month')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedPeriod === 'month'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                This Month
                            </button>
                        </div>

                        {/* Basic Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-500">Total Contacts</div>
                                            <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-500">Today's Contacts</div>
                                            <div className="text-2xl font-bold text-gray-900">{stats.todayContacts}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {detailedMetrics?.conversionMetrics?.totalUsers > 0
                                                    ? `${((detailedMetrics.conversionMetrics.viewedAndContacted / detailedMetrics.conversionMetrics.totalUsers) * 100).toFixed(1)}%`
                                                    : '0%'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white overflow-hidden shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => {
                                    setModalContent('commission');
                                    setShowModal(true);
                                }}
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                                <DollarSign className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-500">Expected Revenue</div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {commissionData ? formatCurrency(commissionData.totals.totalExpectedCommission) : '₹0'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Users and Properties Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Top Users */}
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Most Active Users</h3>
                                    <div className="space-y-3">
                                        {detailedMetrics?.topUsers?.map((user, index) => (
                                            <div
                                                key={user.userId}
                                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                                onClick={() => fetchUserJourney(user.userId)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                                                            <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">{user.contactCount} contacts</p>
                                                    <p className="text-xs text-gray-500">Last: {new Date(user.lastContact).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Properties */}
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Most Contacted Properties</h3>
                                    <div className="space-y-3">
                                        {detailedMetrics?.topProperties?.map((prop, index) => (
                                            <div
                                                key={prop._id.entityId}
                                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                                onClick={() => prop.details?.id && fetchPropertyDetails(prop.details.id)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                                                        </span>
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {prop.details?.title || 'Unknown Property'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{prop.details?.location || 'Location N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-2">
                                                    <p className="text-sm font-semibold text-gray-900">{prop.contactCount} contacts</p>
                                                    <p className="text-xs text-gray-500">{prop.uniqueUserCount} users</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Insights Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Location Insights */}
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h3>
                                    <div className="space-y-2">
                                        {detailedMetrics?.locationInsights?.map((location, index) => (
                                            <div key={location.city} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">{location.city}</span>
                                                <span className="text-sm font-medium text-gray-900">{location.count} contacts</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Builder Performance */}
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Builders</h3>
                                    <div className="space-y-2">
                                        {detailedMetrics?.builderPerformance?.map((builder) => (
                                            <div key={builder.builderId} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 truncate">{builder.name || 'Unknown'}</span>
                                                <span className="text-sm font-medium text-gray-900">{builder.contactCount} contacts</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Peak Hours */}
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Contact Hours</h3>
                                    <div className="space-y-2">
                                        {detailedMetrics?.hourlyTrends?.slice(0, 5).map((hour) => (
                                            <div key={hour._id} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">{hour._id}:00 - {hour._id + 1}:00</span>
                                                <span className="text-sm font-medium text-gray-900">{hour.count} contacts</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'buyers' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Buyer Propensity Analysis</h2>

                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">High-Intent Buyers</h3>
                                <p className="text-sm text-gray-600 mb-6">Users most likely to make a purchase based on behavioral patterns</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Properties</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {buyerPropensity.map((buyer) => (
                                            <tr key={buyer.userId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() => fetchUserJourney(buyer.userId)}
                                                    >
                                                        <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                            {buyer.userInfo.name || 'Unknown'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {buyer.userInfo.email || buyer.userInfo.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPropensityColor(buyer.propensityScore)}`}>
                                                            {buyer.propensityScore.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="flex items-center space-x-2">
                                                            <span>{buyer.metrics.totalInteractions} interactions</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {buyer.metrics.contactCount} contacts • {buyer.metrics.saveCount} saves
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        {buyer.recentProperties?.slice(0, 2).map((prop, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="text-gray-600 truncate cursor-pointer hover:text-blue-600"
                                                                style={{ maxWidth: '200px' }}
                                                                onClick={() => prop?.post_id && fetchPropertyDetails(prop.post_id)}
                                                            >
                                                                • {prop?.post_title || 'Property'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {buyer.lastActivityDaysAgo === 0 ? 'Today' :
                                                            buyer.lastActivityDaysAgo === 1 ? 'Yesterday' :
                                                                `${buyer.lastActivityDaysAgo} days ago`}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                                        Contact Now
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'properties' && propertyPerformance && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Performance Analysis</h2>

                        {/* High Likelihood Properties */}
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Properties Most Likely to Sell</h3>
                                        <p className="text-sm text-gray-600 mt-1">Based on engagement metrics and market indicators</p>
                                    </div>
                                    <Award className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {propertyPerformance?.highLikelihoodProperties?.map((property) => (
                                    <div
                                        key={property?.propertyId}
                                        className="p-6 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => fetchPropertyDetails(property?.propertyId)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                    {property?.propertyInfo?.title || 'Property'}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {property?.propertyInfo?.location} • {formatCurrency(property?.propertyInfo?.price || 0)}
                                                </p>
                                                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                                                    <span>{property?.metrics.totalViews} views</span>
                                                    <span>{property?.metrics.totalContacts} contacts</span>
                                                    <span>{property?.metrics.conversionRate.toFixed(1)}% conversion</span>
                                                    <span>{property?.metrics.uniqueUserCount} interested users</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPropensityColor(property?.saleLikelihoodScore)}`}>
                                                    {property?.saleLikelihoodScore?.toFixed(0)}% likely
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Low Performing Properties */}
                        <div className="bg-white shadow-sm rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Low Performing Properties</h3>
                                        <p className="text-sm text-gray-600 mt-1">Properties that need attention or price adjustment</p>
                                    </div>
                                    <AlertCircle className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {propertyPerformance.lowPerformingProperties?.map((property) => (
                                    <div
                                        key={property.propertyId}
                                        className="p-6 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => fetchPropertyDetails(property.propertyId)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                    {property.propertyInfo?.title || 'Property'}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {property.propertyInfo?.location} • {formatCurrency(property.propertyInfo?.price || 0)}
                                                </p>
                                                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                                                    <span className="text-red-600">{property.metrics.totalViews} views only</span>
                                                    <span>{property.metrics.daysOnMarket} days on market</span>
                                                    <span>{property.metrics.daysSinceLastActivity} days since last activity</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-600">
                                                    Needs Review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <CalendarView />
                )}

                {activeTab === 'commission' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Simulator</h2>
                        <CommissionSimulator commissionData={commissionData} />
                    </div>
                )}

                {activeTab === 'insights' && predictiveInsights && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Intelligence</h2>

                        {/* Market Trend */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Market Momentum</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {predictiveInsights.insights?.trendDirection || 'Analyzing...'}
                                    </p>
                                    <p className="text-sm text-gray-500">Overall market activity trend</p>
                                </div>
                                <div>
                                    {predictiveInsights.insights?.trendDirection === 'Upward' ? (
                                        <TrendingUp className="w-12 h-12 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-12 h-12 text-red-500" />
                                    )}
                                </div>
                            </div>

                            {/* Weekly Trends Chart */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-700">Weekly Activity</h4>
                                {predictiveInsights.marketMomentum?.map((week) => (
                                    <div key={`${week._id.year}-${week._id.week}`} className="flex items-center">
                                        <span className="text-xs text-gray-500 w-20">Week {week._id.week}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-6 ml-2">
                                            <div
                                                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                                                style={{ width: `${(week.interactions / Math.max(...predictiveInsights.marketMomentum.map(w => w.interactions))) * 100}%` }}
                                            >
                                                <span className="text-xs text-white font-medium">{week.interactions}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Sensitivity */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range Analysis</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Most active price range: <span className="font-semibold text-gray-900">{predictiveInsights.insights?.mostActivePriceRange}</span>
                            </p>
                            <div className="space-y-3">
                                {predictiveInsights.priceSensitivity?.map((range) => (
                                    <div key={range._id.priceRange} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">{range._id.priceRange}</span>
                                                <span className="text-sm text-gray-500">{range.totalInteractions} interactions</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${(range.conversionRate * 100).toFixed(0)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">{range.contacts} contacts</span>
                                                <span className="text-xs text-gray-500">{(range.conversionRate * 100).toFixed(1)}% conversion</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actionable Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-blue-900 mb-4">AI-Powered Recommendations</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">1</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-900">
                                            <span className="font-semibold">Focus on {predictiveInsights.insights?.mostActivePriceRange} properties</span>
                                            {' - '}This price range shows the highest engagement and conversion rates.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">2</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-900">
                                            <span className="font-semibold">Schedule follow-ups during peak hours</span>
                                            {' - '}Your data shows highest engagement between {detailedMetrics?.hourlyTrends?.[0]?._id || 10}:00 - {(detailedMetrics?.hourlyTrends?.[0]?._id || 10) + 2}:00.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">3</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-900">
                                            <span className="font-semibold">Prioritize high-propensity buyers</span>
                                            {' - '}Contact the top {buyerPropensity.filter(b => b.propensityScore >= 70).length} buyers with 70%+ scores immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactions Table - shown only in overview tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Search Bar */}
                        <div className="bg-white shadow-sm rounded-lg mb-6">
                            <div className="p-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by user name, email, builder name, or property title..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Interactions Table */}
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Builder</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredInteractions.length > 0 ? (
                                            filteredInteractions.map((interaction) => (
                                                <tr key={interaction.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => interaction.user?.id && fetchUserJourney(interaction.user.id)}
                                                        >
                                                            <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                                {interaction.user?.name || 'Unknown User'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {interaction.user?.email || 'No Email'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {interaction.builder?.name || 'Unknown Builder'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {interaction.builder?.company || 'No Company'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => interaction.target?.id && fetchPropertyDetails(interaction.target.id)}
                                                        >
                                                            <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                                {interaction.target?.title || 'Unknown Target'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {interaction.target?.location || 'Unknown Location'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(interaction.interactionEntity)}`}>
                                                            {interaction.target?.type || interaction.interactionEntity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {interaction.phoneNumber || 'No Phone'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {interaction.location?.city || 'Unknown City'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(interaction.timestamp)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    {searchTerm ? 'No interactions found matching your search.' : 'No contact interactions found.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!pagination.hasPrevPage}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!pagination.hasNextPage}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                                                <span className="font-medium">{pagination.totalPages}</span>
                                                {' '}({pagination.total} total interactions)
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={!pagination.hasPrevPage}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={!pagination.hasNextPage}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactDashboard;