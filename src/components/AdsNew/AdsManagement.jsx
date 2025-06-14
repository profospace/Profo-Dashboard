// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter, Eye, MousePointer, Edit, Trash2, Power, PowerOff } from 'lucide-react';

// const AdsManagement = ({ base_url, getAuthConfig, onEditAd, onCreateNew }) => {
//     const [ads, setAds] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//     const [filterType, setFilterType] = useState('all');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [adToDelete, setAdToDelete] = useState(null);

//     useEffect(() => {
//         fetchAds();
//     }, [currentPage, filterStatus, filterType]);

//     const fetchAds = async () => {
//         try {
//             setLoading(true);
//             let url = `${base_url}/api/ads?page=${currentPage}&limit=10`;

//             if (filterStatus !== 'all') {
//                 url += `&isActive=${filterStatus === 'active'}`;
//             }
//             if (filterType !== 'all') {
//                 url += `&type=${filterType}`;
//             }

//             const response = await fetch(url, getAuthConfig());
//             const data = await response.json();

//             if (data.success) {
//                 setAds(data.ads || []);
//                 setTotalPages(data.totalPages || 1);
//             } else {
//                 console.error('Failed to fetch ads:', data.message);
//                 setAds([]);
//             }
//         } catch (error) {
//             console.error('Error fetching ads:', error);
//             setAds([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleToggleStatus = async (adId) => {
//         try {
//             const response = await fetch(`${base_url}/api/ads/${adId}/toggle`, {
//                 ...getAuthConfig(),
//                 method: 'PATCH',
//             });

//             if (response.ok) {
//                 fetchAds(); // Refresh the list
//             }
//         } catch (error) {
//             console.error('Error toggling ad status:', error);
//         }
//     };

//     const handleDeleteAd = async () => {
//         if (!adToDelete) return;

//         try {
//             const response = await fetch(`${base_url}/api/ads/${adToDelete.adId}`, {
//                 ...getAuthConfig(),
//                 method: 'DELETE',
//             });

//             if (response.ok) {
//                 fetchAds(); // Refresh the list
//                 setShowDeleteModal(false);
//                 setAdToDelete(null);
//             }
//         } catch (error) {
//             console.error('Error deleting ad:', error);
//         }
//     };

//     const filteredAds = ads.filter(ad =>
//         ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     const AdTypesBadge = ({ type }) => {
//         const colors = {
//             BANNER: 'bg-blue-100 text-blue-800',
//             POPUP: 'bg-purple-100 text-purple-800',
//             INTERSTITIAL: 'bg-orange-100 text-orange-800',
//             NATIVE: 'bg-green-100 text-green-800',
//             VIDEO: 'bg-red-100 text-red-800',
//         };

//         return (
//             <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
//                 {type || 'Unknown'}
//             </span>
//         );
//     };

//     if (loading && ads.length === 0) {
//         return (
//             <div className="p-6">
//                 <div className="animate-pulse space-y-4">
//                     <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//                     <div className="h-12 bg-gray-200 rounded"></div>
//                     <div className="space-y-3">
//                         {[1, 2, 3, 4, 5].map((i) => (
//                             <div key={i} className="h-16 bg-gray-200 rounded"></div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Ads Management</h2>
//                     <p className="text-gray-600">Create, edit, and manage your advertising campaigns</p>
//                 </div>
//                 <button
//                     onClick={onCreateNew}
//                     className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
//                 >
//                     <Plus size={20} className="mr-2" />
//                     Create New Ad
//                 </button>
//             </div>

//             {/* Search and Filters */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                 <div className="relative flex-1">
//                     <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                         type="text"
//                         placeholder="Search ads..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <select
//                     value={filterStatus}
//                     onChange={(e) => {
//                         setFilterStatus(e.target.value);
//                         setCurrentPage(1); // Reset to first page when filter changes
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                     <option value="all">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                 </select>
//                 <select
//                     value={filterType}
//                     onChange={(e) => {
//                         setFilterType(e.target.value);
//                         setCurrentPage(1); // Reset to first page when filter changes
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                     <option value="all">All Types</option>
//                     <option value="BANNER">Banner</option>
//                     <option value="POPUP">Popup</option>
//                     <option value="INTERSTITIAL">Interstitial</option>
//                     <option value="NATIVE">Native</option>
//                     <option value="VIDEO">Video</option>
//                 </select>
//             </div>

