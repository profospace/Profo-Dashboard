// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { base_url } from '../../../utils/base_url';

// const AdDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [ad, setAd] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [deleteConfirm, setDeleteConfirm] = useState(false);

//     useEffect(() => {
//         const fetchAd = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`${base_url}/ads/${id}`);
//                 setAd(response.data.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Failed to fetch ad details');
//                 setLoading(false);
//             }
//         };

//         fetchAd();
//     }, [id]);

//     const handleDelete = async () => {
//         try {
//             await axios.delete(`/api/ads/${id}`);
//             navigate('/ads', { replace: true });
//         } catch (err) {
//             setError('Failed to delete ad');
//         }
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const date = new Date(dateString);
//         return date.toLocaleDateString();
//     };

//     // Get badge color based on ad status
//     const getStatusBadgeColor = (status) => {
//         switch (status) {
//             case 'ACTIVE':
//                 return 'bg-green-100 text-green-800';
//             case 'PAUSED':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'ARCHIVED':
//                 return 'bg-gray-100 text-gray-800';
//             default:
//                 return 'bg-blue-100 text-blue-800';
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//                 <Link
//                     to="/ads"
//                     className="text-blue-500 hover:text-blue-700"
//                 >
//                     &larr; Back to Ads
//                 </Link>
//             </div>
//         );
//     }

//     if (!ad) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//                     Ad not found
//                 </div>
//                 <Link
//                     to="/ads"
//                     className="text-blue-500 hover:text-blue-700"
//                 >
//                     &larr; Back to Ads
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8 max-w-5xl">
//             <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center space-x-4">
//                     <Link
//                         to="/ads"
//                         className="text-blue-500 hover:text-blue-700"
//                     >
//                         &larr; Back to Ads
//                     </Link>
//                     <h1 className="text-2xl font-bold">{ad.name}</h1>
//                     <span
//                         className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(ad.status)}`}
//                     >
//                         {ad.status}
//                     </span>
//                 </div>
//                 <div className="flex space-x-2">
//                     <Link
//                         to={`/ads/${id}/edit`}
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         Edit
//                     </Link>
//                     <button
//                         onClick={() => setDeleteConfirm(true)}
//                         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         Delete
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Name:</p>
//                             <p>{ad.name}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Header:</p>
//                             <p>{ad.header || 'N/A'}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Page Link:</p>
//                             <p>
//                                 {ad.pagelink ? (
//                                     <a
//                                         href={ad.pagelink}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-blue-500 hover:text-blue-700"
//                                     >
//                                         {ad.pagelink}
//                                     </a>
//                                 ) : (
//                                     'N/A'
//                                 )}
//                             </p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Status:</p>
//                             <p>{ad.status}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Priority:</p>
//                             <p>{ad.priority}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Date Range:</p>
//                             <p>
//                                 {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
//                             </p>
//                         </div>
//                     </div>

//                     <div>
//                         <h2 className="text-xl font-semibold mb-4">Performance</h2>
//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Impressions:</p>
//                             <p>{ad.impressions.toLocaleString()}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Clicks:</p>
//                             <p>{ad.clicks.toLocaleString()}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Clickthrough Rate:</p>
//                             <p>{ad.clickthrough_rate.toFixed(2)}%</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Created At:</p>
//                             <p>{new Date(ad.createdAt).toLocaleString()}</p>
//                         </div>

//                         <div className="mb-4">
//                             <p className="text-gray-700 text-sm font-bold mb-1">Last Updated:</p>
//                             <p>{new Date(ad.updatedAt).toLocaleString()}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mt-6">
//                     <h2 className="text-xl font-semibold mb-4">Ad Type Information</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Type:</p>
//                                 <p>{ad.type.type.replace('_', ' ')}</p>
//                             </div>

//                             {ad.type.type === 'BANNER' && (
//                                 <>
//                                     <div className="mb-4">
//                                         <p className="text-gray-700 text-sm font-bold mb-1">Dimensions:</p>
//                                         <p>{ad.type.width || 'Auto'} x {ad.type.height || 'Auto'}</p>
//                                     </div>
//                                 </>
//                             )}

//                             {ad.type.type === 'POPUP' && (
//                                 <div className="mb-4">
//                                     <p className="text-gray-700 text-sm font-bold mb-1">Delay:</p>
//                                     <p>{ad.type.delay} seconds</p>
//                                 </div>
//                             )}

//                             {ad.type.type === 'INTERSTITIAL' && (
//                                 <div className="mb-4">
//                                     <p className="text-gray-700 text-sm font-bold mb-1">Fullscreen:</p>
//                                     <p>{ad.type.fullscreen ? 'Yes' : 'No'}</p>
//                                 </div>
//                             )}

//                             {ad.type.type === 'PAGE_END' && (
//                                 <div className="mb-4">
//                                     <p className="text-gray-700 text-sm font-bold mb-1">Show After Scroll:</p>
//                                     <p>{ad.type.showAfterScroll ? 'Yes' : 'No'}</p>
//                                 </div>
//                             )}

//                             {['SEARCH_PAGE', 'FILTER_PAGE', 'BUILDING_PAGE', 'PROPERTIES_PAGE', 'PROJECT_PAGE', 'CALL_PAGE'].includes(ad.type.type) && (
//                                 <div className="mb-4">
//                                     <p className="text-gray-700 text-sm font-bold mb-1">Position:</p>
//                                     <p>{ad.type.position}</p>
//                                 </div>
//                             )}

//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Display Duration:</p>
//                                 <p>{ad.type.displayDuration} seconds</p>
//                             </div>

//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Show Only Once:</p>
//                                 <p>{ad.type.showOnce ? 'Yes' : 'No'}</p>
//                             </div>
//                         </div>

//                         <div>
//                             <h3 className="text-lg font-semibold mb-2">Location Targeting</h3>
//                             {ad.type.location && ad.type.location.latitude && ad.type.location.longitude ? (
//                                 <>
//                                     <div className="mb-4">
//                                         <p className="text-gray-700 text-sm font-bold mb-1">Coordinates:</p>
//                                         <p>
//                                             {ad.type.location.latitude}, {ad.type.location.longitude}
//                                         </p>
//                                     </div>
//                                     <div className="mb-4">
//                                         <p className="text-gray-700 text-sm font-bold mb-1">Radius:</p>
//                                         <p>{ad.type.location.radius} km</p>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <p className="mb-4 text-gray-500 italic">No location targeting</p>
//                             )}

//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">City:</p>
//                                 <p>{ad.type.city || 'N/A'}</p>
//                             </div>

//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Pincode:</p>
//                                 <p>{ad.type.pincode || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mt-6">
//                     <h2 className="text-xl font-semibold mb-4">Audience Targeting</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Age Range:</p>
//                                 <p>
//                                     {ad.targeted_audience?.ageRange?.min || 'Any'} - {ad.targeted_audience?.ageRange?.max || 'Any'}
//                                 </p>
//                             </div>

//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Gender:</p>
//                                 <p>{ad.targeted_audience?.gender || 'All'}</p>
//                             </div>
//                         </div>

//                         <div>
//                             <div className="mb-4">
//                                 <p className="text-gray-700 text-sm font-bold mb-1">Interests:</p>
//                                 {ad.targeted_audience?.interests && ad.targeted_audience.interests.length > 0 ? (
//                                     <ul className="list-disc pl-5">
//                                         {ad.targeted_audience.interests.map((interest, index) => (
//                                             <li key={index}>{interest}</li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p>No specific interests targeted</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mt-6">
//                     <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
//                     {ad.contact && ad.contact.length > 0 ? (
//                         <ul className="list-disc pl-5">
//                             {ad.contact.map((contact, index) => (
//                                 <li key={index}>{contact}</li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No contact information available</p>
//                     )}
//                 </div>

