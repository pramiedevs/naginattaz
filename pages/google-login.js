document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const signinButton = document.getElementById('g-signin-button');
    const logoutButton = document.getElementById('logout-button');

    let isLoggedIn = false; // Track the login status
    let clientId; // Declare clientId variable

    async function loadConfig() {
        try {
            const response = await fetch('./config.json');
            const config = await response.json();
            clientId = config.clientId; // Set clientId from config
            initGoogleSignIn(); // Call init after setting clientId
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    function handleCredentialResponse(response) {
        const user = response.credential;
        const userInfoData = JSON.parse(atob(user.split('.')[1]));
        const userEmail = userInfoData.email; // Extract email

        // Save email in session storage
        sessionStorage.setItem('userEmail', userEmail);
        
        userPic.src = userInfoData.picture;
        userInfo.style.display = 'flex';
        logoutButton.style.display = 'inline-block';

        // Mark user as logged in
        isLoggedIn = true;

        // Save user picture URL and ID token to sessionStorage
        sessionStorage.setItem('userPic', userInfoData.picture);
        sessionStorage.setItem('userPicClass', userInfoData.picture);
        sessionStorage.setItem('idToken', response.credential);
        sessionStorage.setItem('loggedIn', 'true');

        if (window.opener) {
            console.log("Redirecting parent window");
            window.opener.location.href = './clases.html'; // Redirect parent window
        } else {
            console.log("No opener found, redirecting this window");
            window.location.href = './clases.html'; // Fallback for testing
        }
    }

    function initGoogleSignIn() {
        if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
            console.error('Google Sign-In library is not loaded.');
            return;
        }

        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            signinButton,
            { theme: 'outline', size: 'large' }
        );

        // Check if user is already logged in
        const savedPic = sessionStorage.getItem('userPic');
        const idToken = sessionStorage.getItem('idToken');
        if (savedPic && idToken) {
            userPic.src = savedPic;
            userInfo.style.display = 'flex';
            logoutButton.style.display = 'inline-block';
            isLoggedIn = true;
        }
    }

    function handleLogout() {
        if (!isLoggedIn) {
            console.warn("User is not signed in.");
            return;
        }

        // Clear user data and update UI
        const idToken = sessionStorage.getItem('idToken');
        if (idToken) {
            google.accounts.id.revoke(idToken, () => {
                userPic.src = '';
                userInfo.style.display = 'none';

                // Reset login status
                isLoggedIn = false;

                // Clear session storage
                sessionStorage.removeItem('userEmail');
                sessionStorage.removeItem('userPic');
                sessionStorage.removeItem('idToken');
                sessionStorage.removeItem('loggedIn');
                window.location.href = '../index.html';
            });
        } else {
            console.warn("No ID token found for revocation.");
        }
    }

    // Custom button click to trigger Google Sign-In
    signinButton.addEventListener('click', () => {
        google.accounts.id.prompt(); // Show the Google sign-in dialog
    });

    // Load configuration
    loadConfig();

    // Handle logout button click
    logoutButton.addEventListener('click', handleLogout);

    
});
