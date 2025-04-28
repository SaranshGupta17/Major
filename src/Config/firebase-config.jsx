
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb14InvG17fFOX_lAXfkZ68iV4honHfYw",
  authDomain: "incom-f7972.firebaseapp.com",
  projectId: "incom-f7972",
  storageBucket: "incom-f7972.appspot.com",
  messagingSenderId: "209569770379",
  appId: "1:209569770379:web:b8780cb4228da37233dd8e",
  measurementId: "G-3SSBB9R60W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };