// import React, { useState, useEffect } from 'react';
// import {
//     Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Star,
//     DollarSign, Calendar, Tag, Settings, AlertCircle,
//     CheckCircle, Move, Search, Filter, MoreVertical
// } from 'lucide-react';
// import axios from 'axios';
// import { base_url } from '../../../utils/base_url';

// const PlanManagement = () => {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     // Modal states
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editingPlan, setEditingPlan] = useState(null);

//     // Filter states
//     const [filterType, setFilterType] = useState('all');
//     const [filterActive, setFilterActive] = useState('all');
//     const [searchTerm, setSearchTerm] = useState('');

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         price: '',
//         originalPrice: '',
//         discount: '',
//         validity: '',
//         color: 'bg-blue-500',
//         planType: 'contact',
//         recommended: false,
//         isActive: true,
//         features: [''],
//         metadata: {
//             contactsIncluded: 0,
//             mapsIncluded: false,
//             validityDays: 0,
//             unlimitedMaps: false
//         }
//     });

//     const planTypes = [
//         { value: 'contact', label: 'Contact Unlock', color: 'bg-orange-500' },
//         { value: 'map', label: 'Map Unlock', color: 'bg-blue-500' },
//         { value: 'combo', label: 'Combo Pack', color: 'bg-red-500' },
//         { value: 'premium', label: 'Premium', color: 'bg-purple-500' }
//     ];

//     const colorOptions = [
//         'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500',
//         'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
//     ];

//     // Fetch plans
//     const fetchPlans = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('authToken');
//             const response = await axios.get(`${base_url}/api/admin/plans`, {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: {
//                     type: filterType === 'all' ? undefined : filterType,
//                     active: filterActive === 'all' ? undefined : filterActive,
//                     limit: 50
//                 }
//             });

//             setPlans(response.data.plans || []);
//         } catch (error) {
//             console.error('Error fetching plans:', error);
//             setError('Failed to fetch plans');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, [filterType, filterActive]);

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             description: '',
//             price: '',
//             originalPrice: '',
//             discount: '',
//             validity: '',
//             color: 'bg-blue-500',
//             planType: 'contact',
//             recommended: false,
//             isActive: true,
//             features: [''],
//             metadata: {
//                 contactsIncluded: 0,
//                 mapsIncluded: false,
//                 validityDays: 0,
//                 unlimitedMaps: false
//             }
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         if (name.includes('.')) {
//             const [parent, child] = name.split('.');
//             setFormData(prev => ({
//                 ...prev,
//                 [parent]: {
//                     ...prev[parent],
//                     [child]: type === 'checkbox' ? checked :
//                         type === 'number' ? parseInt(value) || 0 : value
//                 }
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: type === 'checkbox' ? checked :
//                     type === 'number' ? parseFloat(value) || 0 : value
//             }));
//         }
//     };

//     const handleFeatureChange = (index, value) => {
//         const newFeatures = [...formData.features];
//         newFeatures[index] = value;
//         setFormData(prev => ({ ...prev, features: newFeatures }));
//     };

//     const addFeature = () => {
//         setFormData(prev => ({
//             ...prev,
//             features: [...prev.features, '']
//         }));
//     };

//     const removeFeature = (index) => {
//         const newFeatures = formData.features.filter((_, i) => i !== index);
//         setFormData(prev => ({ ...prev, features: newFeatures }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const token = localStorage.getItem('authToken');
//             const cleanedData = {
//                 ...formData,
//                 features: formData.features.filter(f => f.trim() !== ''),
//                 price: parseFloat(formData.price),
//                 originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
//                 discount: formData.discount ? parseFloat(formData.discount) : null
//             };

//             if (editingPlan) {
//                 await axios.put(`${base_url}/api/admin/plans/${editingPlan._id}`, cleanedData, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setSuccess('Plan updated successfully!');
//                 setShowEditModal(false);
//             } else {
//                 await axios.post(`${base_url}/api/admin/plans`, cleanedData, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setSuccess('Plan created successfully!');
//                 setShowCreateModal(false);
//             }

//             resetForm();
//             setEditingPlan(null);
//             fetchPlans();

//             setTimeout(() => setSuccess(''), 3000);
//         } catch (error) {
//             console.error('Error saving plan:', error);
//             setError(error.response?.data?.message || 'Failed to save plan');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (plan) => {
//         setEditingPlan(plan);
//         setFormData({
//             name: plan.name,
//             description: plan.description,
//             price: plan.price.toString(),
//             originalPrice: plan.originalPrice ? plan.originalPrice.toString() : '',
//             discount: plan.discount ? plan.discount.toString() : '',
//             validity: plan.validity,
//             color: plan.color,
//             planType: plan.planType,
//             recommended: plan.recommended,
//             isActive: plan.isActive,
//             features: plan.features.length > 0 ? plan.features : [''],
//             metadata: plan.metadata || {
//                 contactsIncluded: 0,
//                 mapsIncluded: false,
//                 validityDays: 0,
//                 unlimitedMaps: false
//             }
//         });
//         setShowEditModal(true);
//     };

//     const handleToggleStatus = async (planId) => {
//         try {
//             const token = localStorage.getItem('authToken');
//             await axios.patch(`${base_url}/api/admin/plans/${planId}/toggle-status`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSuccess('Plan status updated successfully!');
//             fetchPlans();
//             setTimeout(() => setSuccess(''), 3000);
//         } catch (error) {
//             console.error('Error toggling plan status:', error);
//             setError('Failed to update plan status');
//         }
//     };

//     const handleDelete = async (planId) => {
//         if (!window.confirm('Are you sure you want to deactivate this plan?')) return;

//         try {
//             const token = localStorage.getItem('authToken');
//             await axios.delete(`${base_url}/api/admin/plans/${planId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSuccess('Plan deactivated successfully!');
//             fetchPlans();
//             setTimeout(() => setSuccess(''), 3000);
//         } catch (error) {
//             console.error('Error deleting plan:', error);
//             setError('Failed to delete plan');
//         }
//     };

//     const filteredPlans = plans.filter(plan =>
//         plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         plan.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const PlanModal = ({ show, onClose, title, onSubmit }) => {
//         if (!show) return null;

//         return (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                 <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                     <div className="p-6 border-b border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//                             <button
//                                 onClick={onClose}
//                                 className="text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>
//                     </div>

//                     <form onSubmit={onSubmit} className="p-6 space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Plan Name */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Plan Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Enter plan name"
//                                 />
//                             </div>

//                             {/* Plan Type */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Plan Type *
//                                 </label>
//                                 <select
//                                     name="planType"
//                                     value={formData.planType}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     {planTypes.map(type => (
//                                         <option key={type.value} value={type.value}>
//                                             {type.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Description */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Description *
//                             </label>
//                             <textarea
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 required
//                                 rows={3}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter plan description"
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {/* Price */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Price (₹) *
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="price"
//                                     value={formData.price}
//                                     onChange={handleInputChange}
//                                     required
//                                     min="0"
//                                     step="0.01"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="0.00"
//                                 />
//                             </div>

//                             {/* Original Price */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Original Price (₹)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="originalPrice"
//                                     value={formData.originalPrice}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     step="0.01"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="0.00"
//                                 />
//                             </div>

//                             {/* Discount */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Discount (%)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="discount"
//                                     value={formData.discount}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     max="100"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="0"
//                                 />
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Validity */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Validity *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="validity"
//                                     value={formData.validity}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="e.g., 30 days, Per use"
//                                 />
//                             </div>

//                             {/* Color */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Color Theme
//                                 </label>
//                                 <select
//                                     name="color"
//                                     value={formData.color}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     {colorOptions.map(color => (
//                                         <option key={color} value={color}>
//                                             {color.replace('bg-', '').replace('-500', '')}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Metadata */}
//                         <div className="border-t pt-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Metadata</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Contacts Included
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="metadata.contactsIncluded"
//                                         value={formData.metadata.contactsIncluded}
//                                         onChange={handleInputChange}
//                                         min="0"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Validity Days
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="metadata.validityDays"
//                                         value={formData.metadata.validityDays}
//                                         onChange={handleInputChange}
//                                         min="0"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                 </div>

//                                 <div className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="metadata.mapsIncluded"
//                                         checked={formData.metadata.mapsIncluded}
//                                         onChange={handleInputChange}
//                                         className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                     />
//                                     <label className="ml-2 text-sm text-gray-700">Maps Included</label>
//                                 </div>

//                                 <div className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="metadata.unlimitedMaps"
//                                         checked={formData.metadata.unlimitedMaps}
//                                         onChange={handleInputChange}
//                                         className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                     />
//                                     <label className="ml-2 text-sm text-gray-700">Unlimited Maps</label>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Features */}
//                         <div>
//                             <div className="flex items-center justify-between mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Features
//                                 </label>
//                                 <button
//                                     type="button"
//                                     onClick={addFeature}
//                                     className="text-blue-600 text-sm hover:underline"
//                                 >
//                                     Add Feature
//                                 </button>
//                             </div>
//                             <div className="space-y-2">
//                                 {formData.features.map((feature, index) => (
//                                     <div key={index} className="flex items-center gap-2">
//                                         <input
//                                             type="text"
//                                             value={feature}
//                                             onChange={(e) => handleFeatureChange(index, e.target.value)}
//                                             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Enter feature"
//                                         />
//                                         {formData.features.length > 1 && (
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeFeature(index)}
//                                                 className="text-red-500 hover:text-red-700"
//                                             >
//                                                 <X className="w-4 h-4" />
//                                             </button>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Settings */}
//                         <div className="border-t pt-6">
//                             <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
//                             <div className="space-y-4">
//                                 <div className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="recommended"
//                                         checked={formData.recommended}
//                                         onChange={handleInputChange}
//                                         className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                     />
//                                     <label className="ml-2 text-sm text-gray-700">Recommended Plan</label>
//                                 </div>

//                                 <div className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="isActive"
//                                         checked={formData.isActive}
//                                         onChange={handleInputChange}
//                                         className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                     />
//                                     <label className="ml-2 text-sm text-gray-700">Active Plan</label>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-3 pt-6 border-t">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//                             >
//                                 {loading ? (
//                                     <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
//                                 ) : (
//                                     <Save className="w-4 h-4" />
//                                 )}
//                                 {editingPlan ? 'Update Plan' : 'Create Plan'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Header */}
//                 <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
//                             <p className="text-gray-600">Create and manage subscription plans for your users</p>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 resetForm();
//                                 setShowCreateModal(true);
//                             }}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                         >
//                             <Plus className="w-4 h-4" />
//                             Create Plan
//                         </button>
//                     </div>

//                     {/* Messages */}
//                     {success && (
//                         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
//                             <CheckCircle className="w-5 h-5 text-green-500" />
//                             <span className="text-green-700 font-medium">{success}</span>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
//                             <AlertCircle className="w-5 h-5 text-red-500" />
//                             <span className="text-red-700 font-medium">{error}</span>
//                         </div>
//                     )}

//                     {/* Filters */}
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="flex-1 relative">
//                             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search plans..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div className="flex gap-3">
//                             <select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Types</option>
//                                 {planTypes.map(type => (
//                                     <option key={type.value} value={type.value}>
//                                         {type.label}
//                                     </option>
//                                 ))}
//                             </select>

//                             <select
//                                 value={filterActive}
//                                 onChange={(e) => setFilterActive(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Status</option>
//                                 <option value="true">Active</option>
//                                 <option value="false">Inactive</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Plans Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {loading ? (
//                         Array.from({ length: 6 }).map((_, i) => (
//                             <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
//                                 <div className="h-4 bg-gray-200 rounded mb-4"></div>
//                                 <div className="h-8 bg-gray-200 rounded mb-4"></div>
//                                 <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                                 <div className="h-4 bg-gray-200 rounded"></div>
//                             </div>
//                         ))
//                     ) : filteredPlans.length === 0 ? (
//                         <div className="col-span-full text-center py-12 text-gray-500">
//                             <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                             <p className="text-lg">No plans found</p>
//                             <p className="text-sm">Create your first plan to get started</p>
//                         </div>
//                     ) : (
//                         filteredPlans.map((plan) => (
//                             <div key={plan._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//                                 {/* Plan Header */}
//                                 <div className="p-6 border-b">
//                                     <div className="flex items-start justify-between mb-3">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-4 h-4 rounded-full ${plan.color}`}></div>
//                                             <div>
//                                                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                                                     {plan.name}
//                                                     {plan.recommended && (
//                                                         <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                                                     )}
//                                                 </h3>
//                                                 <span className="text-sm text-gray-500 capitalize">{plan.planType}</span>
//                                             </div>
//                                         </div>

//                                         <div className="flex items-center gap-2">
//                                             <button
//                                                 onClick={() => handleToggleStatus(plan._id)}
//                                                 className={`p-1 rounded transition-colors ${plan.isActive
//                                                         ? 'text-green-600 hover:bg-green-50'
//                                                         : 'text-gray-400 hover:bg-gray-50'
//                                                     }`}
//                                             >
//                                                 {plan.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                                             </button>

//                                             <div className="relative group">
//                                                 <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
//                                                     <MoreVertical className="w-4 h-4" />
//                                                 </button>
//                                                 <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
//                                                     <button
//                                                         onClick={() => handleEdit(plan)}
//                                                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
//                                                     >
//                                                         <Edit3 className="w-4 h-4" />
//                                                         Edit Plan
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(plan._id)}
//                                                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                                                     >
//                                                         <Trash2 className="w-4 h-4" />
//                                                         Delete Plan
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

