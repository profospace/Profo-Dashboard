// // src/components/users/UserCard.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../common/Button';

// const UserCard = ({ user, onDeleteUser }) => {
//     const navigate = useNavigate();

//     const handleViewProfile = () => {
//         navigate(`/users/${user._id}`);
//     };

//     // Format date
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//         });
//     };

//     // Get verification status color
//     const getVerificationBadge = (status) => {
//         if (status === undefined) return null;

//         return status ? (
//             <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
//                 Verified
//             </span>
//         ) : (
//             <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
//                 Not Verified
//             </span>
//         );
//     };

//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//             <div className="p-5">
//                 <div className="flex items-start justify-between">
//                     <div className="flex items-center space-x-4">
//                         <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
//                             {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
//                         </div>
//                         <div>
//                             <h3 className="text-lg font-medium text-gray-900">{user.name || 'Unknown User'}</h3>
//                             <div className="flex flex-wrap gap-2 mt-1">
//                                 {user.email && (
//                                     <span className="flex items-center text-sm text-gray-600">
//                                         <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                         </svg>
//                                         {user.email}
//                                     </span>
//                                 )}
//                                 {user.phone && (
//                                     <span className="flex items-center text-sm text-gray-600">
//                                         <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                         </svg>
//                                         {user.phone}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex flex-col items-end space-y-2">
//                         <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
//                             {user.loginType || 'Unknown'}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                             Joined {formatDate(user.createdAt)}
//                         </span>
//                     </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap items-center gap-2">
//                     <div className="flex items-center space-x-1">
//                         <span className="text-xs text-gray-500">Email:</span>
//                         {getVerificationBadge(user.verificationStatus?.email)}
//                     </div>
//                     <div className="flex items-center space-x-1">
//                         <span className="text-xs text-gray-500">Phone:</span>
//                         {getVerificationBadge(user.verificationStatus?.phone)}
//                     </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
//                     <div className="flex flex-wrap gap-2">
//                         <div className="flex items-center space-x-1">
//                             <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                             </svg>
//                             <span className="text-sm text-gray-600">
//                                 {user.history?.viewedProperties?.length || 0} Viewed
//                             </span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                             <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                             </svg>
//                             <span className="text-sm text-gray-600">
//                                 {user.history?.likedProperties?.length || 0} Liked
//                             </span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                             <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <span className="text-sm text-gray-600">
//                                 {user.activityLog?.length || 0} Activities
//                             </span>
//                         </div>
//                     </div>

//                     <div className="flex gap-2">
//                         <Button
//                             variant="primary"
//                             size="sm"
//                             onClick={handleViewProfile}
//                         >
//                             View Profile
//                         </Button>
//                         <Button
//                             variant="danger"
//                             size="sm"
//                             onClick={() => onDeleteUser(user._id, user.name || 'this user')}
//                         >
//                             Delete
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserCard;


// src/components/users/UserCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming you're using react-toastify
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const UserCard = ({ user, onDeleteUser, isTracked = false, onTrackingChange }) => {
    const navigate = useNavigate();
    const [isTrackingLoading, setIsTrackingLoading] = useState(false);
    const [trackingStatus, setTrackingStatus] = useState(isTracked);

    const handleViewProfile = () => {
        navigate(`/users/${user._id}`);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get verification status color
    const getVerificationBadge = (status) => {
        if (status === undefined) return null;

        return status ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Verified
            </span>
        ) : (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                Not Verified
            </span>
        );
    };

    // Handle user tracking toggle
    const handleTrackingToggle = async () => {
        setIsTrackingLoading(true);

        try {
            let response;
            let successMessage;

            if (trackingStatus) {
                // Remove user from tracking
                response = await axios.delete(
                    `${base_url}/api/admin/remove-user/tracking/${user._id}`,
                    getAuthConfig()
                );
                successMessage = `${user.name || 'User'} has been removed from tracking`;
            } else {
                // Add user to tracking
                response = await axios.put(
                    `${base_url}/api/admin/add-user/tracking/${user._id}`,
                    {},
                    getAuthConfig()
                );
                successMessage = `${user.name || 'User'} has been added to tracking`;
            }

            if (response.data.success) {
                setTrackingStatus(!trackingStatus);
                toast.success(successMessage, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Notify parent component of tracking change
                if (onTrackingChange) {
                    onTrackingChange(user._id, !trackingStatus);
                }
            } else {
                throw new Error(response.data.message || 'Failed to update tracking status');
            }
        } catch (error) {
            console.error('Error updating tracking status:', error);

            let errorMessage = 'Failed to update tracking status';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsTrackingLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-gray-900">{user.name || 'Unknown User'}</h3>
                                {trackingStatus && (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Tracking
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {user.email && (
                                    <span className="flex items-center text-sm text-gray-600">
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user.email}
                                    </span>
                                )}
                                {user.phone && (
                                    <span className="flex items-center text-sm text-gray-600">
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {user.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {user.loginType || 'Unknown'}
                        </span>
                        <span className="text-sm text-gray-500">
                            Joined {formatDate(user.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Email:</span>
                        {getVerificationBadge(user.verificationStatus?.email)}
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Phone:</span>
                        {getVerificationBadge(user.verificationStatus?.phone)}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center space-x-1">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-sm text-gray-600">
                                {user.history?.viewedProperties?.length || 0} Viewed
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">
                                {user.history?.likedProperties?.length || 0} Liked
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">
                                {user.activityLog?.length || 0} Activities
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={trackingStatus ? "warning" : "success"}
                            size="sm"
                            onClick={handleTrackingToggle}
                            disabled={isTrackingLoading}
                        >
                            {isTrackingLoading ? (
                                <div className="flex items-center space-x-1">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1">
                                    {trackingStatus ? (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                            <span>Stop Track</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>Start Track</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleViewProfile}
                        >
                            View Profile
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDeleteUser(user._id, user.name || 'this user')}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;