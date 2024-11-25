document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const signinButton = document.getElementById('g-signin-button');
    const logoutButton = document.getElementById('logout-button');

    let isLoggedIn = false; // Track login status
    let clientId; // Declare clientId variable

    // Load the client configuration
    async function loadConfig() {
        try {
            const response = await fetch('./config.json');
            const config = await response.json();
            clientId = config.clientId; // Set clientId from config
            sessionStorage.setItem('clientId', clientId);
            initGoogleSignIn(); // Call init after setting clientId
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    // Handle the response after user authentication
    function handleCredentialResponse(response) {
        const user = response.credential;
        const userInfoData = JSON.parse(atob(user.split('.')[1])); // Decode JWT token
        const userEmail = userInfoData.email; // Extract email

        // Save email and user info in session storage
        sessionStorage.setItem('userEmail', userEmail);
        
        // Display user picture and info
        userPic.src = userInfoData.picture;
        userInfo.style.display = 'flex';
        logoutButton.style.display = 'inline-block';

        // Mark user as logged in
        isLoggedIn = true;

        // Save user picture URL and ID token to sessionStorage
        sessionStorage.setItem('userPic', userInfoData.picture);
        sessionStorage.setItem('idToken', response.credential);
        sessionStorage.setItem('loggedIn', 'true');
        
        // Redirect to the next page after login
        if (window.opener) {
            console.log("Redirecting parent window");
            window.opener.location.href = './clases.html'; // Redirect parent window
        } else {
            console.log("No opener found, redirecting this window");
            window.location.href = './clases.html'; // Fallback for testing
        }
    }

    // Initialize Google Sign-In
    function initGoogleSignIn() {
        if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
            console.error('Google Sign-In library is not loaded.');
            return;
        }

        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            scope: 'email' // Only requesting email scope
        });

        google.accounts.id.renderButton(
            signinButton,
            { theme: 'outline', size: 'large' }
        );
    }

    // Handle logout button click
    function handleLogout() {
        // Clear sessionStorage
        sessionStorage.clear();

        // Reset UI elements
        userPic.src = '';
        userInfo.style.display = 'none';
        logoutButton.style.display = 'none';

        // Mark user as logged out
        isLoggedIn = false;
    }

    // Initialize Google Sign-In on page load
    loadConfig();

    // Custom button click to trigger Google Sign-In
    signinButton.addEventListener('click', () => {
        google.accounts.id.prompt(); // Show the Google sign-in dialog
    });

    // Handle logout button click
    logoutButton.addEventListener('click', handleLogout);
});