//                                     <div className="flex items-center gap-2">
//                                         <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
//                                         {plan.originalPrice && (
//                                             <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
//                                         )}
//                                         {plan.discount && (
//                                             <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                                                 {plan.discount}% OFF
//                                             </span>
//                                         )}
//                                     </div>

//                                     <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//                                         <Calendar className="w-4 h-4" />
//                                         {plan.validity}
//                                     </div>
//                                 </div>

//                                 {/* Plan Features */}
//                                 <div className="p-6">
//                                     {plan.features && plan.features.length > 0 && (
//                                         <div className="mb-4">
//                                             <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
//                                             <ul className="text-sm text-gray-600 space-y-1">
//                                                 {plan.features.map((feature, index) => (
//                                                     <li key={index} className="flex items-center gap-2">
//                                                         <CheckCircle className="w-3 h-3 text-green-500" />
//                                                         {feature}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     )}

//                                     {/* Metadata */}
//                                     {plan.metadata && (
//                                         <div className="space-y-2">
//                                             {plan.metadata.contactsIncluded > 0 && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <Tag className="w-4 h-4" />
//                                                     {plan.metadata.contactsIncluded} contacts
//                                                 </div>
//                                             )}
//                                             {plan.metadata.validityDays > 0 && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <Calendar className="w-4 h-4" />
//                                                     {plan.metadata.validityDays} days validity
//                                                 </div>
//                                             )}
//                                             {plan.metadata.mapsIncluded && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <CheckCircle className="w-4 h-4 text-green-500" />
//                                                     Maps included
//                                                 </div>
//                                             )}
//                                             {plan.metadata.unlimitedMaps && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <CheckCircle className="w-4 h-4 text-green-500" />
//                                                     Unlimited maps
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Status */}
//                                     <div className="flex items-center justify-between mt-4 pt-4 border-t">
//                                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${plan.isActive
//                                                 ? 'bg-green-100 text-green-800'
//                                                 : 'bg-gray-100 text-gray-800'
//                                             }`}>
//                                             {plan.isActive ? 'Active' : 'Inactive'}
//                                         </span>

//                                         <div className="text-xs text-gray-500">
//                                             Updated {new Date(plan.updatedAt).toLocaleDateString()}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Modals */}
//                 <PlanModal
//                     show={showCreateModal}
//                     onClose={() => {
//                         setShowCreateModal(false);
//                         resetForm();
//                     }}
//                     title="Create New Plan"
//                     onSubmit={handleSubmit}
//                 />

//                 <PlanModal
//                     show={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setEditingPlan(null);
//                         resetForm();
//                     }}
//                     title="Edit Plan"
//                     onSubmit={handleSubmit}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PlanManagement;


// import React, { useState, useEffect } from 'react';
// import {
//     Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Star,
//     DollarSign, Calendar, Tag, Settings, AlertCircle,
//     CheckCircle, Move, Search, Filter, MoreVertical
// } from 'lucide-react';
// import axios from 'axios';
// import { base_url } from '../../../utils/base_url';

// // Move PlanModal component outside to prevent re-creation
// const PlanModal = ({ show, onClose, title, onSubmit, formData, handleInputChange, handleFeatureChange, addFeature, removeFeature, loading, editingPlan }) => {
//     const planTypes = [
//         { value: 'contact', label: 'Contact Unlock', color: 'bg-orange-500' },
//         { value: 'map', label: 'Map Unlock', color: 'bg-blue-500' },
//         { value: 'combo', label: 'Combo Pack', color: 'bg-red-500' },
//         { value: 'premium', label: 'Premium', color: 'bg-purple-500' }
//     ];

