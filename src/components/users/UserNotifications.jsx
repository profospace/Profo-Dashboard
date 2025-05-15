import React,{ useState, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, ChevronRight, Clock, Database, Smartphone, X } from 'lucide-react';

const UserNotifications = ({ notifications = [], notificationTopics = [], notificationTokens = [] }) => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [localNotifications, setLocalNotifications] = useState(notifications);

    useEffect(() => {
        // Count unread notifications
        setUnreadCount(notifications.filter(notification => !notification.read).length);
        setLocalNotifications(notifications);
    }, [notifications]);

    const markAllAsRead = () => {
        setLocalNotifications(prevNotifications =>
            prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    };

    const clearAllNotifications = () => {
        setLocalNotifications([]);
        setUnreadCount(0);
        setShowClearConfirm(false);
    };

    const markAsRead = (id) => {
        setLocalNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification._id === id ? { ...notification, read: true } : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderNotifications = () => {
        if (localNotifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">No notifications</h3>
                    <p className="text-gray-400 mt-1">You're all caught up!</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                {localNotifications.map(notification => (
                    <div
                        key={notification._id}
                        className={`flex items-start p-4 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-white'} border border-gray-100 shadow-sm`}
                        onClick={() => markAsRead(notification._id)}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Bell className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-semibold text-gray-800">{notification.title}</h4>
                                {!notification.read && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        New
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formatDate(notification.sentAt)}</span>
                                {notification.data && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                                        {notification.data.type}
                                    </span>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="flex-shrink-0 ml-2 w-4 h-4 text-gray-400" />
                    </div>
                ))}
            </div>
        );
    };

    const renderTopics = () => {
        if (notificationTopics.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Database className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">No topics</h3>
                    <p className="text-gray-400 mt-1">You haven't subscribed to any topics</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                {notificationTopics.map((topic, index) => (
                    <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                            <Database className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-800">{topic}</h4>
                            <p className="text-xs text-gray-500 mt-1">Active subscription</p>
                        </div>
                        <div className="flex items-center">
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDevices = () => {
        if (notificationTokens.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Smartphone className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">No devices</h3>
                    <p className="text-gray-400 mt-1">No registered devices found</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                {notificationTokens.map((device, index) => (
                    <div key={device._id} className="flex items-start p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-800">
                                {device.deviceType === 'ios' ? 'iOS Device' : device.deviceType === 'android' ? 'Android Device' : 'Unknown Device'}
                                {index + 1}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Last updated: {formatDate(device.updatedAt)}</span>
                            </div>
                            <div className="mt-2">
                                <p className="text-xs font-mono text-gray-500 truncate w-full max-w-xs">
                                    {device.token.substring(0, 20)}...
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Notifications Center</h2>
                    <div className="flex items-center space-x-2">
                        {activeTab === 'notifications' && unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="flex items-center text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded"
                            >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Mark all read
                            </button>
                        )}
                        {activeTab === 'notifications' && localNotifications.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="flex items-center text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Clear all
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showClearConfirm && (
                <div className="p-3 bg-yellow-50 border-b border-yellow-100 flex items-center justify-between">
                    <p className="text-sm text-yellow-700">Clear all notifications?</p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowClearConfirm(false)}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={clearAllNotifications}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`flex-1 py-3 px-4 text-center border-b-2 text-sm font-medium ${activeTab === 'notifications'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-center">
                            <Bell className="w-4 h-4 mr-2" />
                            Notifications
                            {unreadCount > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('topics')}
                        className={`flex-1 py-3 px-4 text-center border-b-2 text-sm font-medium ${activeTab === 'topics'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-center">
                            <Database className="w-4 h-4 mr-2" />
                            Topics
                            {notificationTopics.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {notificationTopics.length}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('devices')}
                        className={`flex-1 py-3 px-4 text-center border-b-2 text-sm font-medium ${activeTab === 'devices'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-center">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Devices
                            {notificationTokens.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                    {notificationTokens.length}
                                </span>
                            )}
                        </div>
                    </button>
                </nav>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
                {activeTab === 'notifications' && renderNotifications()}
                {activeTab === 'topics' && renderTopics()}
                {activeTab === 'devices' && renderDevices()}
            </div>
        </div>
    );
};

export default UserNotifications;