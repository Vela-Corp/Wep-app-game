// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCu02pJFzPzYWQkvTKzheAqTlFUC3h3Pw8",
  authDomain: "webapp-game-ecdbc.firebaseapp.com",
  projectId: "webapp-game-ecdbc",
  storageBucket: "webapp-game-ecdbc.appspot.com",
  messagingSenderId: "41384868134",
  appId: "1:41384868134:web:f1521649e2df78f20b69e7",
  measurementId: "G-88KC9L0KEQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db = getFirestore(app);
export { db };