//     const colorOptions = [
//         'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500',
//         'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
//     ];

//     if (!show) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 border-b border-gray-200">
//                     <div className="flex items-center justify-between">
//                         <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//                         <button
//                             onClick={onClose}
//                             className="text-gray-400 hover:text-gray-600 transition-colors"
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>
//                 </div>

//                 <form onSubmit={onSubmit} className="p-6 space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Plan Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Plan Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter plan name"
//                             />
//                         </div>

//                         {/* City Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 City Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 name="city"
//                                 value={formData.city}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter city name"
//                             />
//                         </div>

//                         {/* Plan Type */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Plan Type *
//                             </label>
//                             <select
//                                 name="planType"
//                                 value={formData.planType}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 {planTypes.map(type => (
//                                     <option key={type.value} value={type.value}>
//                                         {type.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Description *
//                         </label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleInputChange}
//                             required
//                             rows={3}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Enter plan description"
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {/* Price */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Price (₹) *
//                             </label>
//                             <input
//                                 type="number"
//                                 name="price"
//                                 value={formData.price}
//                                 onChange={handleInputChange}
//                                 required
//                                 min="0"
//                                 step="0.01"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="0.00"
//                             />
//                         </div>

//                         {/* Original Price */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Original Price (₹)
//                             </label>
//                             <input
//                                 type="number"
//                                 name="originalPrice"
//                                 value={formData.originalPrice}
//                                 onChange={handleInputChange}
//                                 min="0"
//                                 step="0.01"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="0.00"
//                             />
//                         </div>

//                         {/* Discount */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Discount (%)
//                             </label>
//                             <input
//                                 type="number"
//                                 name="discount"
//                                 value={formData.discount}
//                                 onChange={handleInputChange}
//                                 min="0"
//                                 max="100"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="0"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Validity */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Validity *
//                             </label>
//                             <input
//                                 type="text"
//                                 name="validity"
//                                 value={formData.validity}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="e.g., 30 days, Per use"
//                             />
//                         </div>

//                         {/* Color */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Color Theme
//                             </label>
//                             <select
//                                 name="color"
//                                 value={formData.color}
//                                 onChange={handleInputChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 {colorOptions.map(color => (
//                                     <option key={color} value={color}>
//                                         {color.replace('bg-', '').replace('-500', '')}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Metadata */}
//                     <div className="border-t pt-6">
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Metadata</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Contacts Included
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="metadata.contactsIncluded"
//                                     value={formData.metadata.contactsIncluded}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Validity Days
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="metadata.validityDays"
//                                     value={formData.metadata.validityDays}
//                                     onChange={handleInputChange}
//                                     min="0"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                             </div>

//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="metadata.mapsIncluded"
//                                     checked={formData.metadata.mapsIncluded}
//                                     onChange={handleInputChange}
//                                     className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                 />
//                                 <label className="ml-2 text-sm text-gray-700">Maps Included</label>
//                             </div>

//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="metadata.unlimitedMaps"
//                                     checked={formData.metadata.unlimitedMaps}
//                                     onChange={handleInputChange}
//                                     className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                 />
//                                 <label className="ml-2 text-sm text-gray-700">Unlimited Maps</label>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Features */}
//                     <div>
//                         <div className="flex items-center justify-between mb-4">
//                             <label className="block text-sm font-medium text-gray-700">
//                                 Features
//                             </label>
//                             <button
//                                 type="button"
//                                 onClick={addFeature}
//                                 className="text-blue-600 text-sm hover:underline"
//                             >
//                                 Add Feature
//                             </button>
//                         </div>
//                         <div className="space-y-2">
//                             {formData.features.map((feature, index) => (
//                                 <div key={index} className="flex items-center gap-2">
//                                     <input
//                                         type="text"
//                                         value={feature}
//                                         onChange={(e) => handleFeatureChange(index, e.target.value)}
//                                         className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Enter feature"
//                                     />
//                                     {formData.features.length > 1 && (
//                                         <button
//                                             type="button"
//                                             onClick={() => removeFeature(index)}
//                                             className="text-red-500 hover:text-red-700"
//                                         >
//                                             <X className="w-4 h-4" />
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Settings */}
//                     <div className="border-t pt-6">
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
//                         <div className="space-y-4">
//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="recommended"
//                                     checked={formData.recommended}
//                                     onChange={handleInputChange}
//                                     className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                 />
//                                 <label className="ml-2 text-sm text-gray-700">Recommended Plan</label>
//                             </div>

//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="isActive"
//                                     checked={formData.isActive}
//                                     onChange={handleInputChange}
//                                     className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                                 />
//                                 <label className="ml-2 text-sm text-gray-700">Active Plan</label>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex justify-end gap-3 pt-6 border-t">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//                         >
//                             {loading ? (
//                                 <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
//                             ) : (
//                                 <Save className="w-4 h-4" />
//                             )}
//                             {editingPlan ? 'Update Plan' : 'Create Plan'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// const PlanManagement = () => {
//     const [plans, setPlans] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     // Modal states
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editingPlan, setEditingPlan] = useState(null);

//     // Filter states
//     const [filterType, setFilterType] = useState('all');
//     const [filterActive, setFilterActive] = useState('all');
//     const [searchTerm, setSearchTerm] = useState('');

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         price: '',
//         originalPrice: '',
//         discount: '',
//         validity: '',
//         color: 'bg-blue-500',
//         planType: 'contact',
//         recommended: false,
//         isActive: true,
//         city : '',
//         features: [''],
//         metadata: {
//             contactsIncluded: 0,
//             mapsIncluded: false,
//             validityDays: 0,
//             unlimitedMaps: false
//         }
//     });

