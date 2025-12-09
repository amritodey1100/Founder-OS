import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDI2d3LbeePS9TiF45eSrl579P1KYxIiUc",
  authDomain: "founder-os-7904c.firebaseapp.com",
  projectId: "founder-os-7904c",
  storageBucket: "founder-os-7904c.firebasestorage.app",
  messagingSenderId: "252429646884",
  appId: "1:252429646884:web:d0ac155cb1b31d5740acb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
