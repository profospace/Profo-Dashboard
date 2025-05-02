import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

/**
 * NotificationToast component to display received notifications
 * @param {Object} notification - The notification object to display
 * @param {Function} onClose - Function to call when closing the notification
 */
const NotificationToast = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setIsVisible(true), 50);

        // Auto dismiss after 8 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Match the transition duration
    };

    if (!notification) return null;

    return (
        <div
            className={`fixed top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className="flex items-start p-4">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                    <Bell className="h-6 w-6 text-blue-500" />
                </div>

                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{notification.body}</p>
                    <p className="mt-1 text-xs text-gray-400">{notification.timestamp}</p>
                </div>

                <button
                    className="flex-shrink-0 ml-2 bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleClose}
                >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Action buttons if needed */}
            {notification.data && notification.data.clickAction && (
                <div className="border-t border-gray-200 px-4 py-3">
                    <button
                        onClick={() => window.open(notification.data.clickAction, '_blank')}
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                        View Details
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationToast;