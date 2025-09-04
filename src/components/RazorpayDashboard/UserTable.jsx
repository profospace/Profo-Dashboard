// // // import React, { useState , useEffect } from 'react';
// // // import { Search, Filter, Download, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

// // // const UserTable = ({ adminAPI }) => {
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [selectedUsers, setSelectedUsers] = useState([]);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [users, setUsers] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [totalUsers, setTotalUsers] = useState(0);
// // //   const [totalPages, setTotalPages] = useState(0);
// // //   const usersPerPage = 10;

// // //   useEffect(() => {
// // //     fetchUsers();
// // //   }, [currentPage, searchTerm]);

// // //   const fetchUsers = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await adminAPI.getUsers(currentPage, usersPerPage, searchTerm);
// // //       setUsers(response.users);
// // //       setTotalUsers(response.pagination.totalUsers);
// // //       setTotalPages(response.pagination.totalPages);
// // //     } catch (error) {
// // //       console.error('Error fetching users:', error);
// // //       setUsers([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleSearchChange = (e) => {
// // //     setSearchTerm(e.target.value);
// // //     setCurrentPage(1); // Reset to first page when searching
// // //   };

// // //   const handleSelectUser = (userId) => {
// // //     setSelectedUsers(prev =>
// // //       prev.includes(userId)
// // //         ? prev.filter(id => id !== userId)
// // //         : [...prev, userId]
// // //     );
// // //   };

// // //   const handleSelectAll = () => {
// // //     if (selectedUsers.length === users.length) {
// // //       setSelectedUsers([]);
// // //     } else {
// // //       setSelectedUsers(users.map(user => user.id));
// // //     }
// // //   };

// // //   const getStatusBadge = (status) => {
// // //     const badges = {
// // //       active: 'bg-green-100 text-green-800',
// // //       inactive: 'bg-gray-100 text-gray-800',
// // //       suspended: 'bg-red-100 text-red-800'
// // //     };
// // //     return badges[status] || badges.inactive;
// // //   };

// // //   const getLoginTypeBadge = (type) => {
// // //     const badges = {
// // //       EMAIL: 'bg-blue-100 text-blue-800',
// // //       GOOGLE: 'bg-red-100 text-red-800',
// // //       FACEBOOK: 'bg-blue-100 text-blue-800',
// // //       PHONE: 'bg-green-100 text-green-800',
// // //       APPLE: 'bg-gray-100 text-gray-800'
// // //     };
// // //     return badges[type] || badges.EMAIL;
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header */}
// // //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //         <div>
// // //           <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
// // //           <p className="text-gray-600 text-sm mt-1">Manage and monitor all registered users</p>
// // //         </div>
// // //         <div className="flex items-center space-x-3">
// // //           <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
// // //             <Download className="w-4 h-4 mr-2" />
// // //             Export
// // //           </button>
// // //           <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
// // //             <Filter className="w-4 h-4 mr-2" />
// // //             Filter
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Search and Stats */}
// // //       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
// // //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //           <div className="relative flex-1 max-w-md">
// // //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// // //             <input
// // //               type="text"
// // //               placeholder="Search users by name, email, or phone..."
// // //               value={searchTerm}
// // //               onChange={handleSearchChange}
// // //               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             />
// // //           </div>
          
// // //           <div className="flex items-center space-x-6 text-sm">
// // //             <div className="text-center">
// // //               <p className="font-semibold text-gray-900">{totalUsers?.toLocaleString() || 0}</p>
// // //               <p className="text-gray-600">Total Users</p>
// // //             </div>
// // //             <div className="text-center">
// // //               <p className="font-semibold text-green-600">
// // //                 {users?.filter(u => u.status === 'active').length.toLocaleString() || 0}
// // //               </p>
// // //               <p className="text-gray-600">Active</p>
// // //             </div>
// // //             <div className="text-center">
// // //               <p className="font-semibold text-blue-600">
// // //                 ₹{users?.reduce((sum, u) => sum + u.walletBalance, 0).toLocaleString() || 0}
// // //               </p>
// // //               <p className="text-gray-600">Total Balance</p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Users Table */}
// // //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// // //         {loading && (
// // //           <div className="flex items-center justify-center py-8">
// // //             <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
// // //             <span className="text-gray-600">Loading users...</span>
// // //           </div>
// // //         )}
        
