import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAS7TWFptjL2EUuTM-W_sm5V983Q6FkUU4",
  authDomain: "garagesystem-a0cee.firebaseapp.com",
  projectId: "garagesystem-a0cee",
  storageBucket: "garagesystem-a0cee.firebasestorage.app",
  messagingSenderId: "534257038703",
  appId: "1:534257038703:web:dda27fda99c2b87b90249a",
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;