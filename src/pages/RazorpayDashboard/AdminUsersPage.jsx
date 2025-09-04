// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Users, Wallet, Calendar, Phone, Mail, Eye, EyeOff, Search, Filter, RefreshCw } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';


// const AdminUsersPage = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterType, setFilterType] = useState('all');
//     const [showWalletDetails, setShowWalletDetails] = useState({});
//     const [stats, setStats] = useState({
//         totalUsers: 0,
//         totalWalletBalance: 0,
//         activeSubscriptions: 0,
//         expiringSoon: 0
//     });

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${base_url}/api/wallet/users`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust based on your auth implementation
//                 }
//             });
//             setUsers(response.data.users);
//             setStats(response.data.stats);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setError('Failed to fetch users data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleWalletDetails = (userId) => {
//         setShowWalletDetails(prev => ({
//             ...prev,
//             [userId]: !prev[userId]
//         }));
//     };

//     const formatDate = (date) => {
//         if (!date) return 'N/A';
//         return new Date(date).toLocaleDateString('en-IN', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//         });
//     };

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 0
//         }).format(amount || 0);
//     };

//     const getActivePlans = (user) => {
//         if (!user.plans?.currentActive) return [];
//         return user.plans.currentActive.filter(plan =>
//             plan.expiresAt && new Date(plan.expiresAt) > new Date()
//         );
//     };

//     const isExpiringSoon = (expiryDate) => {
//         if (!expiryDate) return false;
//         const daysDiff = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
//         return daysDiff <= 7 && daysDiff > 0;
//     };

//     const getPlanStatusColor = (expiryDate) => {
//         if (!expiryDate) return 'bg-gray-100 text-gray-600';
//         if (new Date(expiryDate) <= new Date()) return 'bg-red-100 text-red-600';
//         if (isExpiringSoon(expiryDate)) return 'bg-yellow-100 text-yellow-600';
//         return 'bg-green-100 text-green-600';
//     };

//     const filteredUsers = users.filter(user => {
//         const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.phone?.includes(searchTerm);

//         if (filterType === 'all') return matchesSearch;
//         if (filterType === 'active-plans') return matchesSearch && getActivePlans(user).length > 0;
//         if (filterType === 'no-plans') return matchesSearch && getActivePlans(user).length === 0;
//         if (filterType === 'high-balance') return matchesSearch && (user.profile?.wallet?.balance || 0) > 1000;

//         return matchesSearch;
//     });

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
//                     <p className="text-gray-600">Loading users data...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center text-red-600">
//                     <p className="text-xl font-semibold mb-2">Error</p>
//                     <p>{error}</p>
//                     <button
//                         onClick={fetchUsers}
//                         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             {/* Header */}
//             <div className="mb-8">
//                 <div className="flex items-center justify-between mb-6">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
//                         <p className="text-gray-600">Monitor user accounts, wallet balances, and active subscriptions</p>
//                     </div>
//                     <button
//                         onClick={fetchUsers}
//                         className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                     >
//                         <RefreshCw size={16} />
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-600 text-sm font-medium">Total Users</p>
//                                 <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
//                             </div>
//                             <div className="p-3 bg-blue-100 rounded-lg">
//                                 <Users className="text-blue-600" size={24} />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-600 text-sm font-medium">Total Wallet Balance</p>
//                                 <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalWalletBalance)}</p>
//                             </div>
//                             <div className="p-3 bg-green-100 rounded-lg">
//                                 <Wallet className="text-green-600" size={24} />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-600 text-sm font-medium">Active Subscriptions</p>
//                                 <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
//                             </div>
//                             <div className="p-3 bg-purple-100 rounded-lg">
//                                 <Calendar className="text-purple-600" size={24} />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
//                                 <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
//                             </div>
//                             <div className="p-3 bg-yellow-100 rounded-lg">
//                                 <Calendar className="text-yellow-600" size={24} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search and Filters */}
//                 <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//                     <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-1 relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                             <input
//                                 type="text"
//                                 placeholder="Search by name, email, or phone..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <Filter size={20} className="text-gray-400" />
//                             <select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Users</option>
//                                 <option value="active-plans">With Active Plans</option>
//                                 <option value="no-plans">No Active Plans</option>
//                                 <option value="high-balance">High Balance (>₹1000)</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Users Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {filteredUsers.map((user) => {
//                     const activePlans = getActivePlans(user);
//                     const walletBalance = user.profile?.wallet?.balance || 0;

//                     return (
//                         <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                             {/* User Header */}
//                             <div className="flex items-start justify-between mb-4">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                                         {user.name?.charAt(0)?.toUpperCase() || 'U'}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-semibold text-gray-900">{user.name || 'Unknown User'}</h3>
//                                         <p className="text-sm text-gray-500">ID: {user._id.slice(-6)}</p>
//                                     </div>
//                                 </div>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isPhoneVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
//                                     }`}>
//                                     {user.isPhoneVerified ? 'Verified' : 'Unverified'}
//                                 </span>
//                             </div>

//                             {/* Contact Info */}
//                             <div className="space-y-2 mb-4">
//                                 {user.email && (
//                                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                                         <Mail size={16} />
//                                         <span className="truncate">{user.email}</span>
//                                     </div>
//                                 )}
//                                 {user.phone && (
//                                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                                         <Phone size={16} />
//                                         <span>{user.phone}</span>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Wallet Section */}
//                             <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <Wallet className="text-green-600" size={20} />
//                                         <span className="font-medium text-gray-900">Wallet Balance</span>
//                                     </div>
//                                     <button
//                                         onClick={() => toggleWalletDetails(user._id)}
//                                         className="p-1 hover:bg-gray-200 rounded"
//                                     >
//                                         {showWalletDetails[user._id] ? <EyeOff size={16} /> : <Eye size={16} />}
//                                     </button>
//                                 </div>
//                                 <p className="text-2xl font-bold text-green-600 mt-1">
//                                     {formatCurrency(walletBalance)}
//                                 </p>
//                                 {showWalletDetails[user._id] && (
//                                     <div className="mt-2 text-sm text-gray-600">
//                                         <p>Currency: {user.profile?.wallet?.currency || 'INR'}</p>
//                                         <p>Last Updated: {formatDate(user.profile?.wallet?.lastUpdated)}</p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Active Plans */}
//                             <div>
//                                 <h4 className="font-medium text-gray-900 mb-2">
//                                     Active Plans ({activePlans.length})
//                                 </h4>
//                                 {activePlans.length > 0 ? (
//                                     <div className="space-y-2">
//                                         {activePlans.map((plan, index) => (
//                                             <div key={index} className={`p-3 rounded-lg border ${getPlanStatusColor(plan.expiresAt)}`}>
//                                                 <div className="flex items-center justify-between">
//                                                     <div>
//                                                         <p className="font-medium">{plan.planType?.toUpperCase() || 'Unknown Plan'}</p>
//                                                         <p className="text-xs opacity-75">
//                                                             Expires: {formatDate(plan.expiresAt)}
//                                                         </p>
//                                                     </div>
//                                                     {isExpiringSoon(plan.expiresAt) && (
//                                                         <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
//                                                             Expiring Soon
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 {plan.features && (
//                                                     <div className="mt-2 text-xs opacity-75">
//                                                         {plan.features.contactsRemaining > 0 && (
//                                                             <span className="mr-3">Contacts: {plan.features.contactsRemaining}</span>
//                                                         )}
//                                                         {plan.features.unlimitedMaps && (
//                                                             <span className="mr-3">Unlimited Maps</span>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <p className="text-gray-500 text-sm bg-gray-100 rounded-lg p-3">
//                                         No active plans
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Last Login */}
//                             {user.lastLogin && (
//                                 <div className="mt-4 pt-4 border-t border-gray-100">
//                                     <p className="text-xs text-gray-500">
//                                         Last login: {formatDate(user.lastLogin)}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             {filteredUsers.length === 0 && (
//                 <div className="text-center py-12">
//                     <Users className="mx-auto mb-4 text-gray-400" size={48} />
//                     <p className="text-gray-500 text-lg">No users found matching your criteria</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminUsersPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Wallet, Calendar, Phone, Mail, Eye, EyeOff, Search, Filter, RefreshCw } from 'lucide-react';
import { base_url } from '../../../utils/base_url';


const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showWalletDetails, setShowWalletDetails] = useState({});
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalWalletBalance: 0,
        activeSubscriptions: 0,
        expiringSoon: 0
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${base_url}/api/wallet/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust based on your auth implementation
                }
            });
            setUsers(response.data.users);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users data');
        } finally {
            setLoading(false);
        }
    };

    const toggleWalletDetails = (userId) => {
        setShowWalletDetails(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const getActivePlans = (user) => {
        if (!user.plans?.currentActive) return [];
        return user.plans.currentActive.filter(plan =>
            plan.expiresAt && new Date(plan.expiresAt) > new Date()
        );
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const daysDiff = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7 && daysDiff > 0;
    };

    const getPlanStatusColor = (expiryDate) => {
        if (!expiryDate) return 'bg-gray-100 text-gray-600';
        if (new Date(expiryDate) <= new Date()) return 'bg-red-100 text-red-600';
        if (isExpiringSoon(expiryDate)) return 'bg-yellow-100 text-yellow-600';
        return 'bg-green-100 text-green-600';
    };

    const getPurchasedPlans = (user) => {
        if (!user.plans?.purchased) return [];
        return user.plans.purchased.filter(plan => plan.isActive !== false);
    };

    const getActivePurchasedPlans = (user) => {
        if (!user.plans?.purchased) return [];
        return user.plans.purchased.filter(plan =>
            plan.status === 'active' &&
            (!plan.expiresAt || new Date(plan.expiresAt) > new Date())
        );
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);

        if (filterType === 'all') return matchesSearch;
        if (filterType === 'active-plans') return matchesSearch && getActivePurchasedPlans(user).length > 0;
        if (filterType === 'no-plans') return matchesSearch && getPurchasedPlans(user).length === 0;
        if (filterType === 'high-balance') return matchesSearch && (user.profile?.wallet?.balance || 0) > 1000;

        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
                    <p className="text-gray-600">Loading users data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            {/* <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
                        <p className="text-gray-600">Monitor user accounts, wallet balances, and active subscriptions</p>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Wallet Balance</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalWalletBalance)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Wallet className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Active Subscriptions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Calendar className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Users</option>
                                <option value="active-plans">With Active Plans</option>
                                <option value="no-plans">No Purchased Plans</option>
                                <option value="high-balance">High Balance (₹1000)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => {
                    const purchasedPlans = getPurchasedPlans(user);
                    const activePurchasedPlans = getActivePurchasedPlans(user);
                    const walletBalance = user.profile?.wallet?.balance || 0;

                    return (
                        <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{user.name || 'Unknown User'}</h3>
                                        <p className="text-sm text-gray-500">ID: {user._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isPhoneVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {user.isPhoneVerified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                {user.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={16} />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                )}
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={16} />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Wallet Section */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="text-green-600" size={20} />
                                        <span className="font-medium text-gray-900">Wallet Balance</span>
                                    </div>
                                    <button
                                        onClick={() => toggleWalletDetails(user._id)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        {showWalletDetails[user._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {formatCurrency(walletBalance)}
                                </p>
                                {showWalletDetails[user._id] && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p>Currency: {user.profile?.wallet?.currency || 'INR'}</p>
                                        <p>Last Updated: {formatDate(user.profile?.wallet?.lastUpdated)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Purchased Plans */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Purchased Plans ({purchasedPlans.length})
                                </h4>
                                {purchasedPlans.length > 0 ? (
                                    <div className="space-y-2">
                                        {purchasedPlans.map((plan, index) => {
                                            const isExpired = plan.expiresAt && new Date(plan.expiresAt) <= new Date();
                                            const isActive = plan.status === 'active' && !isExpired;

                                            return (
                                                <div key={index} className={`p-3 rounded-lg border ${plan.status === 'wallet_credited' ? 'bg-orange-100 text-orange-600' :
                                                        isExpired ? 'bg-red-100 text-red-600' :
                                                            isActive ? getPlanStatusColor(plan.expiresAt) :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">{plan.planType?.toUpperCase() || 'Unknown Plan'}</p>
                                                            <p className="text-xs opacity-75">
                                                                {plan.planName} - ₹{plan.price}
                                                            </p>
                                                            <p className="text-xs opacity-75">
                                                                {plan.expiresAt ? `Expires: ${formatDate(plan.expiresAt)}` : 'No Expiry'}
                                                            </p>
                                                            <p className="text-xs opacity-75">
                                                                Purchased: {formatDate(plan.purchasedAt)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${plan.status === 'active' ? 'bg-green-500 text-white' :
                                                                    plan.status === 'expired' ? 'bg-red-500 text-white' :
                                                                        plan.status === 'wallet_credited' ? 'bg-orange-500 text-white' :
                                                                            'bg-gray-500 text-white'
                                                                }`}>
                                                                {plan.status === 'wallet_credited' ? 'Refunded' : plan.status}
                                                            </span>
                                                            {isActive && isExpiringSoon(plan.expiresAt) && (
                                                                <div className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full mt-1">
                                                                    Expiring Soon
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {plan.features && (
                                                        <div className="mt-2 text-xs opacity-75">
                                                            {plan.features.contactsIncluded > 0 && (
                                                                <span className="mr-3">
                                                                    Contacts: {plan.features.contactsUsed || 0}/{plan.features.contactsIncluded}
                                                                </span>
                                                            )}
                                                            {plan.features.mapsIncluded && (
                                                                <span className="mr-3">Maps Included</span>
                                                            )}
                                                            {plan.features.unlimitedMaps && (
                                                                <span className="mr-3">Unlimited Maps</span>
                                                            )}
                                                            {plan.razorpayPaymentId && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Payment ID: {plan.razorpayPaymentId}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm bg-gray-100 rounded-lg p-3">
                                        No purchased plans
                                    </p>
                                )}
                            </div>

                            {/* Last Login */}
                            {user.lastLogin && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Last login: {formatDate(user.lastLogin)}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500 text-lg">No users found matching your criteria</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;