// // //         <div className="overflow-x-auto">
// // //           <table className="min-w-full divide-y divide-gray-200">
// // //             <thead className="bg-gray-50">
// // //               <tr>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={selectedUsers.length === users.length && users.length > 0}
// // //                     onChange={handleSelectAll}
// // //                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// // //                   />
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   User
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Contact
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Login Type
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Wallet Balance
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Plans
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Status
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Last Login
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Actions
// // //                 </th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="bg-white divide-y divide-gray-200">
// // //               {!loading && users.map((user) => (
// // //                 <tr key={user.id} className="hover:bg-gray-50 transition-colors">
// // //                   <td className="px-6 py-4 whitespace-nowrap">
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={selectedUsers.includes(user.id)}
// // //                       onChange={() => handleSelectUser(user.id)}
// // //                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// // //                     />
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap">
// // //                     <div className="flex items-center">
// // //                       <div className="flex-shrink-0 h-10 w-10">
// // //                         <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
// // //                           <span className="text-blue-600 font-medium text-sm">
// // //                             {user.name.split(' ').map(n => n[0]).join('')}
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                       <div className="ml-4">
// // //                         <div className="text-sm font-medium text-gray-900">{user.name}</div>
// // //                         <div className="text-sm text-gray-500">ID: {user.id}</div>
// // //                       </div>
// // //                     </div>
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap">
// // //                     <div className="text-sm text-gray-900">{user.email}</div>
// // //                     <div className="text-sm text-gray-500 flex items-center">
// // //                       {user.phone}
// // //                       {user.isPhoneVerified && (
// // //                         <span className="ml-1 text-green-500">✓</span>
// // //                       )}
// // //                     </div>
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap">
// // //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoginTypeBadge(user.loginType)}`}>
// // //                       {user.loginType}
// // //                     </span>
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // //                     ₹{user.walletBalance.toLocaleString()}
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // //                     {user.plansPurchased}
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap">
// // //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
// // //                       {user.status}
// // //                     </span>
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // //                     {user.lastLogin}
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// // //                     <div className="flex items-center space-x-2">
// // //                       <button className="text-blue-600 hover:text-blue-700 p-1">
// // //                         <Eye className="w-4 h-4" />
// // //                       </button>
// // //                       <button className="text-gray-600 hover:text-gray-700 p-1">
// // //                         <Edit className="w-4 h-4" />
// // //                       </button>
// // //                       <button className="text-red-600 hover:text-red-700 p-1">
// // //                         <Trash2 className="w-4 h-4" />
// // //                       </button>
// // //                       <button className="text-gray-400 hover:text-gray-600 p-1">
// // //                         <MoreHorizontal className="w-4 h-4" />
// // //                       </button>
// // //                     </div>
// // //                   </td>
// // //                 </tr>
// // //               ))}
              
// // //               {!loading && users.length === 0 && (
// // //                 <tr>
// // //                   <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
// // //                     {searchTerm ? 'No users found matching your search.' : 'No users found.'}
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         {/* Pagination */}
// // //         {!loading && totalUsers > 0 && (
// // //           <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
// // //           <div className="flex-1 flex justify-between sm:hidden">
// // //             <button
// // //               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // //               disabled={currentPage === 1}
// // //               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // //             >
// // //               Previous
// // //             </button>
// // //             <button
// // //               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // //               disabled={currentPage === totalPages}
// // //               className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // //             >
// // //               Next
// // //             </button>
// // //           </div>
// // //           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
// // //             <div>
// // //               <p className="text-sm text-gray-700">
// // //                 Showing <span className="font-medium">{((currentPage - 1) * usersPerPage) + 1}</span> to{' '}
// // //                 <span className="font-medium">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{' '}
// // //                 <span className="font-medium">{totalUsers}</span> results
// // //               </p>
// // //             </div>
// // //             <div>
// // //               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
// // //                 <button
// // //                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // //                   disabled={currentPage === 1}
// // //                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                 >
// // //                   Previous
// // //                 </button>
// // //                 {[...Array(Math.min(5, totalPages || 1))].map((_, i) => {
// // //                   const page = i + 1;
// // //                   return (
// // //                     <button
// // //                       key={page}
// // //                       onClick={() => setCurrentPage(page)}
// // //                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
// // //                         currentPage === page
// // //                           ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
// // //                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
// // //                       }`}
// // //                     >
// // //                       {page}
// // //                     </button>
// // //                   );
// // //                 })}
// // //                 <button
// // //                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // //                   disabled={currentPage === totalPages}
// // //                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // //                 >
// // //                   Next
// // //                 </button>
// // //               </nav>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default UserTable;


