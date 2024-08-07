
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import firestore from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore"; // firestore from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_yXWTGZUuR7ONjKWkMVOM9cLOS48U9lI",
  authDomain: "hspantryapp-d4582.firebaseapp.com",
  projectId: "hspantryapp-d4582",
  storageBucket: "hspantryapp-d4582.appspot.com",
  messagingSenderId: "269749209132",
  appId: "1:269749209132:web:508ac160c275f718c9a989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore};