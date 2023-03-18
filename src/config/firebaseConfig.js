// Initializing app
import { initializeApp } from "firebase/app";

// Getting auth feature from firebase
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// creating database
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCE64HBxD7AqJgysoSVHYoNjFqU0X6jnPk",
  authDomain: "fir-basics-cf0cc.firebaseapp.com",
  projectId: "fir-basics-cf0cc",
  storageBucket: "fir-basics-cf0cc.appspot.com",
  messagingSenderId: "491688201335",
  appId: "1:491688201335:web:65182760c022c5d8d9ca72",
  measurementId: "G-Z5FT9TH75H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

// exporting GoogleAuthProvider
export const provider = new GoogleAuthProvider();

// exporting firestore
export const db = getFirestore(app)