//     const planTypes = [
//         { value: 'contact', label: 'Contact Unlock', color: 'bg-orange-500' },
//         { value: 'map', label: 'Map Unlock', color: 'bg-blue-500' },
//         { value: 'combo', label: 'Combo Pack', color: 'bg-red-500' },
//         { value: 'premium', label: 'Premium', color: 'bg-purple-500' }
//     ];

//     // Fetch plans
//     const fetchPlans = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('authToken');
//             const response = await axios.get(`${base_url}/api/admin/plans`, {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: {
//                     type: filterType === 'all' ? undefined : filterType,
//                     active: filterActive === 'all' ? undefined : filterActive,
//                     limit: 50
//                 }
//             });

//             setPlans(response.data.plans || []);
//         } catch (error) {
//             console.error('Error fetching plans:', error);
//             setError('Failed to fetch plans');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, [filterType, filterActive]);

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             description: '',
//             price: '',
//             originalPrice: '',
//             discount: '',
//             validity: '',
//             color: 'bg-blue-500',
//             planType: 'contact',
//             recommended: false,
//             isActive: true,
//             features: [''],
//             metadata: {
//                 contactsIncluded: 0,
//                 mapsIncluded: false,
//                 validityDays: 0,
//                 unlimitedMaps: false
//             }
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         if (name.includes('.')) {
//             const [parent, child] = name.split('.');
//             setFormData(prev => ({
//                 ...prev,
//                 [parent]: {
//                     ...prev[parent],
//                     [child]: type === 'checkbox' ? checked :
//                         type === 'number' ? parseInt(value) || 0 : value
//                 }
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: type === 'checkbox' ? checked :
//                     type === 'number' ? parseFloat(value) || 0 : value
//             }));
//         }
//     };

//     const handleFeatureChange = (index, value) => {
//         const newFeatures = [...formData.features];
//         newFeatures[index] = value;
//         setFormData(prev => ({ ...prev, features: newFeatures }));
//     };

//     const addFeature = () => {
//         setFormData(prev => ({
//             ...prev,
//             features: [...prev.features, '']
//         }));
//     };

//     const removeFeature = (index) => {
//         const newFeatures = formData.features.filter((_, i) => i !== index);
//         setFormData(prev => ({ ...prev, features: newFeatures }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const token = localStorage.getItem('authToken');
//             const cleanedData = {
//                 ...formData,
//                 features: formData.features.filter(f => f.trim() !== ''),
//                 price: parseFloat(formData.price),
//                 originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
//                 discount: formData.discount ? parseFloat(formData.discount) : null
//             };

//             if (editingPlan) {
//                 await axios.put(`${base_url}/api/admin/plans/${editingPlan._id}`, cleanedData, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setSuccess('Plan updated successfully!');
//                 setShowEditModal(false);
//             } else {
//                 await axios.post(`${base_url}/api/admin/plans`, cleanedData, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setSuccess('Plan created successfully!');
//                 setShowCreateModal(false);
//             }

//             resetForm();
//             setEditingPlan(null);
//             fetchPlans();

//             setTimeout(() => setSuccess(''), 3000);
//         } catch (error) {
//             console.error('Error saving plan:', error);
//             setError(error.response?.data?.message || 'Failed to save plan');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (plan) => {
//         setEditingPlan(plan);
//         setFormData({
//             name: plan.name,
//             description: plan.description,
//             price: plan.price.toString(),
//             originalPrice: plan.originalPrice ? plan.originalPrice.toString() : '',
//             discount: plan.discount ? plan.discount.toString() : '',
//             validity: plan.validity,
//             color: plan.color,
//             planType: plan.planType,
//             recommended: plan.recommended,
//             isActive: plan.isActive,
//             features: plan.features.length > 0 ? plan.features : [''],
//             metadata: plan.metadata || {
//                 contactsIncluded: 0,
//                 mapsIncluded: false,
//                 validityDays: 0,
//                 unlimitedMaps: false
//             }
//         });
//         setShowEditModal(true);
//     };

//     const handleToggleStatus = async (planId) => {
//         try {
//             const token = localStorage.getItem('authToken');
//             await axios.patch(`${base_url}/api/admin/plans/${planId}/toggle-status`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSuccess('Plan status updated successfully!');
//             fetchPlans();
//             setTimeout(() => setSuccess(''), 3000);
//         } catch (error) {
//             console.error('Error toggling plan status:', error);
//             setError('Failed to update plan status');
//         }
//     };

//     const handleDelete = async (planId) => {
//         if (!window.confirm('Are you sure you want to deactivate this plan?')) return;

//         try {
//             const token = localStorage.getItem('authToken');
//             await axios.delete(`${base_url}/api/admin/plans/${planId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSuccess('Plan deactivated successfully!');
//             fetchPlans();
//             setTimeout(() => setSuccess(''), 3000);
//         } catch (error) {
//             console.error('Error deleting plan:', error);
//             setError('Failed to delete plan');
//         }
//     };

//     const filteredPlans = plans.filter(plan =>
//         plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         plan.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Header */}
//                 <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
//                             <p className="text-gray-600">Create and manage subscription plans for your users</p>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 resetForm();
//                                 setShowCreateModal(true);
//                             }}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                         >
//                             <Plus className="w-4 h-4" />
//                             Create Plan
//                         </button>
//                     </div>

//                     {/* Messages */}
//                     {success && (
//                         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
//                             <CheckCircle className="w-5 h-5 text-green-500" />
//                             <span className="text-green-700 font-medium">{success}</span>
//                         </div>
//                     )}

//                     {error && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
//                             <AlertCircle className="w-5 h-5 text-red-500" />
//                             <span className="text-red-700 font-medium">{error}</span>
//                         </div>
//                     )}

//                     {/* Filters */}
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="flex-1 relative">
//                             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search plans..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div className="flex gap-3">
//                             <select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Types</option>
//                                 {planTypes.map(type => (
//                                     <option key={type.value} value={type.value}>
//                                         {type.label}
//                                     </option>
//                                 ))}
//                             </select>

//                             <select
//                                 value={filterActive}
//                                 onChange={(e) => setFilterActive(e.target.value)}
//                                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="all">All Status</option>
//                                 <option value="true">Active</option>
//                                 <option value="false">Inactive</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Plans Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {loading ? (
//                         Array.from({ length: 6 }).map((_, i) => (
//                             <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
//                                 <div className="h-4 bg-gray-200 rounded mb-4"></div>
//                                 <div className="h-8 bg-gray-200 rounded mb-4"></div>
//                                 <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                                 <div className="h-4 bg-gray-200 rounded"></div>
//                             </div>
//                         ))
//                     ) : filteredPlans.length === 0 ? (
//                         <div className="col-span-full text-center py-12 text-gray-500">
//                             <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                             <p className="text-lg">No plans found</p>
//                             <p className="text-sm">Create your first plan to get started</p>
//                         </div>
//                     ) : (
//                         filteredPlans.map((plan) => (
//                             <div key={plan._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//                                 {/* Plan Header */}
//                                 <div className="p-6 border-b">
//                                     <div className="flex items-start justify-between mb-3">
//                                         <div className="flex items-center gap-3">
//                                             <div className={`w-4 h-4 rounded-full ${plan.color}`}></div>
//                                             <div>
//                                                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                                                     {plan.name}
//                                                     {plan.recommended && (
//                                                         <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                                                     )}
//                                                 </h3>
//                                                 <span className="text-sm text-gray-500 capitalize">{plan.planType}</span>
//                                             </div>

//                                             <div>{plan?.city}</div>
//                                         </div>

//                                         <div className="flex items-center gap-2">
//                                             <button
//                                                 onClick={() => handleToggleStatus(plan._id)}
//                                                 className={`p-1 rounded transition-colors ${plan.isActive
//                                                     ? 'text-green-600 hover:bg-green-50'
//                                                     : 'text-gray-400 hover:bg-gray-50'
//                                                     }`}
//                                             >
//                                                 {plan.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                                             </button>

//                                             <div className="relative group">
//                                                 <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
//                                                     <MoreVertical className="w-4 h-4" />
//                                                 </button>
//                                                 <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
//                                                     <button
//                                                         onClick={() => handleEdit(plan)}
//                                                         className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
//                                                     >
//                                                         <Edit3 className="w-4 h-4" />
//                                                         Edit Plan
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(plan._id)}
//                                                         className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                                                     >
//                                                         <Trash2 className="w-4 h-4" />
//                                                         Delete Plan
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

//                                     <div className="flex items-center gap-2">
//                                         <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
//                                         {plan.originalPrice && (
//                                             <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
//                                         )}
//                                         {plan.discount && (
//                                             <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                                                 {plan.discount}% OFF
//                                             </span>
//                                         )}
//                                     </div>

//                                     <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//                                         <Calendar className="w-4 h-4" />
//                                         {plan.validity}
//                                     </div>
//                                 </div>

//                                 {/* Plan Features */}
//                                 <div className="p-6">
//                                     {plan.features && plan.features.length > 0 && (
//                                         <div className="mb-4">
//                                             <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
//                                             <ul className="text-sm text-gray-600 space-y-1">
//                                                 {plan.features.map((feature, index) => (
//                                                     <li key={index} className="flex items-center gap-2">
//                                                         <CheckCircle className="w-3 h-3 text-green-500" />
//                                                         {feature}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     )}

//                                     {/* Metadata */}
//                                     {plan.metadata && (
//                                         <div className="space-y-2">
//                                             {plan.metadata.contactsIncluded > 0 && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <Tag className="w-4 h-4" />
//                                                     {plan.metadata.contactsIncluded} contacts
//                                                 </div>
//                                             )}
//                                             {plan.metadata.validityDays > 0 && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <Calendar className="w-4 h-4" />
//                                                     {plan.metadata.validityDays} days validity
//                                                 </div>
//                                             )}
//                                             {plan.metadata.mapsIncluded && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <CheckCircle className="w-4 h-4 text-green-500" />
//                                                     Maps included
//                                                 </div>
//                                             )}
//                                             {plan.metadata.unlimitedMaps && (
//                                                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                                                     <CheckCircle className="w-4 h-4 text-green-500" />
//                                                     Unlimited maps
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Status */}
//                                     <div className="flex items-center justify-between mt-4 pt-4 border-t">
//                                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${plan.isActive
//                                             ? 'bg-green-100 text-green-800'
//                                             : 'bg-gray-100 text-gray-800'
//                                             }`}>
//                                             {plan.isActive ? 'Active' : 'Inactive'}
//                                         </span>

//                                         <div className="text-xs text-gray-500">
//                                             Updated {new Date(plan.updatedAt).toLocaleDateString()}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Modals */}
//                 <PlanModal
//                     show={showCreateModal}
//                     onClose={() => {
//                         setShowCreateModal(false);
//                         resetForm();
//                     }}
//                     title="Create New Plan"
//                     onSubmit={handleSubmit}
//                     formData={formData}
//                     handleInputChange={handleInputChange}
//                     handleFeatureChange={handleFeatureChange}
//                     addFeature={addFeature}
//                     removeFeature={removeFeature}
//                     loading={loading}
//                     editingPlan={editingPlan}
//                 />

