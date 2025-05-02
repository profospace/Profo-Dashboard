import axios from 'axios';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebaseInitialize';
import { base_url } from '../../utils/base_url';
import { getAuthConfig } from '../../utils/authConfig';

/**
 * Request permission and get FCM device token
 * @returns {Promise<string|null>} Device token or null if unsuccessful
 */
export const getDeviceToken = async () => {
    try {
        // Check if browser supports service workers
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers are not supported in this browser');
            return null;
        }

        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.error('This browser does not support notifications');
            return null;
        }

        // Check current permission status
        let permission = Notification.permission;
        console.log('Current notification permission status:', permission);

        // Only request permission if not already granted or denied
        if (permission !== 'granted' && permission !== 'denied') {
            console.log('Requesting notification permission...');
            permission = await Notification.requestPermission();
            console.log('Permission request result:', permission);
        }

        if (permission !== 'granted') {
            console.warn(`Notification permission ${permission !== 'default' ? 'denied' : 'not granted'}.`);
            return null;
        }

        // Verify service worker registration
        try {
            const swRegistration = await navigator.serviceWorker.ready;
            console.log('Service Worker is ready:', swRegistration);
        } catch (swError) {
            console.error('Service Worker not ready:', swError);
            return null;
        }

        // Get FCM token
        console.log('Attempting to get FCM token...');
        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        console.log('FCM Device Token obtained successfully:', token);
        return token;
    } catch (error) {
        handleTokenError(error);
        return null;
    }
};

/**
 * Handle specific FCM token errors
 * @param {Error} error - The error object
 */
const handleTokenError = (error) => {
    console.error('Error getting device token:', error);

    if (error.code === 'messaging/permission-blocked') {
        console.error('Notifications are blocked. Please enable them in your browser settings.');
    } else if (error.code === 'messaging/unsupported-browser') {
        console.error('This browser doesn\'t support Firebase Cloud Messaging.');
    } else if (error.message && error.message.includes('push service')) {
        console.error('Push service error. Check if your firebase-messaging-sw.js is properly configured and accessible.');
    }
};

/**
 * Register device token with backend
 * @param {string} token - The FCM device token
 * @returns {Promise<boolean>} - Success status
 */
export const registerTokenWithBackend = async (token) => {
    try {
        if (!token) {
            console.error('Cannot register null token');
            return false;
        }

        const authConfig = getAuthConfig();
        if (!authConfig.headers.Authorization) {
            console.warn('User not authenticated, cannot register token');
            return false;
        }

        const response = await axios.post(
            `${base_url}/api/notifications/register-token`,
            {
                deviceToken: token,
                deviceType: 'web'
            },
            authConfig
        );

        console.log('Token registration response:', response.data);
        return response.data.success;
    } catch (error) {
        console.error('Failed to register token with backend:', error);
        return false;
    }
};

/**
 * Set up foreground message listener
 * @param {Function} onNotificationReceived - Callback when notification is received
 * @returns {Function} Unsubscribe function
 */
export const setupNotificationListener = (onNotificationReceived) => {
    try {
        return onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);

            const notification = {
                title: payload.notification?.title || 'New notification',
                body: payload.notification?.body || '',
                data: payload.data || {},
                timestamp: new Date().toLocaleTimeString()
            };

            onNotificationReceived(notification);

            // Show a browser notification as well for better visibility
            if ('Notification' in window && Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(notification.title, {
                        body: notification.body,
                        icon: '/logo192.png',
                        data: notification.data
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error setting up message listener:', error);
        return () => { }; // Return empty function
    }
};