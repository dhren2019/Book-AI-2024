// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-story-generator-f13ad.firebaseapp.com",
  projectId: "ai-story-generator-f13ad",
  storageBucket: "ai-story-generator-f13ad.appspot.com",
  messagingSenderId: "121235117904",
  appId: "1:121235117904:web:a2d5b093465fea3259fe55",
  measurementId: "G-NL9ZSFGEGB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)