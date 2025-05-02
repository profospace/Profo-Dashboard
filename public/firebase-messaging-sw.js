// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Listen for the 'install' event to ensure SW is properly installed
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting(); // Force activation on install
});

// Listen for the 'activate' event to ensure SW is active
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
    event.waitUntil(self.clients.claim()); // Take control immediately
});

// Add push event listener for debugging purposes
self.addEventListener('push', function (event) {
    console.log('Push event received:', event);
    if (event.data) {
        console.log('Push data:', event.data.json());
    }
});

// Initialize Firebase
firebase.initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
});

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    // Extract notification data
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationBody = payload.notification?.body || '';
    const notificationImage = payload.notification?.image || '/logo192.png';
    const notificationData = payload.data || {};

    // Show notification
    const options = {
        body: notificationBody,
        icon: notificationImage,
        badge: '/badge-icon.png',
        data: notificationData,
        vibrate: [100, 50, 100],
        requireInteraction: true // Keep notification until user interacts with it
    };

    // Add click action if available
    if (notificationData.clickAction) {
        options.data.clickAction = notificationData.clickAction;
    }

    // Register for notification click events
    self.addEventListener('notificationclick', (event) => {
        console.log('Notification clicked', event);
        event.notification.close();

        // Get the click action URL or default to opening the app
        const clickAction = event.notification.data.clickAction || '/';

        // Focus on existing window or open a new one
        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    // Check if there's already a window/tab open with the target URL
                    for (const client of clientList) {
                        if (client.url.includes(clickAction) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // If no window/tab is open with the target URL, open a new one
                    if (self.clients.openWindow) {
                        return self.clients.openWindow(clickAction);
                    }
                })
        );
    });

    self.registration.showNotification(notificationTitle, options);
});

// Log errors to help with debugging
self.addEventListener('error', function (event) {
    console.error('Service Worker error:', event.message, event.filename, event.lineno);
});