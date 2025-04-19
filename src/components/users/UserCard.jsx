// src/components/users/UserCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const UserCard = ({ user, onDeleteUser }) => {
    const navigate = useNavigate();

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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{user.name || 'Unknown User'}</h3>
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
                            variant="primary"
                            size="sm"
                            onClick={handleViewProfile}
                        >
                            View Profile
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDeleteUser(user.id, user.name || 'this user')}
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