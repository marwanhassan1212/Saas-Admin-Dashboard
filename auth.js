// auth.js - Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('loginBtn');
            const errorDiv = document.getElementById('auth-error');
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...';
            errorDiv.classList.add('d-none');

            try {
                await API.login(email, password);
                // Success, redirect happens in wait/promise or here
                window.location.href = 'index.html';
            } catch (err) {
                errorDiv.innerText = err.message;
                errorDiv.classList.remove('d-none');
                btn.disabled = false;
                btn.innerHTML = 'Sign In';
            }
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('registerBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating Account...';
            
            // Mock delay
            await API.delay(1000);
            
            // Set dummy user
            const user = { id: 2, name: 'New User', email: 'new@example.com', role: 'User' };
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        });
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('resetBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

            await API.delay(1000);

            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
            btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Reset Link Sent';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
});
