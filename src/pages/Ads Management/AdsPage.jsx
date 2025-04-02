// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdForm from '../../components/Ads/AdForm';
// import axios from 'axios';
// import { base_url } from '../../../utils/base_url';

// const AdsPage = () => {
//     const navigate = useNavigate();
//     const [ads, setAds] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isAdFormOpen, setIsAdFormOpen] = useState(false);
//     const [editingAdIndex, setEditingAdIndex] = useState(null);
//     const [currentAd, setCurrentAd] = useState(null);
//     const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//     useEffect(() => {
//         fetchAds();
//     }, []);

//     const fetchAds = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.get(`${base_url}/api/colors/ads`);

//             if (response.data) {
//                 setAds(response.data);
//             } else {
//                 setAds([]);
//             }
//         } catch (error) {
//             console.error('Error fetching ads:', error);
//             showNotification('Failed to load ads', 'error');
//             setAds([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleAddAd = () => {
//         setEditingAdIndex(null);
//         setCurrentAd(null);
//         setIsAdFormOpen(true);
//     };

//     const handleEditAd = (index) => {
//         setEditingAdIndex(index);
//         setCurrentAd(ads[index]);
//         setIsAdFormOpen(true);
//     };

//     const handleAdFormCancel = () => {
//         setIsAdFormOpen(false);
//     };

//     const handleAdFormSubmit = async (ad) => {
//         try {
//             setIsLoading(true);

//             if (editingAdIndex !== null) {
//                 // Update existing ad
//                 const updatedAds = [...ads];
//                 updatedAds[editingAdIndex] = ad;

//                 const response = await axios.post(`${base_url}/api/colors/update-ads`, {
//                     ads: updatedAds
//                 });

//                 if (response.status === 200) {
//                     setAds(updatedAds);
//                     showNotification('Ad updated successfully', 'success');
//                 }
//             } else {
//                 // Add new ad
//                 const newAds = [...ads, ad];

//                 const response = await axios.post(`${base_url}/api/colors/update-ads`, {
//                     ads: newAds
//                 });

//                 if (response.status === 200) {
//                     setAds(newAds);
//                     showNotification('Ad added successfully', 'success');
//                 }
//             }
//         } catch (error) {
//             console.error('Error saving ad:', error);
//             showNotification('Failed to save ad', 'error');
//         } finally {
//             setIsLoading(false);
//             setIsAdFormOpen(false);
//         }
//     };

//     const handleDeleteAd = async (index) => {
//         if (!window.confirm('Are you sure you want to delete this ad?')) {
//             return;
//         }

//         try {
//             setIsLoading(true);

//             const updatedAds = ads.filter((_, i) => i !== index);

//             const response = await axios.post(`${base_url}/api/colors/update-ads`, {
//                 ads: updatedAds
//             });

//             if (response.status === 200) {
//                 setAds(updatedAds);
//                 showNotification('Ad deleted successfully', 'success');
//             }
//         } catch (error) {
//             console.error('Error deleting ad:', error);
//             showNotification('Failed to delete ad', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const showNotification = (message, type = 'success') => {
//         setNotification({ show: true, message, type });
//         setTimeout(() => {
//             setNotification({ show: false, message: '', type: '' });
//         }, 3000);
//     };

//     const getAdTypeDisplay = (adType) => {
//         if (!adType) return 'N/A';

//         let display = adType.type || 'Unknown';

//         if (adType.type === 'BANNER') {
//             display += ` (${adType.width || 0}x${adType.height || 0})`;
//         } else if (adType.type === 'POPUP') {
//             display += ` (Delay: ${adType.delay || 0}ms)`;
//         } else if (adType.type === 'INTERSTITIAL') {
//             display += ` (Fullscreen: ${adType.fullscreen ? 'Yes' : 'No'})`;
//         }

//         return display;
//     };

//     if (isLoading && ads.length === 0) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Ads Management</h1>
//                 <div className="space-x-4">
//                     <button
//                         onClick={handleAddAd}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
//                     >
//                         Add New Ad
//                     </button>
//                     <button
//                         onClick={() => navigate('/colors')}
//                         className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
//                     >
//                         Back to Colors
//                     </button>
//                 </div>
//             </div>

//             {notification.show && (
//                 <div className={`p-4 mb-6 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                     {notification.message}
//                 </div>
//             )}

//             {ads.length === 0 ? (
//                 <div className="bg-white shadow-md rounded-lg p-8 text-center">
//                     <h2 className="text-xl font-semibold mb-4 text-gray-700">No Ads Available</h2>
//                     <p className="text-gray-600 mb-6">You haven't created any ads yet. Use the "Add New Ad" button to get started.</p>
//                     <button
//                         onClick={handleAddAd}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
//                     >
//                         Create Your First Ad
//                     </button>
//                 </div>
//             ) : (
//                 <div className="grid gap-6">
//                     {ads.map((ad, index) => (
//                         <div key={index} className="bg-white shadow-md rounded-lg p-6">
//                             <div className="flex justify-between items-start">
//                                 <div>
//                                     <h2 className="text-xl font-semibold text-gray-800">{ad.name || `Ad ${index + 1}`}</h2>
//                                     <p className="text-gray-600 mt-1">{ad.header || 'No header'}</p>
//                                 </div>
//                                 <div className="space-x-2">
//                                     <button
//                                         onClick={() => handleEditAd(index)}
//                                         className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
//                                     >
//                                         Edit
//                                     </button>
//                                     <button
//                                         onClick={() => handleDeleteAd(index)}
//                                         className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 <div>
//                                     <h3 className="text-sm font-medium text-gray-500">Type</h3>
//                                     <p className="mt-1">{getAdTypeDisplay(ad.type)}</p>
//                                 </div>

