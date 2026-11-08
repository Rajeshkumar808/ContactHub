
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEYuidGa4_pI0wkc6K-ZRTE29FXtpiEUo",
  authDomain: "g2contacthub.firebaseapp.com",
  projectId: "g2contacthub",
  storageBucket: "g2contacthub.firebasestorage.app",
  messagingSenderId: "877652309258",
  appId: "1:877652309258:web:5aa36be7bdea7c82be36f3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
