document.addEventListener('DOMContentLoaded', () => {
    const clientId = '425627947718-26j5n0t5t3kme55govd3n463ogolfjbo.apps.googleusercontent.com'; // Replace with your client ID
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const planInfo = document.getElementById('plan-info');
    const signinButton = document.getElementById('g-signin-button');
    const logoutButton = document.getElementById('logout-button');

    let isLoggedIn = false; // Track the login status

    function handleCredentialResponse(response) {
        const user = response.credential;
        const userInfoData = JSON.parse(atob(user.split('.')[1]));

        // Update UI with user info
        userName.textContent = userInfoData.name;
        userEmail.textContent = userInfoData.email;
        userPic.src = userInfoData.picture;
        userInfo.style.display = 'block';
        signinButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        console.log(userEmail);
        // Mark user as logged in
        isLoggedIn = true;
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
    }

    function handleLogout() {
        if (!isLoggedIn) {
            console.warn("User is not signed in.");
            return;
        }

        // Clear user data and update UI
        google.accounts.id.revoke('', () => {
            userName.textContent = '""';
            userEmail.textContent = '';
            userPic.src = '';
            userInfo.style.display = 'none';
            signinButton.style.display = 'block';
            logoutButton.style.display = 'none';

            // Reset login status
            isLoggedIn = false;
        });
    }

    initGoogleSignIn();

    logoutButton.addEventListener('click', handleLogout);
});

