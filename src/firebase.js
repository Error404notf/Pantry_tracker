// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}   from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQVBwIz0s-9wg00HjpQI5ZYc0gC0USQ5w",
  authDomain: "inventory-management-ff351.firebaseapp.com",
  projectId: "inventory-management-ff351",
  storageBucket: "inventory-management-ff351.appspot.com",
  messagingSenderId: "461386728893",
  appId: "1:461386728893:web:140ab43c27798c58707ed4",
  measurementId: "G-B2S2DX9W0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore= getFirestore(app)

export{firestore}