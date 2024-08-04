// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// lib/firebaseConfig.js
import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider  } from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

// Export Firebase services
export { app, auth, firestore,provider };
// Initialize Firebase
// const firestore = getFirestore(app)
// Export firebase instance
// export { app, firebaseConfig }
// export const auth = firebase.auth();
// export const firestore = firebase.firestore();
