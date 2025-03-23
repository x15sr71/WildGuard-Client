import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCtIiyksrxR3akcTCxDYAA40jnsXjGpZK4",
    authDomain: "wild-d9373.firebaseapp.com",
    projectId: "wild-d9373",
    storageBucket: "wild-d9373.firebasestorage.app",
    messagingSenderId: "559840780874",
    appId: "1:559840780874:web:791c5e2068d3319057fcb3",
    measurementId: "G-B9V5HT88LL"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
