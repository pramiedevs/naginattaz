document.addEventListener('DOMContentLoaded', () => {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your client ID
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const planInfo = document.getElementById('plan-info');

    function handleCredentialResponse(response) {
        const user = response.credential;
        const userInfo = JSON.parse(atob(user.split('.')[1]));
        
        // Update welcome message and user info
        userName.textContent = userInfo.name;
        userPic.src = userInfo.picture;
        userInfo.style.display = 'block';
        planInfo.textContent = 'TU PLAN ACTUAL ES BAMBU'; // Optional: Update plan info if needed
    }

    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById('g-signin-button'),
            { theme: 'outline', size: 'large' }  // You can change these options as needed
        );
    }

    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('g-signin-button'),
        { theme: 'outline', size: 'large' }
    );
});
