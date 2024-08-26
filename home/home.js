import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "../auth/firebaseinit.js";

window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.querySelector('.userEmail').textContent = user.email;
        } else {
            window.location.href = 'auth.html';
        }
    });
};