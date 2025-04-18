// src/components/users/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../api/apiService';
import UserHistory from './UserHistory';
import UserActivity from './UserActivity';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { ConfirmationModal } from '../common/Modal';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'history', 'activity'

    const [deleteModal, setDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await userService.getUserProfile(userId);

            if (response && response.user) {
                setUser(response.user);
            } else {
                setError('Failed to load user profile data');
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to load user profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteUser = async () => {
        try {
            setIsDeleting(true);
            await userService.deleteUser(userId);

            // Redirect back to user list after successful deletion
            navigate('/users');
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user. Please try again later.');
            setDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
                <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => navigate('/users')}
                >
                    Back to Users
                </Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                User not found
                <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => navigate('/users')}
                >
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Navigation */}
            <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/users')}
                        className="mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                </div>

                <div className="flex mt-4 md:mt-0 space-x-3">
                    <Button
                        variant={activeTab === 'profile' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </Button>
                    <Button
                        variant={activeTab === 'history' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </Button>
                    <Button
                        variant={activeTab === 'activity' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('activity')}
                    >
                        Activity Log
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setDeleteModal(true)}
                    >
                        Delete User
                    </Button>
                </div>
            </div>

            {/* Content based on active tab */}
            <div className="p-6">
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* User Info */}
                        <div className="bg-gray-50 p-6 rounded-lg border">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                                <div className="mb-4 md:mb-0 h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-4xl">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold text-gray-900">{user.name || 'Unknown User'}</h3>

                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">{user.email || 'No email'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-700">{user.phone || 'No phone'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {user.loginType || 'Unknown login type'}
                                                </span>
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                Joined: {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">Phone Verified:</span>
                                            {user.isPhoneVerified ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Yes</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">No</span>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">Last Activity:</span>
                                            <span className="text-sm text-gray-700">
                                                {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <h4 className="text-green-700 text-lg font-medium mb-2">Viewed Properties</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-3xl font-bold text-green-800">
                                        {user.history?.viewedProperties?.length || 0}
                                    </span>
                                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <h4 className="text-red-700 text-lg font-medium mb-2">Liked Properties</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-3xl font-bold text-red-800">
                                        {user.history?.likedProperties?.length || 0}
                                    </span>
                                    <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="text-blue-700 text-lg font-medium mb-2">Activity Log</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-3xl font-bold text-blue-800">
                                        {user.activityLog?.length || 0}
                                    </span>
                                    <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Notification Preferences */}
                        {user.profile?.notifications && (
                            <div className="bg-gray-50 p-6 rounded-lg border">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                        <span className="text-gray-700">Email Notifications</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.profile.notifications.email
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.profile.notifications.email ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                        <span className="text-gray-700">Push Notifications</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.profile.notifications.push
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.profile.notifications.push ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                        <span className="text-gray-700">Price Alerts</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.profile.notifications.priceAlerts
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.profile.notifications.priceAlerts ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                        <span className="text-gray-700">Saved Search Alerts</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.profile.notifications.savedSearchAlerts
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.profile.notifications.savedSearchAlerts ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                        <span className="text-gray-700">SMS Notifications</span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.profile.notifications.smsNotifications
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.profile.notifications.smsNotifications ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <UserHistory history={user.history} />
                )}

                {activeTab === 'activity' && (
                    <UserActivity activityLog={user.activityLog} />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete ${user.name || 'this user'}? This action cannot be undone.`}
                confirmText={isDeleting ? 'Deleting...' : 'Delete User'}
                confirmVariant="danger"
            />
        </div>
    );
};

export default UserProfile;