//                 <div className="mt-6">
//                     <h2 className="text-xl font-semibold mb-4">Ad Images</h2>
//                     {ad.imagelinks && ad.imagelinks.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {ad.imagelinks.map((imagelink, index) => (
//                                 <div key={index} className="border rounded overflow-hidden">
//                                     <img
//                                         src={imagelink}
//                                         alt={`Ad image ${index + 1}`}
//                                         className="w-full h-48 object-cover"
//                                         onError={(e) => {
//                                             e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
//                                         }}
//                                     />
//                                     <div className="p-2 bg-gray-100">
//                                         <a
//                                             href={imagelink}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="text-blue-500 hover:text-blue-700 text-sm truncate block"
//                                         >
//                                             {imagelink}
//                                         </a>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p>No images available</p>
//                     )}
//                 </div>
//             </div>

//             {/* Delete Confirmation Modal */}
//             {deleteConfirm && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
//                     <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
//                         <div className="mt-3 text-center">
//                             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
//                                 <svg
//                                     className="h-6 w-6 text-red-600"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                                     />
//                                 </svg>
//                             </div>
//                             <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">Confirm Delete</h3>
//                             <div className="mt-2 px-7 py-3">
//                                 <p className="text-sm text-gray-500">
//                                     Are you sure you want to delete this ad? This action cannot be undone.
//                                 </p>
//                             </div>
//                             <div className="items-center px-4 py-3">
//                                 <button
//                                     onClick={handleDelete}
//                                     className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-28 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
//                                 >
//                                     Delete
//                                 </button>
//                                 <button
//                                     onClick={() => setDeleteConfirm(false)}
//                                     className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-28 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdDetail;



import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../../../utils/base_url';

const AdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${base_url}/ads/${id}`);

                if (response.data && response.data.data) {
                    setAd(response.data.data);
                } else {
                    setError('Invalid ad data received');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching ad details:', err);
                setError('Failed to fetch ad details');
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${base_url}/ads/${id}`);
            navigate('/ads', { replace: true });
        } catch (err) {
            console.error('Error deleting ad:', err);
            setError('Failed to delete ad');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Get badge color based on ad status
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PAUSED':
                return 'bg-yellow-100 text-yellow-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <Link
                    to="/ads"
                    className="text-blue-500 hover:text-blue-700"
                >
                    &larr; Back to Ads
                </Link>
            </div>
        );
    }

    if (!ad) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    Ad not found
                </div>
                <Link
                    to="/ads"
                    className="text-blue-500 hover:text-blue-700"
                >
                    &larr; Back to Ads
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/ads"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        &larr; Back to Ads
                    </Link>
                    <h1 className="text-2xl font-bold">{ad.name}</h1>
                    <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(ad.status)}`}
                    >
                        {ad.status || 'N/A'}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <Link
                        to={`/ads/${id}/edit`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => setDeleteConfirm(true)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Name:</p>
                            <p>{ad.name}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Header:</p>
                            <p>{ad.header || 'N/A'}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Page Link:</p>
                            <p>
                                {ad.pagelink ? (
                                    <a
                                        href={ad.pagelink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {ad.pagelink}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Status:</p>
                            <p>{ad.status || 'Active'}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Priority:</p>
                            <p>{ad.priority || 0}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Date Range:</p>
                            <p>
                                {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Performance</h2>
                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Impressions:</p>
                            <p>{(ad.impressions || 0).toLocaleString()}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Clicks:</p>
                            <p>{(ad.clicks || 0).toLocaleString()}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700 text-sm font-bold mb-1">Clickthrough Rate:</p>
                            <p>{((ad.clickthrough_rate || 0).toFixed(2))}%</p>
                        </div>

                        {ad.createdAt && (
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">Created At:</p>
                                <p>{new Date(ad.createdAt).toLocaleString()}</p>
                            </div>
                        )}

                        {ad.updatedAt && (
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">Last Updated:</p>
                                <p>{new Date(ad.updatedAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {ad.type && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Ad Type Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm font-bold mb-1">Type:</p>
                                    <p>{ad.type.type ? ad.type.type.replace('_', ' ') : 'N/A'}</p>
                                </div>

                                {ad.type.type === 'BANNER' && (
                                    <>
                                        <div className="mb-4">
                                            <p className="text-gray-700 text-sm font-bold mb-1">Dimensions:</p>
                                            <p>{ad.type.width || 'Auto'} x {ad.type.height || 'Auto'}</p>
                                        </div>
                                    </>
                                )}

                                {ad.type.type === 'POPUP' && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Delay:</p>
                                        <p>{ad.type.delay || 0} seconds</p>
                                    </div>
                                )}

                                {ad.type.type === 'INTERSTITIAL' && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Fullscreen:</p>
                                        <p>{ad.type.fullscreen ? 'Yes' : 'No'}</p>
                                    </div>
                                )}

                                {ad.type.type === 'PAGE_END' && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Show After Scroll:</p>
                                        <p>{ad.type.showAfterScroll ? 'Yes' : 'No'}</p>
                                    </div>
                                )}

                                {['SEARCH_PAGE', 'FILTER_PAGE', 'BUILDING_PAGE', 'PROPERTIES_PAGE', 'PROJECT_PAGE', 'CALL_PAGE'].includes(ad.type.type) && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Position:</p>
                                        <p>{ad.type.position || 'TOP'}</p>
                                    </div>
                                )}

                                {ad.type.displayDuration !== undefined && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Display Duration:</p>
                                        <p>{ad.type.displayDuration} seconds</p>
                                    </div>
                                )}

                                {ad.type.showOnce !== undefined && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Show Only Once:</p>
                                        <p>{ad.type.showOnce ? 'Yes' : 'No'}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Location Targeting</h3>
                                {ad.type.location && (ad.type.location.latitude || ad.type.location.longitude) ? (
                                    <>
                                        <div className="mb-4">
                                            <p className="text-gray-700 text-sm font-bold mb-1">Coordinates:</p>
                                            <p>
                                                {ad.type.location.latitude || 'N/A'}, {ad.type.location.longitude || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-gray-700 text-sm font-bold mb-1">Radius:</p>
                                            <p>{ad.type.location.radius || 0} km</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="mb-4 text-gray-500 italic">No location targeting</p>
                                )}

                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm font-bold mb-1">City:</p>
                                    <p>{ad.type.city || 'N/A'}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm font-bold mb-1">Pincode:</p>
                                    <p>{ad.type.pincode || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {ad.targeted_audience && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Audience Targeting</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                {ad.targeted_audience.ageRange && (
                                    <div className="mb-4">
                                        <p className="text-gray-700 text-sm font-bold mb-1">Age Range:</p>
                                        <p>
                                            {ad.targeted_audience.ageRange.min || 'Any'} - {ad.targeted_audience.ageRange.max || 'Any'}
                                        </p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm font-bold mb-1">Gender:</p>
                                    <p>{ad.targeted_audience.gender || 'All'}</p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-4">
                                    <p className="text-gray-700 text-sm font-bold mb-1">Interests:</p>
                                    {ad.targeted_audience.interests && ad.targeted_audience.interests.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                            {ad.targeted_audience.interests.map((interest, index) => (
                                                <li key={index}>{interest}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No specific interests targeted</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    {ad.contact && ad.contact.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {ad.contact.map((contact, index) => (
                                <li key={index}>{contact}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No contact information available</p>
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Ad Images</h2>
                    {ad.imagelinks && ad.imagelinks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ad.imagelinks.map((imagelink, index) => (
                                <div key={index} className="border rounded overflow-hidden">
                                    <img
                                        src={imagelink}
                                        alt={`Ad image ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                        }}
                                    />
                                    <div className="p-2 bg-gray-100">
                                        <a
                                            href={imagelink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 text-sm truncate block"
                                        >
                                            {imagelink}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No images available</p>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">Confirm Delete</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this ad? This action cannot be undone.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-28 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-28 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdDetail;