document.addEventListener('DOMContentLoaded', () => {
    const clientId = '425627947718-26j5n0t5t3kme55govd3n463ogolfjbo.apps.googleusercontent.com'; // Replace with your client ID
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    //const userEmail = document.getElementById('user-email');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const signinButton = document.getElementById('g-signin-button');
    const logoutButton = document.getElementById('logout-button');

    

    let isLoggedIn = false; // Track the login status

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

        slashImage();

        if (window.opener) {
            console.log("Redirecting parent window");
            window.opener.location.href = './pages/clases.html'; // Redirect parent window
        } else {
            console.log("No opener found, redirecting this window");
            window.location.href = './pages/clases.html'; // Fallback for testing
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
        const savedPic = localStorage.getItem('userPic');
        const idToken = localStorage.getItem('idToken');
        if (savedPic && idToken) {
            userPic.src = savedPic;
            userInfo.style.display = 'flex';
            //signinButton.style.display = 'none';
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
        const idToken = localStorage.getItem('idToken');
        if (idToken) {
            google.accounts.id.revoke(idToken, () => {
                //userName.textContent = '';
                //userEmail.textContent = '';
                userPic.src = '';
                userInfo.style.display = 'none';
                //signinButton.style.display = 'block';
                //logoutButton.style.display = 'none';

                // Reset login status
                isLoggedIn = false;

                // Clear local storage
                localStorage.removeItem('userPic');
                localStorage.removeItem('idToken');
                window.location.href = '../index.html';
            });
        } else {
            console.warn("No ID token found for revocation.");
        }
    }

    // Initialize Google Sign-In
    window.onload = function() {
    initGoogleSignIn();
};


    logoutButton.addEventListener('click', handleLogout);
});
