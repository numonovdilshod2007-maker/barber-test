// Firebase Configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAKZoHiD4RuW0xKYvG2BrJewerpnOqNsEo",
    authDomain: "barbershop-uz-95586.firebaseapp.com",
    projectId: "barbershop-uz-95586",
    storageBucket: "barbershop-uz-95586.firebasestorage.app",
    messagingSenderId: "190775352249",
    appId: "1:190775352249:web:a05c71848304b143468",
    measurementId: "G-GW7ZB1P2BZ"
};

// Diagnostic logs to help debug Google sign-in / API key issues
console.log('Loaded FIREBASE_CONFIG.apiKey =', FIREBASE_CONFIG.apiKey);
console.log('firebase-config-v3.js loaded');
if (typeof google === 'undefined') {
    console.warn('Notice: `google` (Google Identity) is not present on the page. Using Firebase Auth popup/redirect instead.');
} else {
    console.log('Google Identity script detected.');
}
let auth = null;
let db = null;

function initializeFirebase() {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }

        auth = firebase.auth();
        db = firebase.firestore();
        window.auth = auth;
        window.db = db;

        console.log('✓ Firebase initialized');
    } catch (error) {
        console.error('Firebase init xatosi:', error);
    }
}

function getFirestoreData(doc) {
    return { id: doc.id, ...doc.data() };
}

window.initializeFirebase = initializeFirebase;
window.getFirestoreData = getFirestoreData;
