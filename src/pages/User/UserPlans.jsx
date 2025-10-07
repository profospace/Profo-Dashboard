// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Trash2, Calendar, Check, X, DollarSign, User, Package, AlertCircle } from 'lucide-react';
// import { base_url } from '../../../utils/base_url';
// import { getAuthConfig } from '../../../utils/authConfig';
// import axios from 'axios';

// const UserPlans = () => {
//     const [users, setUsers] = useState([]);
//     const [plans, setPlans] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showAddPlanModal, setShowAddPlanModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     // Form state for adding plan
//     const [newPlanForm, setNewPlanForm] = useState({
//         planId: '',
//         validityDays: 30,
//         customFeatures: {
//             contactsIncluded: 0,
//             mapsIncluded: 0,
//             unlimitedMaps: false
//         }
//     });

//     // Fetch available plans
//     useEffect(() => {
//         fetchPlans();
//     }, []);

//     const fetchPlans = async () => {
//         try {
//             const response = await fetch('/api/plans');
//             const data = await response.json();
//             if (data.success) {
//                 setPlans(data.plans);
//             }
//         } catch (err) {
//             console.error('Error fetching plans:', err);
//         }
//     };

//     // Search users
//     const searchUsers = async (query) => {
//         if (query.length < 3) {
//             setUsers([]);
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await fetch(`${base_url}/api/admin/plans/users/search?q=${encodeURIComponent(query)}`, getAuthConfig());
//             const data = await response.json();
//             if (data.success) {
//                 setUsers(data.users);
//             }
//         } catch (err) {
//             setError('Failed to search users');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Get user details with plans
//     const getUserDetails = async (userId) => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${base_url}/api/admin/plans/users/${userId}/plans`, getAuthConfig());
//             const data = await response.json();
//             if (data.success) {
//                 setSelectedUser(data.user);
//             }
//         } catch (err) {
//             setError('Failed to fetch user details');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Attach plan to user
//     const attachPlan = async () => {
//         if (!selectedUser || !newPlanForm.planId) {
//             setError('Please select a plan');
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await fetch(`${base_url}/api/admin/plans/users/${selectedUser._id}/plans/attach`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newPlanForm)
//             }, getAuthConfig());

//             const data = await response.json();
//             if (data.success) {
//                 setSuccess('Plan attached successfully');
//                 setShowAddPlanModal(false);
//                 getUserDetails(selectedUser._id);
//                 setNewPlanForm({
//                     planId: '',
//                     validityDays: 30,
//                     customFeatures: { contactsIncluded: 0, mapsIncluded: 0, unlimitedMaps: false }
//                 });
//             } else {
//                 setError(data.message || 'Failed to attach plan');
//             }
//         } catch (err) {
//             setError('Failed to attach plan');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Remove plan from user
//     // const removePlan = async (purchaseId) => {
//     //     if (!confirm('Are you sure you want to remove this plan?')) return;

//     //     setLoading(true);
//     //     try {
//     //         const response = await fetch(`${base_url}/api/admin/plans/users/${selectedUser._id}/plans/${purchaseId}/remove`, {
//     //             method: 'DELETE'
//     //         }, getAuthConfig());

//     //         const data = await response.json();
//     //         if (data.success) {
//     //             setSuccess('Plan removed successfully');
//     //             getUserDetails(selectedUser._id);
//     //         } else {
//     //             setError(data.message || 'Failed to remove plan');
//     //         }
//     //     } catch (err) {
//     //         setError('Failed to remove plan');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const removePlan = async (purchaseId) => {
//         if (!confirm("Are you sure you want to remove this plan?")) return;

//         setLoading(true);
//         try {
//             const response = await axios.delete(
//                 `${base_url}/api/admin/plans/users/${selectedUser._id}/plans/${purchaseId}/remove`,
//                 getAuthConfig()
//             );

//             if (response.data.success) {
//                 setSuccess("Plan removed successfully");
//                 getUserDetails(selectedUser._id);
//             } else {
//                 setError(response.data.message || "Failed to remove plan");
//             }
//         } catch (err) {
//             console.error("Error removing plan:", err.response?.data || err.message);
//             setError(err.response?.data?.message || "Failed to remove plan");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Toggle plan active status
//     // const togglePlanStatus = async (purchaseId, currentStatus) => {
//     //     setLoading(true);
//     //     try {
//     //         const response = await fetch(`${base_url}/api/admin/plans/users/${selectedUser._id}/plans/${purchaseId}/toggle`, {
//     //             method: 'PATCH',
//     //             headers: { 'Content-Type': 'application/json' },
//     //             body: JSON.stringify({ isActive: !currentStatus })
//     //         }, getAuthConfig());

