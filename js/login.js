document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        localStorage.setItem('rememberMe', 'true');
        window.location.href = 'home.html';
    } catch (error) {
        alert(error.message);
    }
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

async function forgotPassword() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter your email first');
        return;
    }
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        alert('Password reset email sent!');
    } catch (error) {
        alert(error.message);
    }
}
