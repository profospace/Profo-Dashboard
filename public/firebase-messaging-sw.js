// // 3. Register the service worker (create a file called firebase-messaging-sw.js in your public folder)
// // Content of firebase-messaging-sw.js:
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//     apiKey: 'AIzaSyCkrk6Ytxnb4ynSxEYYZBX_UjUQm4DHjc8',
//     authDomain: 'propertify-3f513.firebaseapp.com',
//     projectId: 'propertify-3f513',
//     storageBucket: ' propertify-3f513.appspot.com',
//     messagingSenderId: '73124242596',
//     appId: '1:73124242596:android:b12e8e412e4357346df231'
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Background message received:', payload);

//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/logo192.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

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
});

// Initialize Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyCkrk6Ytxnb4ynSxEYYZBX_UjUQm4DHjc8',
    authDomain: 'propertify-3f513.firebaseapp.com',
    projectId: 'propertify-3f513',
    storageBucket: 'propertify-3f513.appspot.com', // Fixed: removed space
    messagingSenderId: '73124242596',
    appId: '1:73124242596:android:b12e8e412e4357346df231'
});

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification.body || '',
        icon: '/logo192.png',
        badge: '/badge-icon.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});