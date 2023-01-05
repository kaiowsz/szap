import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDJc3nv2GnTy5RxdglYoWjsr3rOga_z_sk",
  authDomain: "react-chat-npk777.firebaseapp.com",
  projectId: "react-chat-npk777",
  storageBucket: "react-chat-npk777.appspot.com",
  messagingSenderId: "236335566082",
  appId: "1:236335566082:web:82460f8968f2677cac861b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const storage = getStorage()
export const db = getFirestore()