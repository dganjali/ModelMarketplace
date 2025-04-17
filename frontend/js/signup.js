document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (password.length < 8) {
            messageDiv.textContent = 'Password must be at least 8 characters';
            messageDiv.style.color = 'red';
            return;
        }
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageDiv.textContent = 'Account created successfully! Redirecting to login...';
                messageDiv.style.color = 'green';
                
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
            } else {
                messageDiv.textContent = data.message || 'Registration failed';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Registration failed:', error);
            messageDiv.textContent = 'Registration failed. Please try again.';
            messageDiv.style.color = 'red';
        }
    });
});