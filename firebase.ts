// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAEsXilU3RSzPMTGTDXJtKRqwMaNr0o1hA",
  authDomain: "grocer.huynguyen.ca",
  projectId: "grocer-cbeb9",
  storageBucket: "grocer-cbeb9.appspot.com",
  messagingSenderId: "193878211517",
  appId: "1:193878211517:web:e639e3264718c9b92970d4",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const functions = getFunctions();
export const firestore = getFirestore(firebaseApp);
