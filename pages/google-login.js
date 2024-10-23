document.addEventListener('DOMContentLoaded', () => {
    const clientId = '425627947718-26j5n0t5t3kme55govd3n463ogolfjbo.apps.googleusercontent.com'; // Replace with your client ID
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const signinButton = document.getElementById('g-signin-button'); // Hidden button
    const logoutButton = document.getElementById('logout-button');

    let isLoggedIn = false;

    function handleCredentialResponse(response) {
        const user = response.credential;
        const userInfoData = JSON.parse(atob(user.split('.')[1]));

        // Update UI with user info
        //userName.textContent = userInfoData.name;
        //userEmail.textContent = userInfoData.email;
        userPic.src = userInfoData.picture;
        userInfo.style.display = 'flex';
        //signinButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';

        // Mark user as logged in
        isLoggedIn = true;

        // Save user picture URL and ID token to localStorage
        localStorage.setItem('userPic', userInfoData.picture);
        localStorage.setItem('idToken', response.credential);

        if (window.opener) {
            console.log("Redirecting parent window");
            window.opener.location.href = './pages/clases.html'; // Redirect parent window
        } else {
            console.log("No opener found, redirecting this window");
            window.location.href = './pages/clases.html'; // Fallback for testing
        }
    }

    function initGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            signinButton,
            { theme: 'outline', size: 'large' }
        );

        // Check if user is already logged in
        const savedPic = localStorage.getItem('userPic');
        const idToken = localStorage.getItem('idToken');
        if (savedPic && idToken) {
            userPic.src = savedPic;
            userInfo.style.display = 'flex';
            logoutButton.style.display = 'inline-block';
            isLoggedIn = true;
        }
    }

    // Custom button click to trigger Google Sign-In
    document.getElementById('custom-login-button').addEventListener('click', () => {
        // Programmatically trigger click on the hidden Google Sign-In button
        google.accounts.id.prompt(); // This will show the Google sign-in dialog
    });

    // Initialize Google Sign-In
    window.onload = function() {
        initGoogleSignIn();
    };

    logoutButton.addEventListener('click', () => {
        if (!isLoggedIn) return;
        const idToken = localStorage.getItem('idToken');
        if (idToken) {
            google.accounts.id.revoke(idToken, () => {
                userPic.src = '';
                userInfo.style.display = 'none';
                logoutButton.style.display = 'none';
                isLoggedIn = false;
                localStorage.removeItem('userPic');
                localStorage.removeItem('idToken');
            });
            // Reset login status
            isLoggedIn = false;

            // Clear local storage
            localStorage.removeItem('userPic');
            localStorage.removeItem('idToken');
            window.location.href = '../index.html';
        }

    });
});
