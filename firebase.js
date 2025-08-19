// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBryvwUaW3o31u7GJ8CQEHvfUd11v_AKc4",
  authDomain: "leave-b55eb.firebaseapp.com",
  projectId: "leave-b55eb",
  storageBucket: "leave-b55eb.firebasestorage.app",
  messagingSenderId: "136745589459",
  appId: "1:136745589459:web:4cb5652ca286c3479dd226",
  measurementId: "G-3KR9C67WQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);