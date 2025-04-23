document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    // Add error message div if it doesn't exist
    let messageDiv = document.getElementById('message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        signinForm.appendChild(messageDiv);
    }
    
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            // This already uses the correct API URL from config
            const response = await fetch(`${window.APP_CONFIG.API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store auth data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Success message
                messageDiv.textContent = 'Login successful! Redirecting...';
                messageDiv.className = 'success-message';
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                // Error message from server
                messageDiv.textContent = data.message || 'Authentication failed';
                messageDiv.className = 'error-message';
            }
        } catch (error) {
            console.error('Login failed:', error);
            messageDiv.textContent = 'Connection error. Please try again.';
            messageDiv.className = 'error-message';
        }
    });
});