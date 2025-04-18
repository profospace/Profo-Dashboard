// src/components/users/UserActivity.jsx
import React, { useState } from 'react';
import Modal from '../common/Modal';

const UserActivity = ({ activityLog = [] }) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all', // all, property, project, building, other
        timeframe: 'all', // all, today, week, month
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    // Format relative time
    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return `${diffSec} seconds ago`;
        } else if (diffMin < 60) {
            return `${diffMin} minutes ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hours ago`;
        } else if (diffDay < 30) {
            return `${diffDay} days ago`;
        } else {
            return formatDate(dateString);
        }
    };

    // Get activity type icon and color
    const getActivityMeta = (action) => {
        if (!action) return { icon: null, color: 'gray' };

        // Set up default look
        let icon = null;
        let color = 'gray';

        switch (action) {
            case 'SIGNUP':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                );
                color = 'green';
                break;
            case 'LOGIN':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                );
                color = 'blue';
                break;
            case 'VIEW_PROPERTY':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                );
                color = 'indigo';
                break;
            case 'VIEW_PROJECT':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
                color = 'purple';
                break;
            case 'VIEW_BUILDING':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                );
                color = 'yellow';
                break;
            case 'LIKE_PROPERTY':
            case 'SAVE_PROPERTY':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
                color = 'red';
                break;
            case 'PHONE_VERIFICATION':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
                color = 'green';
                break;
            case 'SEARCH':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                );
                color = 'blue';
                break;
            case 'CONTACT_PROPERTY':
            case 'CONTACT_OWNER':
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
                color = 'orange';
                break;
            default:
                icon = (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
                color = 'gray';
        }

        return { icon, color };
    };

    // Get activity title
    const getActivityTitle = (activity) => {
        if (!activity || !activity.action) return 'Unknown Activity';

        switch (activity.action) {
            case 'SIGNUP':
                return `User signed up via ${activity.details?.method || 'unknown method'}`;
            case 'LOGIN':
                return `User logged in via ${activity.details?.method || 'unknown method'}`;
            case 'PHONE_VERIFICATION':
                return `Phone verified via ${activity.details?.method || 'unknown method'}`;
            case 'VIEW_PROPERTY':
                return `Viewed property`;
            case 'VIEW_PROJECT':
                return `Viewed project`;
            case 'VIEW_BUILDING':
                return `Viewed building`;
            case 'LIKE_PROPERTY':
            case 'SAVE_PROPERTY':
                return `Saved property`;
            case 'SEARCH':
                return `Performed search query`;
            case 'CONTACT_PROPERTY':
            case 'CONTACT_OWNER':
                return `Contacted property owner`;
            default:
                return activity.action.replace(/_/g, ' ').toLowerCase();
        }
    };

    // Get activity subtitle
    const getActivitySubtitle = (activity) => {
        if (!activity) return null;

        if (activity.action === 'VIEW_PROPERTY' && activity.details?.property) {
            return activity.details.property.post_title || 'Unnamed Property';
        } else if (activity.action === 'VIEW_PROJECT' && activity.details?.project) {
            return activity.details.project.name || 'Unnamed Project';
        } else if (activity.action === 'VIEW_BUILDING' && activity.details?.building) {
            return activity.details.building.name || 'Unnamed Building';
        } else if (activity.action === 'SIGNUP' || activity.action === 'LOGIN') {
            return activity.details?.email || activity.details?.phoneNumber || 'No contact info';
        } else if (activity.action === 'PHONE_VERIFICATION') {
            return activity.details?.phoneNumber || 'Unknown number';
        }

        return null;
    };

    // Filter activities
    const filterActivities = () => {
        let filtered = [...activityLog];

        // Filter by type
        if (filters.type !== 'all') {
            switch (filters.type) {
                case 'property':
                    filtered = filtered.filter(activity => activity.action === 'VIEW_PROPERTY' || activity.action === 'LIKE_PROPERTY' || activity.action === 'SAVE_PROPERTY');
                    break;
                case 'project':
                    filtered = filtered.filter(activity => activity.action === 'VIEW_PROJECT');
                    break;
                case 'building':
                    filtered = filtered.filter(activity => activity.action === 'VIEW_BUILDING');
                    break;
                case 'other':
                    filtered = filtered.filter(activity =>
                        activity.action !== 'VIEW_PROPERTY' &&
                        activity.action !== 'LIKE_PROPERTY' &&
                        activity.action !== 'SAVE_PROPERTY' &&
                        activity.action !== 'VIEW_PROJECT' &&
                        activity.action !== 'VIEW_BUILDING'
                    );
                    break;
            }
        }

        // Filter by timeframe
        if (filters.timeframe !== 'all') {
            const now = new Date();
            let cutoffDate;

            switch (filters.timeframe) {
                case 'today':
                    cutoffDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case 'week':
                    cutoffDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case 'month':
                    cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
                    break;
            }

            filtered = filtered.filter(activity => {
                const activityDate = new Date(activity.timestamp);
                return activityDate >= cutoffDate;
            });
        }

        return filtered;
    };

    const filteredActivities = filterActivities();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Log</h2>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div>
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">Activity Type</label>
                        <select
                            id="type-filter"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="all">All Activities</option>
                            <option value="property">Property Related</option>
                            <option value="project">Project Related</option>
                            <option value="building">Building Related</option>
                            <option value="other">Other Activities</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="timeframe-filter" className="block text-sm font-medium text-gray-700">Timeframe</label>
                        <select
                            id="timeframe-filter"
                            value={filters.timeframe}
                            onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            {filteredActivities.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border text-center">
                    <p className="text-gray-500">No activities found for the selected filters</p>
                </div>
            ) : (
                <div className="flow-root">
                    <ul className="-mb-8">
                        {filteredActivities.map((activity, idx) => {
                            const { icon, color } = getActivityMeta(activity.action);
                            const colorClasses = {
                                blue: 'bg-blue-100 text-blue-600',
                                green: 'bg-green-100 text-green-600',
                                red: 'bg-red-100 text-red-600',
                                yellow: 'bg-yellow-100 text-yellow-600',
                                purple: 'bg-purple-100 text-purple-600',
                                indigo: 'bg-indigo-100 text-indigo-600',
                                orange: 'bg-orange-100 text-orange-600',
                                gray: 'bg-gray-100 text-gray-600',
                            };

                            return (
                                <li key={activity._id}>
                                    <div className="relative pb-8">
                                        {idx !== filteredActivities.length - 1 ? (
                                            <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        ) : null}

                                        <div className="relative flex items-start space-x-3">
                                            {/* Activity Icon */}
                                            <div>
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
                                                    {icon}
                                                </div>
                                            </div>

                                            {/* Activity Content */}
                                            <div className="min-w-0 flex-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => {
                                                setSelectedActivity(activity);
                                                setModalOpen(true);
                                            }}>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getActivityTitle(activity)}
                                                    </div>

                                                    {getActivitySubtitle(activity) && (
                                                        <p className="mt-0.5 text-sm text-gray-500">
                                                            {getActivitySubtitle(activity)}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-2 text-sm text-gray-500">
                                                    <p>
                                                        {formatRelativeTime(activity.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Activity Detail Modal */}
            {selectedActivity && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Activity Details"
                    size="lg"
                >
                    <div className="space-y-4">
                        {/* Activity Type and Time */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClasses[getActivityMeta(selectedActivity.action).color]
                                    } mr-3`}>
                                    {getActivityMeta(selectedActivity.action).icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {getActivityTitle(selectedActivity)}
                                    </h3>
                                    {getActivitySubtitle(selectedActivity) && (
                                        <p className="text-sm text-gray-500">
                                            {getActivitySubtitle(selectedActivity)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatDate(selectedActivity.timestamp)}
                            </div>
                        </div>

                        {/* Activity Details */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Details</h4>

                            <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                                {/* For VIEW_PROPERTY */}
                                {selectedActivity.action === 'VIEW_PROPERTY' && selectedActivity.details?.property && (
                                    <div className="space-y-4">
                                        {selectedActivity.details.property.post_images && selectedActivity.details.property.post_images.length > 0 && (
                                            <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={selectedActivity.details.property.post_images[0].url}
                                                    alt={selectedActivity.details.property.post_title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-lg font-medium">{selectedActivity.details.property.post_title || 'Unnamed Property'}</h3>
                                            <p className="text-gray-600 mt-1">{selectedActivity.details.property.address || 'No address'}</p>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                                {selectedActivity.details.property.price && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Price</span>
                                                        <span className="font-medium">₹{selectedActivity.details.property.price} Lakhs</span>
                                                    </div>
                                                )}

                                                {selectedActivity.details.property.area && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Area</span>
                                                        <span className="font-medium">{selectedActivity.details.property.area} sq.ft</span>
                                                    </div>
                                                )}

                                                {selectedActivity.details.property.bedrooms && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Bedrooms</span>
                                                        <span className="font-medium">{selectedActivity.details.property.bedrooms}</span>
                                                    </div>
                                                )}

                                                {selectedActivity.details.property.bathrooms && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Bathrooms</span>
                                                        <span className="font-medium">{selectedActivity.details.property.bathrooms}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* For VIEW_PROJECT */}
                                {selectedActivity.action === 'VIEW_PROJECT' && selectedActivity.details?.project && (
                                    <div className="space-y-4">
                                        {selectedActivity.details.project.galleryNow && selectedActivity.details.project.galleryNow.length > 0 && (
                                            <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={selectedActivity.details.project.galleryNow[0]}
                                                    alt={selectedActivity.details.project.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-lg font-medium">{selectedActivity.details.project.name || 'Unnamed Project'}</h3>
                                            {selectedActivity.details.project.location && (
                                                <p className="text-gray-600 mt-1">
                                                    {selectedActivity.details.project.location.address ||
                                                        (selectedActivity.details.project.location.city &&
                                                            `${selectedActivity.details.project.location.city}, ${selectedActivity.details.project.location.state}`) ||
                                                        'No address'}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                                {selectedActivity.details.project.type && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Type</span>
                                                        <span className="font-medium">{selectedActivity.details.project.type}</span>
                                                    </div>
                                                )}

                                                {selectedActivity.details.project.status && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Status</span>
                                                        <span className="font-medium">{selectedActivity.details.project.status}</span>
                                                    </div>
                                                )}

                                                {selectedActivity.details.project.overview?.totalUnits && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Total Units</span>
                                                        <span className="font-medium">{selectedActivity.details.project.overview.totalUnits}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedActivity.details.project.overview?.priceRange && (
                                                <div className="p-2 bg-white rounded border mt-3">
                                                    <span className="text-xs text-gray-500 block">Price Range</span>
                                                    <span className="font-medium">
                                                        ₹{selectedActivity.details.project.overview.priceRange.min / 1000000} -
                                                        ₹{selectedActivity.details.project.overview.priceRange.max / 1000000} Lakhs
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* For VIEW_BUILDING */}
                                {selectedActivity.action === 'VIEW_BUILDING' && selectedActivity.details?.building && (
                                    <div className="space-y-4">
                                        {selectedActivity.details.building.galleryList && selectedActivity.details.building.galleryList.length > 0 && (
                                            <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={selectedActivity.details.building.galleryList[0]}
                                                    alt={selectedActivity.details.building.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-lg font-medium">{selectedActivity.details.building.name || 'Unnamed Building'}</h3>
                                            <p className="text-gray-600 mt-1">{
                                                (selectedActivity.details.building.location && typeof selectedActivity.details.building.location === 'object')
                                                    ? 'Location available'
                                                    : 'No location details'
                                            }</p>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                                {selectedActivity.details.building.type && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Type</span>
                                                        <span className="font-medium capitalize">{selectedActivity.details.building.type}</span>
                                                    </div>
                                                )}

                                                {selectedActivity.details.building.totalProperties && (
                                                    <div className="p-2 bg-white rounded border">
                                                        <span className="text-xs text-gray-500 block">Total Properties</span>
                                                        <span className="font-medium">{selectedActivity.details.building.totalProperties}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* For SIGNUP, LOGIN, etc. */}
                                {(selectedActivity.action === 'SIGNUP' || selectedActivity.action === 'LOGIN' || selectedActivity.action === 'PHONE_VERIFICATION') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedActivity.details?.method && (
                                            <div className="p-3 bg-white rounded border">
                                                <span className="text-xs text-gray-500 block">Method</span>
                                                <span className="font-medium">{selectedActivity.details.method}</span>
                                            </div>
                                        )}

                                        {selectedActivity.details?.email && (
                                            <div className="p-3 bg-white rounded border">
                                                <span className="text-xs text-gray-500 block">Email</span>
                                                <span className="font-medium">{selectedActivity.details.email}</span>
                                            </div>
                                        )}

                                        {selectedActivity.details?.phoneNumber && (
                                            <div className="p-3 bg-white rounded border">
                                                <span className="text-xs text-gray-500 block">Phone</span>
                                                <span className="font-medium">{selectedActivity.details.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* For other activity types, show raw details */}
                                {(selectedActivity.action !== 'VIEW_PROPERTY' &&
                                    selectedActivity.action !== 'VIEW_PROJECT' &&
                                    selectedActivity.action !== 'VIEW_BUILDING' &&
                                    selectedActivity.action !== 'SIGNUP' &&
                                    selectedActivity.action !== 'LOGIN' &&
                                    selectedActivity.action !== 'PHONE_VERIFICATION') && (
                                        <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                                            {JSON.stringify(selectedActivity.details, null, 2)}
                                        </pre>
                                    )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// Need to define colorClasses outside to avoid re-creation on each render
const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
};

export default UserActivity;