//                 <PlanModal
//                     show={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setEditingPlan(null);
//                         resetForm();
//                     }}
//                     title="Edit Plan"
//                     onSubmit={handleSubmit}
//                     formData={formData}
//                     handleInputChange={handleInputChange}
//                     handleFeatureChange={handleFeatureChange}
//                     addFeature={addFeature}
//                     removeFeature={removeFeature}
//                     loading={loading}
//                     editingPlan={editingPlan}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PlanManagement;

import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit3, Trash2, Eye, EyeOff, Save, X, Star, DollarSign, Calendar, Tag, Settings, AlertCircle, CheckCircle, Search, MoreVertical, Gift, Clock } from 'lucide-react';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';


const PlanModal = ({ show, onClose, title, onSubmit, formData, handleInputChange, handleFeatureChange, addFeature, removeFeature, loading, editingPlan }) => {
    const planTypes = [
        { value: 'contact', label: 'Contact Unlock', color: 'bg-orange-500' },
        { value: 'map', label: 'Map Unlock', color: 'bg-blue-500' },
        { value: 'combo', label: 'Combo Pack', color: 'bg-red-500' },
        { value: 'premium', label: 'Premium', color: 'bg-green-500' },
        { value: 'free', label: 'Free', color: 'bg-red-500' }
    ];

    const colorOptions = [
        'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500',
        'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];

    const validityPresets = [
        { label: 'Per use', minutes: 0 },
        { label: '30 minutes', minutes: 30 },
        { label: '1 hour', minutes: 60 },
        { label: '2 hours', minutes: 120 },
        { label: '6 hours', minutes: 360 },
        { label: '12 hours', minutes: 720 },
        { label: '1 day', minutes: 1440 },
        { label: '3 days', minutes: 4320 },
        { label: '7 days', minutes: 10080 },
        { label: '15 days', minutes: 21600 },
        { label: '30 days (1 month)', minutes: 43200 },
        { label: '60 days (2 months)', minutes: 86400 },
        { label: '90 days (3 months)', minutes: 129600 },
        { label: '180 days (6 months)', minutes: 259200 },
        { label: '365 days (1 year)', minutes: 525600 }
    ];

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter plan name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City Name *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter city name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Type *
                            </label>
                            <select
                                name="planType"
                                value={formData.planType}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {planTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Contact Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="propertyContactAmount"
                                value={formData.propertyContactAmount}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter plan description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Original Price (₹)
                            </label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Validity Period *
                            </label>
                            <select
                                name="validityMinutes"
                                value={formData.validityMinutes}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {validityPresets.map(preset => (
                                    <option key={preset.minutes} value={preset.minutes}>
                                        {preset.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Validity (minutes)
                            </label>
                            <input
                                type="number"
                                name="validityMinutes"
                                value={formData.validityMinutes}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter custom minutes"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Theme
                            </label>
                            <select
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {colorOptions.map(color => (
                                    <option key={color} value={color}>
                                        {color.replace('bg-', '').replace('-500', '')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Free Credits
                            </label>
                            <input
                                type="number"
                                name="freeCredits"
                                value={formData.freeCredits}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Metadata</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contacts Included
                                </label>
                                <input
                                    type="number"
                                    name="metadata.contactsIncluded"
                                    value={formData.metadata.contactsIncluded}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="metadata.mapsIncluded"
                                    checked={formData.metadata.mapsIncluded}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <label className="ml-2 text-sm text-gray-700">Maps Included</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="metadata.unlimitedMaps"
                                    checked={formData.metadata.unlimitedMaps}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <label className="ml-2 text-sm text-gray-700">Unlimited Maps</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Features
                            </label>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                Add Feature
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter feature"
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="recommended"
                                    checked={formData.recommended}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <label className="ml-2 text-sm text-gray-700">Recommended Plan</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <label className="ml-2 text-sm text-gray-700">Active Plan</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {editingPlan ? 'Update Plan' : 'Create Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const [filterType, setFilterType] = useState('all');
    const [filterActive, setFilterActive] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        validityMinutes: 43200,
        color: 'bg-blue-500',
        planType: 'contact',
        recommended: false,
        isActive: true,
        city: '',
        freeCredits: 0,
        propertyContactAmount: 0,
        features: [''],
        metadata: {
            contactsIncluded: 0,
            mapsIncluded: false,
            unlimitedMaps: false
        }
    });

    const planTypes = [
        { value: 'contact', label: 'Contact Unlock', color: 'bg-orange-500' },
        { value: 'map', label: 'Map Unlock', color: 'bg-blue-500' },
        { value: 'combo', label: 'Combo Pack', color: 'bg-red-500' },
        { value: 'premium', label: 'Premium', color: 'bg-green-500' },
        { value: 'free', label: 'Free', color: 'bg-red-500' }
    ];

    const getValidityDisplay = (minutes) => {
        if (minutes === 0) {
            return 'Per use';
        } else if (minutes < 60) {
            return minutes === 1 ? '1 minute' : `${minutes} minutes`;
        } else if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            return hours === 1 ? '1 hour' : `${hours} hours`;
        } else if (minutes < 43200) {
            const days = Math.floor(minutes / 1440);
            return days === 1 ? '1 day' : `${days} days`;
        } else if (minutes < 525600) {
            const months = Math.floor(minutes / 43200);
            return months === 1 ? '1 month' : `${months} months`;
        } else {
            const years = Math.floor(minutes / 525600);
            return years === 1 ? '1 year' : `${years} years`;
        }
    };

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${base_url}/api/admin/plans`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    type: filterType === 'all' ? undefined : filterType,
                    active: filterActive === 'all' ? undefined : filterActive,
                    limit: 50
                }
            });

            setPlans(response.data.plans || []);
        } catch (error) {
            console.error('Error fetching plans:', error);
            setError('Failed to fetch plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [filterType, filterActive]);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            discount: '',
            validityMinutes: 43200,
            color: 'bg-blue-500',
            planType: 'contact',
            recommended: false,
            isActive: true,
            city: '',
            freeCredits: 0,
            propertyContactAmount: 0,
            features: [''],
            metadata: {
                contactsIncluded: 0,
                mapsIncluded: false,
                unlimitedMaps: false
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked :
                        type === 'number' ? parseInt(value) || 0 : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked :
                    type === 'number' ? parseFloat(value) || 0 : value
            }));
        }
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('authToken');
            const cleanedData = {
                ...formData,
                features: formData.features.filter(f => f.trim() !== ''),
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                discount: formData.discount ? parseFloat(formData.discount) : null,
                validityMinutes: parseInt(formData.validityMinutes),
                freeCredits: parseInt(formData.freeCredits),
                propertyContactAmount: formData.propertyContactAmount ? parseFloat(formData.propertyContactAmount) : 0
            };

            if (editingPlan) {
                await axios.put(`${base_url}/api/admin/plans/${editingPlan._id}`, cleanedData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Plan updated successfully');
                setShowEditModal(false);
            } else {
                await axios.post(`${base_url}/api/admin/plans`, cleanedData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Plan created successfully');
                setShowCreateModal(false);
            }

            resetForm();
            setEditingPlan(null);
            fetchPlans();

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error saving plan:', error);
            setError(error.response?.data?.message || 'Failed to save plan');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            description: plan.description,
            price: plan.price.toString(),
            originalPrice: plan.originalPrice ? plan.originalPrice.toString() : '',
            discount: plan.discount ? plan.discount.toString() : '',
            validityMinutes: plan.validityMinutes,
            color: plan.color,
            planType: plan.planType,
            recommended: plan.recommended,
            isActive: plan.isActive,
            city: plan.city || '',
            freeCredits: plan.freeCredits || 0,
            propertyContactAmount: plan.propertyContactAmount || 0,
            features: plan.features.length > 0 ? plan.features : [''],
            metadata: plan.metadata || {
                contactsIncluded: 0,
                mapsIncluded: false,
                unlimitedMaps: false
            }
        });
        setShowEditModal(true);
    };

    const handleToggleStatus = async (planId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${base_url}/api/admin/plans/${planId}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Plan status updated successfully');
            fetchPlans();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error toggling plan status:', error);
            setError('Failed to update plan status');
        }
    };

    const handleDelete = async (planId) => {
        if (!window.confirm('Are you sure you want to deactivate this plan?')) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${base_url}/api/admin/plans/${planId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Plan deactivated successfully');
            fetchPlans();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting plan:', error);
            setError('Failed to delete plan');
        }
    };

    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
                            <p className="text-gray-600">Create and manage subscription plans for your users</p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowCreateModal(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Plan
                        </button>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search plans..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Types</option>
                                {planTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filterActive}
                                onChange={(e) => setFilterActive(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : filteredPlans.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No plans found</p>
                            <p className="text-sm">Create your first plan to get started</p>
                        </div>
                    ) : (
                        filteredPlans.map((plan) => (
                            <div key={plan._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="p-6 border-b">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${plan.color}`}></div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                    {plan.name}
                                                    {plan.recommended && (
                                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    )}
                                                </h3>
                                                <span className="text-sm text-gray-500 capitalize">{plan.planType}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(plan._id)}
                                                className={`p-1 rounded transition-colors ${plan.isActive
                                                    ? 'text-green-600 hover:bg-green-50'
                                                    : 'text-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {plan.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>

                                            <div className="relative group">
                                                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                    <button
                                                        onClick={() => handleEdit(plan)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit Plan
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(plan._id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

                                    {plan.city && (
                                        <div className="text-sm text-gray-500 mb-2">
                                            <span className="font-medium">City:</span> {plan.city}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
                                        {plan.originalPrice && (
                                            <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
                                        )}
                                        {plan.discount && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                {plan.discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {getValidityDisplay(plan.validityMinutes)}
                                    </div>

                                    {plan.freeCredits > 0 && (
                                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                                            <Gift className="w-4 h-4" />
                                            {plan.freeCredits} free credits
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    {plan.features && plan.features.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {plan.metadata && (
                                        <div className="space-y-2">
                                            {plan.metadata.contactsIncluded > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Tag className="w-4 h-4" />
                                                    {plan.metadata.contactsIncluded} contacts
                                                </div>
                                            )}
                                            {plan.metadata.mapsIncluded && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    Maps included
                                                </div>
                                            )}
                                            {plan.metadata.unlimitedMaps && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    Unlimited maps
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${plan.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </span>

                                        <div className="text-xs text-gray-500">
                                            Updated {new Date(plan.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <PlanModal
                    show={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        resetForm();
                    }}
                    title="Create New Plan"
                    onSubmit={handleSubmit}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFeatureChange={handleFeatureChange}
                    addFeature={addFeature}
                    removeFeature={removeFeature}
                    loading={loading}
                    editingPlan={editingPlan}
                />

                <PlanModal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingPlan(null);
                        resetForm();
                    }}
                    title="Edit Plan"
                    onSubmit={handleSubmit}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFeatureChange={handleFeatureChange}
                    addFeature={addFeature}
                    removeFeature={removeFeature}
                    loading={loading}
                    editingPlan={editingPlan}
                />
            </div>
        </div>
    );
};

export default PlanManagement;
