import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from '../config/secrets.js'; // Adjust the path as needed

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Pass the initialized app to getAuth

export { auth }; // Export the auth instance
