// import { getToken } from 'firebase/messaging';
// import { messaging } from '../services/firebaseInitialize';
// export const getDeviceToken = async () => {
//     try {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//             const token = await getToken(messaging, {
//                 vapidKey: 'BLFYcCT607QtO_MHrwSr8KKe17ibhyEPZgf6zwa4U9_nS8hkHCflSv-GFS2eUD83uDRX7eioIl4hx3uXJv7hvzM',
//             });
//             console.log('FCM Device Token:', token);
//             return token;
//         } else {
//             console.warn('Notification permission not granted.');
//         }
//     } catch (error) {
//         console.error('Error getting device token:', error);
//     }
// };

// notification.js
// import { getToken } from 'firebase/messaging';
// import { messaging } from '../services/firebaseInitialize'; // adjust path if needed

// export const getDeviceToken = async () => {
//     try {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//             const token = await getToken(messaging, {
//                 vapidKey: 'BLFYcCT607QtO_MHrwSr8KKe17ibhyEPZgf6zwa4U9_nS8hkHCflSv-GFS2eUD83uDRX7eioIl4hx3uXJv7hvzM',
//             });
//             console.log('FCM Device Token:', token);
//             return token;
//         } else {
//             console.warn('Notification permission not granted.');
//         }
//     } catch (error) {
//         console.error('Error getting device token:', error);
//     }
// };


// notification.js
import { getToken } from 'firebase/messaging';
import { messaging } from './firebaseInitialize';

export const getDeviceToken = async () => {
    try {
        // First check if the browser supports service workers
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers are not supported in this browser');
            return null;
        }

        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.error('This browser does not support notifications');
            return null;
        }

        // Check the current permission status first
        const currentPermission = Notification.permission;
        console.log('Current notification permission status:', currentPermission);

        // Only request permission if it's not already granted or denied
        let permission = currentPermission;
        if (permission !== 'granted' && permission !== 'denied') {
            console.log('Requesting notification permission...');
            permission = await Notification.requestPermission();
            console.log('Permission request result:', permission);
        }

        if (permission === 'granted') {
            // Verify service worker registration
            try {
                const swRegistration = await navigator.serviceWorker.ready;
                console.log('Service Worker is ready:', swRegistration);
            } catch (swError) {
                console.error('Service Worker not ready:', swError);
            }

            // Attempt to get token with more detailed error handling
            console.log('Attempting to get FCM token...');
            const token = await getToken(messaging, {
                vapidKey: 'BLFYcCT607QtO_MHrwSr8KKe17ibhyEPZgf6zwa4U9_nS8hkHCflSv-GFS2eUD83uDRX7eioIl4hx3uXJv7hvzM',
            });

            console.log('FCM Device Token obtained successfully:', token);
            return token;
        } else {
            console.warn(`Notification permission ${permission !== 'default' ? 'denied' : 'not granted'}.`);
            return null;
        }
    } catch (error) {
        console.error('Error getting device token:', error);

        // More specific error handling
        if (error.code === 'messaging/permission-blocked') {
            console.error('Notifications are blocked. Please enable them in your browser settings.');
        } else if (error.code === 'messaging/unsupported-browser') {
            console.error('This browser doesn\'t support Firebase Cloud Messaging.');
        } else if (error.message && error.message.includes('push service')) {
            console.error('Push service error. Check if your firebase-messaging-sw.js is properly configured and accessible.');
        }

        return null;
    }
};



// export const getDeviceToken = async () => {
//     try {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//             const token = await getToken(messaging, {
//                 vapidKey: 'BLFYcCT607QtO_MHrwSr8KKe17ibhyEPZgf6zwa4U9_nS8hkHCflSv-GFS2eUD83uDRX7eioIl4hx3uXJv7hvzM',
//             });
//             console.log('FCM Device Token:', token);
//             return token;
//         } else {
//             console.warn('Notification permission not granted.');
//         }
//     } catch (error) {
//         console.error('Error getting device token:', error);
//     }
// };