//             {/* Ads Table */}
//             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredAds.map((ad) => (
//                                 <tr key={ad.adId} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4">
//                                         <div>
//                                             <div className="text-sm font-medium text-gray-900">{ad.name}</div>
//                                             <div className="text-sm text-gray-500">{ad.description || 'No description'}</div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <AdTypesBadge type={ad.type} />
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${ad.isActive
//                                             ? 'bg-green-100 text-green-800'
//                                             : 'bg-red-100 text-red-800'
//                                             }`}>
//                                             {ad.isActive ? 'Active' : 'Inactive'}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center space-x-4 text-sm text-gray-500">
//                                             <div className="flex items-center">
//                                                 <Eye size={16} className="mr-1" />
//                                                 {ad.analytics?.impressions || 0}
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <MousePointer size={16} className="mr-1" />
//                                                 {ad.analytics?.clicks || 0}
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="text-sm text-gray-900">
//                                             ${ad.budget?.spent || 0} / ${ad.budget?.total || 0}
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center space-x-2">
//                                             <button
//                                                 onClick={() => handleToggleStatus(ad.adId)}
//                                                 className={`p-2 rounded-lg transition-colors ${ad.isActive
//                                                     ? 'text-orange-600 hover:bg-orange-50'
//                                                     : 'text-green-600 hover:bg-green-50'
//                                                     }`}
//                                                 title={ad.isActive ? 'Deactivate' : 'Activate'}
//                                             >
//                                                 {ad.isActive ? <PowerOff size={16} /> : <Power size={16} />}
//                                             </button>
//                                             <button
//                                                 onClick={() => onEditAd(ad)}
//                                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                                 title="Edit"
//                                             >
//                                                 <Edit size={16} />
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     setAdToDelete(ad);
//                                                     setShowDeleteModal(true);
//                                                 }}
//                                                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                                 title="Delete"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {filteredAds.length === 0 && !loading && (
//                     <div className="text-center py-12">
//                         <div className="text-gray-400 mb-4">
//                             <Filter size={48} className="mx-auto" />
//                         </div>
//                         <p className="text-gray-500">
//                             {searchTerm || filterStatus !== 'all' || filterType !== 'all'
//                                 ? 'No ads found matching your criteria'
//                                 : 'No ads created yet'}
//                         </p>
//                         {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
//                             <button
//                                 onClick={onCreateNew}
//                                 className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                             >
//                                 Create Your First Ad
//                             </button>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <div className="flex justify-center mt-6">
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                             disabled={currentPage === 1}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Previous
//                         </button>
//                         <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
//                             {currentPage} of {totalPages}
//                         </span>
//                         <button
//                             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                             disabled={currentPage === totalPages}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg max-w-md w-full p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Ad</h3>
//                         <p className="text-gray-600 mb-6">
//                             Are you sure you want to delete "{adToDelete?.name}"? This action cannot be undone.
//                         </p>
//                         <div className="flex justify-end space-x-4">
//                             <button
//                                 onClick={() => {
//                                     setShowDeleteModal(false);
//                                     setAdToDelete(null);
//                                 }}
//                                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleDeleteAd}
//                                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdsManagement;

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, MousePointer, Edit, Trash2, Power, PowerOff, BarChart3, Users } from 'lucide-react';

const AdsManagement = ({ base_url, getAuthConfig, onEditAd, onCreateNew, onViewInteractions }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);


    useEffect(() => {
        fetchAds();
    }, [currentPage, filterStatus, filterType]);

    const fetchAds = async () => {
        try {
            setLoading(true);
            let url = `${base_url}/api/ads?page=${currentPage}&limit=10`;

            if (filterStatus !== 'all') {
                url += `&isActive=${filterStatus === 'active'}`;
            }
            if (filterType !== 'all') {
                url += `&type=${filterType}`;
            }

            const response = await fetch(url, getAuthConfig());
            const data = await response.json();

            if (data.success) {
                setAds(data.ads || []);
                setTotalPages(data.totalPages || 1);
            } else {
                console.error('Failed to fetch ads:', data.message);
                setAds([]);
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
            setAds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (adId) => {
        try {
            const response = await fetch(`${base_url}/api/ads/${adId}/toggle`, {
                ...getAuthConfig(),
                method: 'PATCH',
            });

            if (response.ok) {
                fetchAds(); // Refresh the list
            }
        } catch (error) {
            console.error('Error toggling ad status:', error);
        }
    };

    const handleDeleteAd = async () => {
        if (!adToDelete) return;

        try {
            const response = await fetch(`${base_url}/api/ads/${adToDelete.adId}`, {
                ...getAuthConfig(),
                method: 'DELETE',
            });

            if (response.ok) {
                fetchAds(); // Refresh the list
                setShowDeleteModal(false);
                setAdToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
        }
    };

    const filteredAds = ads.filter(ad =>
        ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const AdTypesBadge = ({ type }) => {
        const colors = {
            BANNER: 'bg-blue-100 text-blue-800',
            POPUP: 'bg-purple-100 text-purple-800',
            INTERSTITIAL: 'bg-orange-100 text-orange-800',
            NATIVE: 'bg-green-100 text-green-800',
            VIDEO: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
                {type || 'Unknown'}
            </span>
        );
    };

    if (loading && ads.length === 0) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ads Management</h2>
                    <p className="text-gray-600">Create, edit, and manage your advertising campaigns</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Plus size={20} className="mr-2" />
                    Create New Ad
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <select
                    value={filterType}
                    onChange={(e) => {
                        setFilterType(e.target.value);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Types</option>
                    <option value="BANNER">Banner</option>
                    <option value="POPUP">Popup</option>
                    <option value="INTERSTITIAL">Interstitial</option>
                    <option value="NATIVE">Native</option>
                    <option value="VIDEO">Video</option>
                </select>
            </div>

            {/* Ads Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAds.map((ad) => (
                                <tr key={ad.adId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                                            <div className="text-sm text-gray-500">{ad.description || 'No description'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <AdTypesBadge type={ad.type} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ad.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {ad.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Eye size={16} className="mr-1" />
                                                {ad.analytics?.impressions || 0}
                                            </div>
                                            <div className="flex items-center">
                                                <MousePointer size={16} className="mr-1" />
                                                {ad.analytics?.clicks || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            ${ad.budget?.spent || 0} / ${ad.budget?.total || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onViewInteractions?.(ad.adId)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="View Interactions"
                                            >
                                                <BarChart3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(ad.adId)}
                                                className={`p-2 rounded-lg transition-colors ${ad.isActive
                                                    ? 'text-orange-600 hover:bg-orange-50'
                                                    : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={ad.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {ad.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                                            </button>
                                            <button
                                                onClick={() => onEditAd(ad)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setAdToDelete(ad);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAds.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Filter size={48} className="mx-auto" />
                        </div>
                        <p className="text-gray-500">
                            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                                ? 'No ads found matching your criteria'
                                : 'No ads created yet'}
                        </p>
                        {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                            <button
                                onClick={onCreateNew}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Ad
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Ad</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{adToDelete?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setAdToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAd}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdsManagement;