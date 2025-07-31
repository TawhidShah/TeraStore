import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbHSoORuyscjhLSJFRcgTRrnWVrgscOs4",
  authDomain: "terastore-12ae4.firebaseapp.com",
  projectId: "terastore-12ae4",
  storageBucket: "terastore-12ae4.appspot.com",
  messagingSenderId: "149337805939",
  appId: "1:149337805939:web:7ec9cfced0ad259d6e8606",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
