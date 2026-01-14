import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// (Optional) analytics – safe to keep
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCMpi61i_gvVg95-uJPV01jFbzUcsZnizQ",
  authDomain: "medhive-624fd.firebaseapp.com",
  projectId: "medhive-624fd",
  storageBucket: "medhive-624fd.appspot.com",
  messagingSenderId: "101335753640",
  appId: "1:101335753640:web:32f5f672cb007f1eb9f39d",
  measurementId: "G-WGMBQMJNFB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional (no error even if unused)
getAnalytics(app);

// ✅ THESE WERE MISSING
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
