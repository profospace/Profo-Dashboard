import React, { useState, useEffect } from 'react';
import { Bell, Settings, Check, Trash } from 'lucide-react';
import axios from 'axios';
import { base_url } from '../../utils/base_url';
import { getAuthConfig } from '../../utils/authConfig';

/**
 * NotificationCenter component to display list of notifications
 */
const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        // Update unread count
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${base_url}/api/notifications`,
                getAuthConfig()
            );

            if (response.data.success) {
                setNotifications(response.data.notifications || []);
            } else {
                setError('Failed to load notifications');
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await axios.put(
                `${base_url}/api/notifications/${notificationId}/read`,
                {},
                getAuthConfig()
            );

            if (response.data.success) {
                // Update notification in state
                setNotifications(prevNotifications =>
                    prevNotifications.map(n =>
                        n._id === notificationId ? { ...n, read: true } : n
                    )
                );
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await axios.put(
                `${base_url}/api/notifications/read-all`,
                {},
                getAuthConfig()
            );

            if (response.data.success) {
                // Update all notifications in state
                setNotifications(prevNotifications =>
                    prevNotifications.map(n => ({ ...n, read: true }))
                );
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await axios.delete(
                `${base_url}/api/notifications/${notificationId}`,
                getAuthConfig()
            );

            if (response.data.success) {
                // Remove notification from state
                setNotifications(prevNotifications =>
                    prevNotifications.filter(n => n._id !== notificationId)
                );
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const clearAllNotifications = async () => {
        try {
            const response = await axios.delete(
                `${base_url}/api/notifications`,
                getAuthConfig()
            );

            if (response.data.success) {
                setNotifications([]);
            }
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-6 w-6" />

                {/* Unread Counter */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                        <div className="flex space-x-2">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={markAllAsRead}
                                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        title="Mark all as read"
                                    >
                                        <Check className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={clearAllNotifications}
                                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        title="Clear all notifications"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                            <button
                                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                title="Notification settings"
                            >
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center">
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No notifications yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification._id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${notification.read ? '' : 'bg-blue-50'}`}
                                    >
                                        <div className="flex justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${notification.read ? 'text-gray-800' : 'text-blue-800'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.body}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.sentAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0 flex">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        className="mr-2 text-blue-500 hover:text-blue-700"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Delete"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;