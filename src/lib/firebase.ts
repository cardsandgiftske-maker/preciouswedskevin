import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: "AIzaSyDkq1beDfcCTzsVWG-fgfKqXot8JHlOsdQ",
  authDomain: "precious-weds-kelvin.firebaseapp.com",
  projectId: "precious-weds-kelvin",
  storageBucket: "precious-weds-kelvin.firebasestorage.app",
  messagingSenderId: "261627656181",
  appId: "1:261627656181:web:35dc676487cd73ce3912bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Since the database may be a named database, we initialize with databaseId
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export { db };
