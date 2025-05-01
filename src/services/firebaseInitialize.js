import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyCkrk6Ytxnb4ynSxEYYZBX_UjUQm4DHjc8',
    authDomain: 'propertify-3f513.firebaseapp.com',
    projectId: 'propertify-3f513',
    storageBucket: 'propertify-3f513.appspot.com',
    messagingSenderId: '73124242596',
    appId: '1:73124242596:android:b12e8e412e4357346df231'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);