// // import React, { useState, useEffect } from 'react';
// // import { Search, Filter, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react';

// // const UserTable = ({ adminAPI }) => {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pagination, setPagination] = useState({});

// //   useEffect(() => {
// //     fetchUsers();
// //   }, [currentPage, searchTerm]);

// //   const fetchUsers = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await adminAPI.getUsers({
// //         page: currentPage,
// //         limit: 10,
// //         search: searchTerm
// //       });
// //       setUsers(response.users);
// //       setPagination(response.pagination);
// //     } catch (error) {
// //       console.error('Error fetching users:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSearch = (e) => {
// //     setSearchTerm(e.target.value);
// //     setCurrentPage(1);
// //   };

// //   const getStatusColor = (status) => {
// //     return status === 'active'
// //       ? 'bg-green-100 text-green-800'
// //       : 'bg-gray-100 text-gray-800';
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-4">
// //       {/* Search and Filters */}
// //       <div className="bg-white p-6 rounded-lg shadow">
// //         <div className="flex items-center justify-between mb-4">
// //           <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
// //           <div className="flex items-center space-x-4">
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //               <input
// //                 type="text"
// //                 placeholder="Search users..."
// //                 value={searchTerm}
// //                 onChange={handleSearch}
// //                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
// //               <Filter className="w-4 h-4 mr-2" />
// //               Filter
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Users Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   User
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Contact
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Wallet Balance
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Plans
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Status
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Last Login
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {users.map((user) => (
// //                 <tr key={user.id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div>
// //                       <div className="text-sm font-medium text-gray-900">
// //                         {user.name}
// //                       </div>
// //                       <div className="text-sm text-gray-500">
// //                         {user.loginType}
// //                       </div>
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm text-gray-900">{user.email}</div>
// //                     <div className="text-sm text-gray-500">{user.phone}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm font-medium text-gray-900">
// //                       ₹{user.walletBalance.toLocaleString()}
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm text-gray-900">
// //                       {user.plansPurchased} plans
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
// //                       {user.status}
// //                     </span>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {user.lastLogin}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                     <div className="flex items-center space-x-2">
// //                       <button className="text-blue-600 hover:text-blue-900">
// //                         <Eye className="w-4 h-4" />
// //                       </button>
// //                       <button className="text-gray-400 hover:text-gray-600">
// //                         <MoreHorizontal className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pagination */}
// //         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
// //           <div className="flex items-center">
// //             <p className="text-sm text-gray-700">
// //               Showing page {pagination.currentPage} of {pagination.totalPages}
// //               ({pagination.totalUsers} total users)
// //             </p>
// //           </div>
// //           <div className="flex items-center space-x-2">
// //             <button
// //               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
// //               disabled={!pagination.hasPrevPage}
// //               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <ChevronLeft className="w-4 h-4" />
// //             </button>
// //             <button
// //               onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
// //               disabled={!pagination.hasNextPage}
// //               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <ChevronRight className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserTable;

// import React, { useState, useEffect } from 'react';
// import {
//   Search,
//   Filter,
//   Download,
//   Eye,
//   Wallet,
//   Calendar,
//   User,
//   Phone,
//   Mail,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard
// } from 'lucide-react';

// const UserTable = ({ adminAPI }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [sortBy, setSortBy] = useState('createdAt');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);

//   const limit = 10;

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage, searchQuery, filterStatus, sortBy, sortOrder]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: currentPage,
//         limit: limit,
//         search: searchQuery,
//         status: filterStatus,
//         sortBy: sortBy,
//         sortOrder: sortOrder
//       };

//       const response = await adminAPI.getUsers(params);
//       setUsers(response.users || []);
//       setTotalPages(response.totalPages || 1);
//       setTotalUsers(response.totalUsers || 0);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (e) => {
//     setFilterStatus(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('desc');
//     }
//     setCurrentPage(1);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getActivePlan = (user) => {
//     if (!user.plans || !user.plans.currentActive || user.plans.currentActive.length === 0) {
//       return null;
//     }

//     const activePlans = user.plans.currentActive.filter(plan =>
//       new Date(plan.expiresAt) > new Date()
//     );

//     return activePlans.length > 0 ? activePlans[0] : null;
//   };

//   const getPlanStatus = (plan) => {
//     if (!plan) return { status: 'No Plan', color: 'gray' };

//     const expiryDate = new Date(plan.expiresAt);
//     const today = new Date();
//     const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

//     if (daysLeft < 0) {
//       return { status: 'Expired', color: 'red' };
//     } else if (daysLeft <= 7) {
//       return { status: 'Expiring Soon', color: 'yellow' };
//     } else {
//       return { status: 'Active', color: 'green' };
//     }
//   };

//   const viewUserDetails = (user) => {
//     setSelectedUser(user);
//     setShowUserModal(true);
//   };

//   const exportUsers = () => {
//     // Implementation for exporting users to CSV
//     console.log('Exporting users...');
//   };

//   if (loading && users.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
//         <div className="flex items-center justify-center">
//           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <span className="ml-3 text-gray-600">Loading users...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
//             <p className="text-gray-600 mt-1">
//               Manage and monitor user accounts, wallet balances, and active plans
//             </p>
//           </div>
//           <button
//             onClick={exportUsers}
//             className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export</span>
//           </button>
//         </div>

//         {/* Filters and Search */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search users by name, email, or phone..."
//               value={searchQuery}
//               onChange={handleSearch}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="flex items-center space-x-3">
//             <Filter className="w-4 h-4 text-gray-400" />
//             <select
//               value={filterStatus}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Users</option>
//               <option value="active">Active Plans</option>
//               <option value="expired">Expired Plans</option>
//               <option value="no-plan">No Plans</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User Info
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('profile.wallet.balance')}>
//                   Wallet Balance
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Active Plan
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Plan Expiry
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => {
//                 const activePlan = getActivePlan(user);
//                 const planStatus = getPlanStatus(activePlan);

//                 return (
//                   <tr key={user._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <User className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.name || 'N/A'}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {user._id.slice(-8)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {user.email && (
//                           <div className="flex items-center mb-1">
//                             <Mail className="w-3 h-3 text-gray-400 mr-1" />
//                             {user.email}
//                           </div>
//                         )}
//                         {user.phone && (
//                           <div className="flex items-center">
//                             <Phone className="w-3 h-3 text-gray-400 mr-1" />
//                             {user.phone}
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <Wallet className="w-4 h-4 text-green-600 mr-2" />
//                         <span className="text-sm font-medium text-gray-900">
//                           {formatCurrency(user.profile?.wallet?.balance)}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {activePlan ? (
//                         <div className="text-sm">
//                           <div className="font-medium text-gray-900 capitalize">
//                             {activePlan.planType} Plan
//                           </div>
//                           <div className="text-gray-500">
//                             {activePlan.features?.contactsRemaining} contacts left
//                           </div>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-500">No active plan</span>
//                       )}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {activePlan ? (
//                         <div className="flex items-center">
//                           <Calendar className="w-4 h-4 text-gray-400 mr-2" />
//                           <span className="text-sm text-gray-900">
//                             {formatDate(activePlan.expiresAt)}
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-500">N/A</span>
//                       )}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planStatus.color === 'green' ? 'bg-green-100 text-green-800' :
//                           planStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
//                             planStatus.color === 'red' ? 'bg-red-100 text-red-800' :
//                               'bg-gray-100 text-gray-800'
//                         }`}>
//                         {planStatus.status}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => viewUserDetails(user)}
//                         className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-600">
//               Showing {Math.min((currentPage - 1) * limit + 1, totalUsers)} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} results
//             </div>

//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>

//               <div className="flex space-x-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const pageNum = currentPage - 2 + i;
//                   if (pageNum < 1 || pageNum > totalPages) return null;

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`w-8 h-8 rounded-lg text-sm font-medium ${pageNum === currentPage
//                           ? 'bg-blue-600 text-white'
//                           : 'text-gray-600 hover:bg-gray-100'
//                         }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//               </div>

//               <button
//                 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* User Details Modal */}
//       {showUserModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-gray-900">User Details</h3>
//                 <button
//                   onClick={() => setShowUserModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {/* Basic Info */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm text-gray-600">Name</label>
//                       <p className="font-medium">{selectedUser.name || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600">Login Type</label>
//                       <p className="font-medium">{selectedUser.loginType}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600">Email</label>
//                       <p className="font-medium">{selectedUser.email || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600">Phone</label>
//                       <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600">Joined</label>
//                       <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
//                     </div>
//                     <div>
//                       <label className="text-sm text-gray-600">Last Login</label>
//                       <p className="font-medium">{formatDate(selectedUser.lastLogin)}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Wallet Info */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                     <Wallet className="w-4 h-4 mr-2" />
//                     Wallet Information
//                   </h4>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-2xl font-bold text-green-600">
//                       {formatCurrency(selectedUser.profile?.wallet?.balance)}
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">Current Balance</p>
//                   </div>
//                 </div>

//                 {/* Plan Details */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                     <CreditCard className="w-4 h-4 mr-2" />
//                     Plan Details
//                   </h4>
//                   {selectedUser.plans?.currentActive?.length > 0 ? (
//                     <div className="space-y-3">
//                       {selectedUser.plans.currentActive.map((plan, index) => (
//                         <div key={index} className="bg-gray-50 p-4 rounded-lg">
//                           <div className="flex justify-between items-start mb-2">
//                             <h5 className="font-medium capitalize">{plan.planType} Plan</h5>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${new Date(plan.expiresAt) > new Date()
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-red-100 text-red-800'
//                               }`}>
//                               {new Date(plan.expiresAt) > new Date() ? 'Active' : 'Expired'}
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div>
//                               <span className="text-gray-600">Expires:</span>
//                               <p className="font-medium">{formatDate(plan.expiresAt)}</p>
//                             </div>
//                             <div>
//                               <span className="text-gray-600">Contacts Left:</span>
//                               <p className="font-medium">{plan.features?.contactsRemaining || 0}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic">No active plans</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserTable;

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Wallet,
  Calendar,
  User,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Edit,
  Plus,
  Minus
} from 'lucide-react';