//                                 {ad.pagelink && (
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-500">Page Link</h3>
//                                         <p className="mt-1 truncate">
//                                             <a
//                                                 href={ad.pagelink}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue-600 hover:underline"
//                                             >
//                                                 {ad.pagelink}
//                                             </a>
//                                         </p>
//                                     </div>
//                                 )}

//                                 {ad.contact && ad.contact.length > 0 && (
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-500">Contact Info</h3>
//                                         <p className="mt-1">{ad.contact.join(', ')}</p>
//                                     </div>
//                                 )}
//                             </div>

//                             {ad.imagelinks && ad.imagelinks.length > 0 && (
//                                 <div className="mt-4">
//                                     <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
//                                     <div className="flex flex-wrap gap-3">
//                                         {ad.imagelinks.map((url, i) => (
//                                             <div key={i} className="relative group">
//                                                 <img
//                                                     src={url}
//                                                     alt={`Ad image ${i + 1}`}
//                                                     className="w-24 h-24 object-cover rounded border border-gray-200"
//                                                     onError={(e) => {
//                                                         e.target.onerror = null;
//                                                         e.target.src = 'https://via.placeholder.com/96?text=Error';
//                                                     }}
//                                                 />
//                                                 <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
//                                                     <a
//                                                         href={url}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-white text-xs px-2 py-1 bg-black bg-opacity-50 rounded"
//                                                     >
//                                                         View
//                                                     </a>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {isAdFormOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//                         <h2 className="text-xl font-semibold mb-4">
//                             {editingAdIndex !== null ? 'Edit Ad' : 'Add New Ad'}
//                         </h2>
//                         <AdForm
//                             ad={currentAd}
//                             onSubmit={handleAdFormSubmit}
//                             onCancel={handleAdFormCancel}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const AdsPage = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${base_url}/api/colors/ads`);

            if (response.data) {
                setAds(response.data);
            } else {
                setAds([]);
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
            showNotification('Failed to load ads', 'error');
            setAds([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAd = () => {
        navigate('/post-new-ad');
    };

    const handleEditAd = (index) => {
        navigate(`/edit-ad/${index}`);
    };

    const handleDeleteAd = async (index) => {
        if (!window.confirm('Are you sure you want to delete this ad?')) {
            return;
        }

        try {
            setIsLoading(true);

            const updatedAds = ads.filter((_, i) => i !== index);

            const response = await axios.post(`${base_url}/api/colors/update-ads`, {
                ads: updatedAds
            });

            if (response.status === 200) {
                setAds(updatedAds);
                showNotification('Ad deleted successfully', 'success');
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
            showNotification('Failed to delete ad', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const getAdTypeDisplay = (adType) => {
        if (!adType) return 'N/A';

        let display = adType.type || 'Unknown';

        if (adType.type === 'BANNER') {
            display += ` (${adType.width || 0}x${adType.height || 0})`;
        } else if (adType.type === 'POPUP') {
            display += ` (Delay: ${adType.delay || 0}ms)`;
        } else if (adType.type === 'INTERSTITIAL') {
            display += ` (Fullscreen: ${adType.fullscreen ? 'Yes' : 'No'})`;
        }

        return display;
    };

    if (isLoading && ads.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto ">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Ads Management</h1>
                <div className="space-x-4">
                    <button
                        onClick={handleAddAd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                    >
                        Add New Ad
                    </button>
                    <button
                        onClick={() => navigate('/colors')}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
                    >
                        Back to Colors
                    </button>
                </div>
            </div>

            {notification.show && (
                <div className={`p-4 mb-6 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {notification.message}
                </div>
            )}

            {ads.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">No Ads Available</h2>
                    <p className="text-gray-600 mb-6">You haven't created any ads yet. Use the "Add New Ad" button to get started.</p>
                    <button
                        onClick={handleAddAd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                    >
                        Create Your First Ad
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {ads.map((ad, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{ad.name || `Ad ${index + 1}`}</h2>
                                    <p className="text-gray-600 mt-1">{ad.header || 'No header'}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEditAd(index)}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAd(index)}
                                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                                    <p className="mt-1">{getAdTypeDisplay(ad.type)}</p>
                                </div>

                                {ad.pagelink && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Page Link</h3>
                                        <p className="mt-1 truncate">
                                            <a
                                                href={ad.pagelink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {ad.pagelink}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {ad.contact && ad.contact.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Contact Info</h3>
                                        <p className="mt-1">{ad.contact.join(', ')}</p>
                                    </div>
                                )}
                            </div>

                            {ad.imagelinks && ad.imagelinks.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {ad.imagelinks.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Ad image ${i + 1}`}
                                                    className="w-24 h-24 object-cover rounded border border-gray-200"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/96?text=Error';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-white text-xs px-2 py-1 bg-black bg-opacity-50 rounded"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdsPage;