//     //         const data = await response.json();
//     //         if (data.success) {
//     //             setSuccess(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
//     //             getUserDetails(selectedUser._id);
//     //         } else {
//     //             setError(data.message || 'Failed to update plan status');
//     //         }
//     //     } catch (err) {
//     //         setError('Failed to update plan status');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const togglePlanStatus = async (purchaseId, currentStatus) => {
//         setLoading(true);
//         try {
//             const response = await axios.patch(
//                 `${base_url}/api/admin/plans/users/${selectedUser._id}/plans/${purchaseId}/toggle`,
//                 { isActive: !currentStatus },
//                 getAuthConfig()
//             );

//             if (response.data.success) {
//                 setSuccess(`Plan ${!currentStatus ? "activated" : "deactivated"} successfully`);
//                 getUserDetails(selectedUser._id);
//             } else {
//                 setError(response.data.message || "Failed to update plan status");
//             }
//         } catch (err) {
//             console.error("Error toggling plan:", err.response?.data || err.message);
//             setError(err.response?.data?.message || "Failed to update plan status");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getPlanStatusColor = (plan) => {
//         const now = new Date();
//         const expiresAt = new Date(plan.expiresAt);

//         if (!plan.isActive || plan.status !== 'active') return 'bg-gray-100 text-gray-800';
//         if (expiresAt < now) return 'bg-red-100 text-red-800';
//         if (expiresAt - now < 7 * 24 * 60 * 60 * 1000) return 'bg-yellow-100 text-yellow-800';
//         return 'bg-green-100 text-green-800';
//     };

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (searchQuery) {
//                 searchUsers(searchQuery);
//             }
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [searchQuery]);

//     useEffect(() => {
//         if (error || success) {
//             const timer = setTimeout(() => {
//                 setError('');
//                 setSuccess('');
//             }, 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [error, success]);

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-6">User Plans Management</h1>

//                 {/* Alerts */}
//                 {error && (
//                     <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
//                         <AlertCircle size={20} />
//                         {error}
//                     </div>
//                 )}
//                 {success && (
//                     <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
//                         <Check size={20} />
//                         {success}
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* User Search Panel */}
//                     <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
//                         <h2 className="text-xl font-semibold mb-4">Search Users</h2>

//                         <div className="relative mb-4">
//                             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//                             <input
//                                 type="text"
//                                 placeholder="Search by name, email, or phone..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>

//                         <div className="space-y-2 max-h-96 overflow-y-auto">
//                             {users.map((user) => (
//                                 <div
//                                     key={user._id}
//                                     onClick={() => getUserDetails(user._id)}
//                                     className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?._id === user._id
//                                         ? 'bg-blue-50 border-2 border-blue-500'
//                                         : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
//                                         }`}
//                                 >
//                                     <div className="flex items-center gap-2">
//                                         <User size={16} className="text-gray-500" />
//                                         <div className="flex-1 min-w-0">
//                                             <p className="font-medium text-sm truncate">{user.name}</p>
//                                             <p className="text-xs text-gray-500 truncate">{user.email || user.phone}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             {searchQuery.length >= 3 && users.length === 0 && !loading && (
//                                 <p className="text-center text-gray-500 py-4">No users found</p>
//                             )}
//                         </div>
//                     </div>

//                     {/* User Plans Panel */}
//                     <div className="lg:col-span-2">
//                         {selectedUser ? (
//                             <div className="bg-white rounded-lg shadow-sm p-6">
//                                 <div className="flex items-center justify-between mb-6">
//                                     <div>
//                                         <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>
//                                         <p className="text-gray-600">{selectedUser.email || selectedUser.phone}</p>
//                                     </div>
//                                     <button
//                                         onClick={() => setShowAddPlanModal(true)}
//                                         className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                                     >
//                                         <Plus size={20} />
//                                         Attach Plan
//                                     </button>
//                                 </div>

//                                 {/* Active Plans */}
//                                 <div className="space-y-4">
//                                     <h3 className="text-lg font-semibold">Purchased Plans</h3>
//                                     {selectedUser.plans?.purchased?.length > 0 ? (
//                                         selectedUser.plans.purchased.map((plan) => (
//                                             <div
//                                                 key={plan._id}
//                                                 className={`border rounded-lg p-4 ${getPlanStatusColor(plan)} transition-all`}
//                                             >
//                                                 <div className="flex items-start justify-between">
//                                                     <div className="flex-1">
//                                                         <div className="flex items-center gap-2 mb-2">
//                                                             <Package size={20} />
//                                                             <h4 className="font-semibold text-lg">{plan.planName || 'Custom Plan'}</h4>
//                                                             <span className="text-xs px-2 py-1 bg-white rounded-full">
//                                                                 {plan.planType?.toUpperCase()}
//                                                             </span>
//                                                         </div>

//                                                         <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
//                                                             <div>
//                                                                 <p className="text-gray-600">Contacts</p>
//                                                                 <p className="font-medium">
//                                                                     {plan.features.contactsUsed} / {plan.features.contactsIncluded}
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-gray-600">Maps</p>
//                                                                 <p className="font-medium">
//                                                                     {plan.features.unlimitedMaps
//                                                                         ? 'Unlimited'
//                                                                         : `${plan.features.mapsUsed} used`}
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-gray-600">Purchased</p>
//                                                                 <p className="font-medium">
//                                                                     {new Date(plan.purchasedAt).toLocaleDateString()}
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-gray-600">Expires</p>
//                                                                 <p className="font-medium">
//                                                                     {new Date(plan.expiresAt).toLocaleDateString()}
//                                                                 </p>
//                                                             </div>
//                                                         </div>

//                                                         {plan.price && (
//                                                             <div className="flex items-center gap-1 mt-2 text-sm">
//                                                                 <DollarSign size={16} />
//                                                                 <span className="font-semibold">₹{plan.price}</span>
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     <div className="flex flex-col gap-2">
//                                                         <button
//                                                             onClick={() => togglePlanStatus(plan._id, plan.isActive)}
//                                                             className={`p-2 rounded-lg transition-colors ${plan.isActive
//                                                                 ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
//                                                                 : 'bg-green-500 hover:bg-green-600 text-white'
//                                                                 }`}
//                                                             title={plan.isActive ? 'Deactivate' : 'Activate'}
//                                                         >
//                                                             {plan.isActive ? <X size={18} /> : <Check size={18} />}
//                                                         </button>
//                                                         <button
//                                                             onClick={() => removePlan(plan._id)}
//                                                             className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
//                                                             title="Remove Plan"
//                                                         >
//                                                             <Trash2 size={18} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-center text-gray-500 py-8">No plans purchased yet</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//                                 <Package size={48} className="mx-auto text-gray-300 mb-4" />
//                                 <p className="text-gray-500">Select a user to view and manage their plans</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Add Plan Modal */}
//                 {showAddPlanModal && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white rounded-lg max-w-md w-full p-6">
//                             <h3 className="text-xl font-semibold mb-4">Attach Plan to User</h3>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Select Plan
//                                     </label>
//                                     <select
//                                         value={newPlanForm.planId}
//                                         onChange={(e) => setNewPlanForm({ ...newPlanForm, planId: e.target.value })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">Choose a plan...</option>
//                                         {plans.map((plan) => (
//                                             <option key={plan._id} value={plan._id}>
//                                                 {plan.name} - ₹{plan.price} ({plan.planType})
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Validity (Days)
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={newPlanForm.validityDays}
//                                         onChange={(e) => setNewPlanForm({ ...newPlanForm, validityDays: parseInt(e.target.value) })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Contacts Included
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={newPlanForm.customFeatures.contactsIncluded}
//                                         onChange={(e) => setNewPlanForm({
//                                             ...newPlanForm,
//                                             customFeatures: { ...newPlanForm.customFeatures, contactsIncluded: parseInt(e.target.value) }
//                                         })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Maps Included
//                                     </label>
//                                     <input
//                                         type="number"
//                                         value={newPlanForm.customFeatures.mapsIncluded}
//                                         onChange={(e) => setNewPlanForm({
//                                             ...newPlanForm,
//                                             customFeatures: { ...newPlanForm.customFeatures, mapsIncluded: parseInt(e.target.value) }
//                                         })}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                         disabled={newPlanForm.customFeatures.unlimitedMaps}
//                                     />
//                                 </div>