const UserTable = ({ adminAPI }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState({ type: 'CREDIT', amount: '', description: '' });
  const [walletLoading, setWalletLoading] = useState(false);

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, filterStatus, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: limit,
        search: searchQuery,
        status: filterStatus,
        sortBy: sortBy,
        sortOrder: sortOrder
      };

      const response = await adminAPI.getUsers(params);
      if (response.success) {
        setUsers(response.users || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalUsers(response.pagination?.totalUsers || 0);
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivePlan = (user) => {
    if (!user.plans || !user.plans.currentActive || user.plans.currentActive.length === 0) {
      return null;
    }

    const activePlans = user.plans.currentActive.filter(plan =>
      new Date(plan.expiresAt) > new Date()
    );

    return activePlans.length > 0 ? activePlans[0] : null;
  };

  const getPlanStatus = (plan) => {
    if (!plan) return { status: 'No Plan', color: 'gray' };

    const expiryDate = new Date(plan.expiresAt);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { status: 'Expired', color: 'red' };
    } else if (daysLeft <= 7) {
      return { status: 'Expiring Soon', color: 'yellow' };
    } else {
      return { status: 'Active', color: 'green' };
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openWalletModal = (user) => {
    setSelectedUser(user);
    setWalletAction({ type: 'CREDIT', amount: '', description: '' });
    setShowWalletModal(true);
  };

  const handleWalletUpdate = async () => {
    if (!selectedUser || !walletAction.amount) return;

    setWalletLoading(true);
    try {
      await adminAPI.updateUserWallet(
        selectedUser._id,
        parseFloat(walletAction.amount),
        walletAction.type,
        walletAction.description
      );

      // Refresh users list
      await fetchUsers();
      setShowWalletModal(false);
      setWalletAction({ type: 'CREDIT', amount: '', description: '' });
    } catch (error) {
      console.error('Error updating wallet:', error);
      alert('Failed to update wallet balance');
    } finally {
      setWalletLoading(false);
    }
  };

  const exportUsers = () => {
    // Implementation for exporting users to CSV
    console.log('Exporting users...');
  };

  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">
              Manage and monitor user accounts, wallet balances, and active plans
            </p>
          </div>
          <button
            onClick={exportUsers}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="active">Active Plans</option>
              <option value="expired">Expired Plans</option>
              <option value="no-plan">No Plans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('profile.wallet.balance')}>
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const activePlan = getActivePlan(user);
                const planStatus = getPlanStatus(activePlan);

                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email && (
                          <div className="flex items-center mb-1">
                            <Mail className="w-3 h-3 text-gray-400 mr-1" />
                            {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 text-gray-400 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wallet className="w-4 h-4 text-green-600 mr-2" />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(user.walletBalance || 0)}
                          </span>
                          <button
                            onClick={() => openWalletModal(user)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="Edit wallet balance"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {activePlan ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 capitalize">
                            {activePlan.planType} Plan
                          </div>
                          <div className="text-gray-500">
                            {activePlan.features?.contactsRemaining} contacts left
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No active plan</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {activePlan ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {formatDate(activePlan.expiresAt)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                          planStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            planStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {planStatus.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * limit + 1, totalUsers)} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage - 2 + i;
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Name</label>
                      <p className="font-medium">{selectedUser.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Login Type</label>
                      <p className="font-medium">{selectedUser.loginType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Joined</label>
                      <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Login</label>
                      <p className="font-medium">{formatDate(selectedUser.lastLogin)}</p>
                    </div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedUser.walletBalance || 0)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Current Balance</p>
                  </div>
                </div>

                {/* Plan Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Plan Details
                  </h4>
                  {selectedUser.plans?.currentActive?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.plans.currentActive.map((plan, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium capitalize">{plan.planType} Plan</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${new Date(plan.expiresAt) > new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {new Date(plan.expiresAt) > new Date() ? 'Active' : 'Expired'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Expires:</span>
                              <p className="font-medium">{formatDate(plan.expiresAt)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Contacts Left:</span>
                              <p className="font-medium">{plan.features?.contactsRemaining || 0}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No active plans</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Update Modal */}
      {showWalletModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Update Wallet Balance</h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User: {selectedUser.name || selectedUser.email || selectedUser.phone}
                  </label>
                  <div className="text-sm text-gray-600">
                    Current Balance: {formatCurrency(selectedUser.walletBalance || 0)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="CREDIT"
                        checked={walletAction.type === 'CREDIT'}
                        onChange={(e) => setWalletAction({ ...walletAction, type: e.target.value })}
                        className="mr-2"
                      />
                      <Plus className="w-4 h-4 text-green-600 mr-1" />
                      Credit (Add)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="DEBIT"
                        checked={walletAction.type === 'DEBIT'}
                        onChange={(e) => setWalletAction({ ...walletAction, type: e.target.value })}
                        className="mr-2"
                      />
                      <Minus className="w-4 h-4 text-red-600 mr-1" />
                      Debit (Subtract)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={walletAction.amount}
                    onChange={(e) => setWalletAction({ ...walletAction, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={walletAction.description}
                    onChange={(e) => setWalletAction({ ...walletAction, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Reason for wallet adjustment"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowWalletModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={walletLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWalletUpdate}
                    disabled={!walletAction.amount || walletLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {walletLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      `${walletAction.type === 'CREDIT' ? 'Add' : 'Subtract'} ₹${walletAction.amount || '0'}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;