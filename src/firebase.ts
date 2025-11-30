//firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkLrbrBwKaU3gSnTLXnBX9neIptKVTU8Y",
  authDomain: "star-carwash.firebaseapp.com",
  projectId: "star-carwash",
  storageBucket: "star-carwash.firebasestorage.app",
  messagingSenderId: "1005290828419",
  appId: "1:1005290828419:web:06621ff3f0b1de663da1b6",
  measurementId: "G-WE385GY7V9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  auth,
  db,
  storage,
  analytics,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
};