//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="checkbox"
//                                         checked={newPlanForm.customFeatures.unlimitedMaps}
//                                         onChange={(e) => setNewPlanForm({
//                                             ...newPlanForm,
//                                             customFeatures: { ...newPlanForm.customFeatures, unlimitedMaps: e.target.checked }
//                                         })}
//                                         className="rounded"
//                                     />
//                                     <label className="text-sm font-medium text-gray-700">
//                                         Unlimited Maps
//                                     </label>
//                                 </div>
//                             </div>

//                             <div className="flex gap-3 mt-6">
//                                 <button
//                                     onClick={() => setShowAddPlanModal(false)}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={attachPlan}
//                                     disabled={loading || !newPlanForm.planId}
//                                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {loading ? 'Attaching...' : 'Attach Plan'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserPlans;


import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Calendar, Check, X, DollarSign, User, Package, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';
import axios from 'axios';

const UserPlans = () => {
    const [users, setUsers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showAddPlanModal, setShowAddPlanModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    // Filter state
    const [filters, setFilters] = useState({
        loginType: [],
        activityStatus: '',
        verificationStatus: {
            email: null,
            phone: null
        },
        dateRange: {
            start: '',
            end: ''
        }
    });

    // Sort state
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // Form state for adding plan
    const [newPlanForm, setNewPlanForm] = useState({
        planId: '',
        validityDays: 30,
        customFeatures: {
            contactsIncluded: 0,
            mapsIncluded: 0,
            unlimitedMaps: false
        }
    });

    // Available cities for dropdown
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

    // Fetch all users with pagination, sorting, and filters
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                sort: `${sortField}:${sortDirection}`
            });

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            // Add filters if any are active
            const activeFilters = {};
            if (filters.loginType.length > 0) activeFilters.loginType = filters.loginType;
            if (filters.activityStatus) activeFilters.activityStatus = filters.activityStatus;
            if (filters.verificationStatus.email !== null || filters.verificationStatus.phone !== null) {
                activeFilters.verificationStatus = filters.verificationStatus;
            }
            if (filters.dateRange.start || filters.dateRange.end) {
                activeFilters.dateRange = filters.dateRange;
            }

            if (Object.keys(activeFilters).length > 0) {
                params.append('filters', JSON.stringify(activeFilters));
            }

            const response = await axios.get(
                `${base_url}/api/get-all-user?${params.toString()}`,
                getAuthConfig()
            );

            if (response.data) {
                setUsers(response.data.users || []);
                setPagination(response.data.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pages: 0
                });
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Fetch plans based on selected city
    const fetchPlans = async (city) => {
        try {
            const params = city ? `?city=${encodeURIComponent(city)}` : '';
            const response = await axios.get(
                `${base_url}/api/admin/plans${params}`,
                getAuthConfig()
            );

            if (response.data.success) {
                setPlans(response.data.plans);
            }
        } catch (err) {
            console.error('Error fetching plans:', err);
            setError('Failed to fetch plans');
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUsers(1);
    }, [sortField, sortDirection, filters]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== undefined) {
                fetchUsers(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch plans when city changes
    useEffect(() => {
        if (selectedCity) {
            fetchPlans(selectedCity);
        }
    }, [selectedCity]);

    // Get user details with plans
    const getUserDetails = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${base_url}/api/admin/plans/users/${userId}/plans`,
                getAuthConfig()
            );

            if (response.data.success) {
                setSelectedUser(response.data.user);
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    // Attach plan to user
    const attachPlan = async () => {
        if (!selectedUser || !newPlanForm.planId) {
            setError('Please select a plan');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${base_url}/api/admin/plans/users/${selectedUser._id}/plans/attach`,
                newPlanForm,
                getAuthConfig()
            );

            if (response.data.success) {
                setSuccess('Plan attached successfully');
                setShowAddPlanModal(false);
                getUserDetails(selectedUser._id);
                fetchUsers(pagination.page); // Refresh user list
                setNewPlanForm({
                    planId: '',
                    validityDays: 30,
                    customFeatures: { contactsIncluded: 0, mapsIncluded: 0, unlimitedMaps: false }
                });
                setSelectedCity('');
            } else {
                setError(response.data.message || 'Failed to attach plan');
            }
        } catch (err) {
            console.error('Error attaching plan:', err);
            setError(err.response?.data?.message || 'Failed to attach plan');
        } finally {
            setLoading(false);
        }
    };

    // Remove plan from user
    const removePlan = async (purchaseId) => {
        if (!confirm('Are you sure you want to remove this plan?')) return;

        setLoading(true);
        try {
            const response = await axios.delete(
                `${base_url}/api/admin/plans/users/${selectedUser._id}/plans/${purchaseId}/remove`,
                getAuthConfig()
            );

            if (response.data.success) {
                setSuccess('Plan removed successfully');
                getUserDetails(selectedUser._id);
                fetchUsers(pagination.page); // Refresh user list
            } else {
                setError(response.data.message || 'Failed to remove plan');
            }
        } catch (err) {
            console.error('Error removing plan:', err);
            setError(err.response?.data?.message || 'Failed to remove plan');
        } finally {
            setLoading(false);
        }
    };

    // Toggle plan active status
    const togglePlanStatus = async (purchaseId, currentStatus) => {
        setLoading(true);
        try {
            const response = await axios.patch(
                `${base_url}/api/admin/plans/users/${selectedUser._id}/plans/${purchaseId}/toggle`,
                { isActive: !currentStatus },
                getAuthConfig()
            );

            if (response.data.success) {
                setSuccess(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
                getUserDetails(selectedUser._id);
                fetchUsers(pagination.page); // Refresh user list
            } else {
                setError(response.data.message || 'Failed to update plan status');
            }
        } catch (err) {
            console.error('Error toggling plan:', err);
            setError(err.response?.data?.message || 'Failed to update plan status');
        } finally {
            setLoading(false);
        }
    };

    const getPlanStatusColor = (plan) => {
        const now = new Date();
        const expiresAt = new Date(plan.expiresAt);

        if (!plan.isActive || plan.status !== 'active') return 'bg-gray-100 text-gray-800';
        if (expiresAt < now) return 'bg-red-100 text-red-800';
        if (expiresAt - now < 7 * 24 * 60 * 60 * 1000) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchUsers(newPage);
        }
    };

    const toggleFilter = (filterType, value) => {
        setFilters(prev => {
            if (filterType === 'loginType') {
                const newLoginTypes = prev.loginType.includes(value)
                    ? prev.loginType.filter(t => t !== value)
                    : [...prev.loginType, value];
                return { ...prev, loginType: newLoginTypes };
            }
            return prev;
        });
    };

    const clearFilters = () => {
        setFilters({
            loginType: [],
            activityStatus: '',
            verificationStatus: { email: null, phone: null },
            dateRange: { start: '', end: '' }
        });
    };

    const getActivePlansCount = (user) => {
        return user.plans?.purchased?.filter(p => p.isActive && p.status === 'active').length || 0;
    };

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">User Plans Management</h1>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                        <Check size={20} />
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Users List Panel */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">All Users</h2>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Filter size={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Login Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['EMAIL', 'GOOGLE', 'PHONE'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => toggleFilter('loginType', type)}
                                                className={`px-3 py-1 text-xs rounded-full transition-colors ${filters.loginType.includes(type)
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Activity Status</label>
                                    <select
                                        value={filters.activityStatus}
                                        onChange={(e) => setFilters(prev => ({ ...prev, activityStatus: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    >
                                        <option value="">All</option>
                                        <option value="active">Active (Last 30 days)</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Sort */}
                        <div className="mb-4">
                            <select
                                value={`${sortField}:${sortDirection}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split(':');
                                    setSortField(field);
                                    setSortDirection(direction);
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            >
                                <option value="createdAt:desc">Newest First</option>
                                <option value="createdAt:asc">Oldest First</option>
                                <option value="name:asc">Name (A-Z)</option>
                                <option value="name:desc">Name (Z-A)</option>
                                <option value="lastLogin:desc">Last Login (Recent)</option>
                            </select>
                        </div>

                        {/* Users List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                            {loading && users.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">Loading...</p>
                            ) : users.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">No users found</p>
                            ) : (
                                users.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() => getUserDetails(user._id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?._id === user._id
                                                ? 'bg-blue-50 border-2 border-blue-500'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <User size={16} className="text-gray-500 mt-1" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email || user.phone}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                        {user.loginType}
                                                    </span>
                                                    {getActivePlansCount(user) > 0 && (
                                                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                                            {getActivePlansCount(user)} Active Plans
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Plans Panel */}
                    <div className="lg:col-span-2">
                        {selectedUser ? (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>
                                        <p className="text-gray-600">{selectedUser.email || selectedUser.phone}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                {selectedUser.loginType}
                                            </span>
                                            {selectedUser.isPhoneVerified && (
                                                <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAddPlanModal(true)}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus size={20} />
                                        Attach Plan
                                    </button>
                                </div>

                                {/* Active Plans */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Purchased Plans</h3>
                                    {selectedUser.plans?.purchased?.length > 0 ? (
                                        selectedUser.plans.purchased.map((plan) => (
                                            <div
                                                key={plan._id}
                                                className={`border rounded-lg p-4 ${getPlanStatusColor(plan)} transition-all`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Package size={20} />
                                                            <h4 className="font-semibold text-lg">{plan.planName || 'Custom Plan'}</h4>
                                                            <span className="text-xs px-2 py-1 bg-white rounded-full">
                                                                {plan.planType?.toUpperCase()}
                                                            </span>
                                                            {!plan.isActive && (
                                                                <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
                                                                    INACTIVE
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                                            <div>
                                                                <p className="text-gray-600">Contacts</p>
                                                                <p className="font-medium">
                                                                    {plan.features.contactsUsed} / {plan.features.contactsIncluded}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Maps</p>
                                                                <p className="font-medium">
                                                                    {plan.features.unlimitedMaps
                                                                        ? 'Unlimited'
                                                                        : `${plan.features.mapsUsed} used`}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Purchased</p>
                                                                <p className="font-medium">
                                                                    {new Date(plan.purchasedAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-600">Expires</p>
                                                                <p className="font-medium">
                                                                    {new Date(plan.expiresAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {plan.price && (
                                                            <div className="flex items-center gap-1 mt-2 text-sm">
                                                                <DollarSign size={16} />
                                                                <span className="font-semibold">₹{plan.price}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => togglePlanStatus(plan._id, plan.isActive)}
                                                            className={`p-2 rounded-lg transition-colors ${plan.isActive
                                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                                                }`}
                                                            title={plan.isActive ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {plan.isActive ? <X size={18} /> : <Check size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => removePlan(plan._id)}
                                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                                            title="Remove Plan"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">No plans purchased yet</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Select a user to view and manage their plans</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Plan Modal */}
                {showAddPlanModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-semibold mb-4">Attach Plan to User</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select City First
                                    </label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose a city...</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Plan
                                    </label>
                                    <select
                                        value={newPlanForm.planId}
                                        onChange={(e) => setNewPlanForm({ ...newPlanForm, planId: e.target.value })}
                                        disabled={!selectedCity}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Choose a plan...</option>
                                        {plans.map((plan) => (
                                            <option key={plan._id} value={plan._id}>
                                                {plan.name} - ₹{plan.price} ({plan.planType})
                                            </option>
                                        ))}
                                    </select>
                                    {!selectedCity && (
                                        <p className="text-xs text-gray-500 mt-1">Please select a city first</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Validity (Days)
                                    </label>
                                    <input
                                        type="number"
                                        value={newPlanForm.validityDays}
                                        onChange={(e) => setNewPlanForm({ ...newPlanForm, validityDays: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contacts Included
                                    </label>
                                    <input
                                        type="number"
                                        value={newPlanForm.customFeatures.contactsIncluded}
                                        onChange={(e) => setNewPlanForm({
                                            ...newPlanForm,
                                            customFeatures: {
                                                ...newPlanForm.customFeatures,
                                                contactsIncluded: parseInt(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maps Included
                                    </label>
                                    <input
                                        type="number"
                                        value={newPlanForm.customFeatures.mapsIncluded}
                                        onChange={(e) => setNewPlanForm({
                                            ...newPlanForm,
                                            customFeatures: {
                                                ...newPlanForm.customFeatures,
                                                mapsIncluded: parseInt(e.target.value) || 0
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={newPlanForm.customFeatures.unlimitedMaps}
                                        min="0"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="unlimitedMaps"
                                        checked={newPlanForm.customFeatures.unlimitedMaps}
                                        onChange={(e) => setNewPlanForm({
                                            ...newPlanForm,
                                            customFeatures: {
                                                ...newPlanForm.customFeatures,
                                                unlimitedMaps: e.target.checked
                                            }
                                        })}
                                        className="rounded"
                                    />
                                    <label htmlFor="unlimitedMaps" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Unlimited Maps
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAddPlanModal(false);
                                        setSelectedCity('');
                                        setNewPlanForm({
                                            planId: '',
                                            validityDays: 30,
                                            customFeatures: { contactsIncluded: 0, mapsIncluded: 0, unlimitedMaps: false }
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={attachPlan}
                                    disabled={loading || !newPlanForm.planId}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Attaching...' : 'Attach Plan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPlans;