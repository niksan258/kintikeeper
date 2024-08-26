const toggleForms = () => {
    const loginForm = document.getElementById('loginFormContainer');
    const signupForm = document.getElementById('signupFormContainer');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
}