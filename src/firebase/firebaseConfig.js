import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNnwGTemMX-MxmKRnvH_a1yALn6_nfP6E",
  authDomain: "my-tech-a45b2.firebaseapp.com",
  projectId: "my-tech-a45b2",
  storageBucket: "my-tech-a45b2.appspot.com",
  messagingSenderId: "861986312519",
  appId: "1:861986312519:web:3eba770c08c482cda63c62",
  measurementId: "G-D7FH2JM997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);