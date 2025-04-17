document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${window.APP_CONFIG.API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                window.location.href = '/dashboard';
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    });
});