// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfyfN6Ec_a-QI051Zk73ZLYcBv58HNfw0",
  authDomain: "online-job-portal-b4eda.firebaseapp.com",
  projectId: "online-job-portal-b4eda",
  storageBucket: "online-job-portal-b4eda.appspot.com",
  messagingSenderId: "859977986798",
  appId: "1:859977986798:web:ac4fa892d46d49e7d179ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};