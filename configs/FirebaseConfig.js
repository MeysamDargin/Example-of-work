import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBNDrKsFYbK79eNCAvo00xohUamB_8tGtw",
  authDomain: "pabino-aedd0.firebaseapp.com",
  projectId: "pabino-aedd0",
  storageBucket: "pabino-aedd0.appspot.com",
  messagingSenderId: "846229314756",
  appId: "1:846229314756:web:363dd1cb97fbf319adbd91",
  measurementId: "G-MR21D9FXD1"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
