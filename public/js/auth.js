import { auth } from "./firebaseinit.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';
    } catch (error) {
        console.log(error);
        document.querySelector('#loginFormContainer .form-error').textContent = error.code;
    }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.querySelector('#signupFormContainer .form-error').textContent = "Passwords do not match.";
        return; 
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';
    } catch (error) {
        document.querySelector('#signupFormContainer .form-error').textContent = error.code;
    }
});

// Handle toggling between forms
const toggleLinks = document.querySelectorAll('.toggle-link');
const loginForm = document.getElementById('loginFormContainer');
const signupForm = document.getElementById('signupFormContainer');

toggleLinks.forEach(link => {
    link.addEventListener('click', () => {
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
        signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
    });
});
