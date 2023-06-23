import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const env = dotenv.config().parsed;

const firebaseConfig = {
  apiKey: env?.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env?.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
