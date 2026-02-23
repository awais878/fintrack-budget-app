import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh_YZagO6vu8rXB3TGd1J7fYjLQPBHJbU",
  authDomain: "budget-tracker-app-85340.firebaseapp.com",
  projectId: "budget-tracker-app-85340",
  storageBucket: "budget-tracker-app-85340.firebasestorage.app",
  messagingSenderId: "254432674151",
  appId: "1:254432674151:web:35a86c0afb947ee7092fc2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);