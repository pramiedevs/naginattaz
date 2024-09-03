document.addEventListener('DOMContentLoaded', () => {
    const clientId = '425627947718-26j5n0t5t3kme55govd3n463ogolfjbo.apps.googleusercontent.com'; // Replace with your client ID
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const planInfo = document.getElementById('plan-info');

    function handleCredentialResponse(response) {
        const user = response.credential;
        const userInfoData = JSON.parse(atob(user.split('.')[1]));

        // Update welcome message and user info
        userName.textContent = userInfoData.name;
        userPic.src = userInfoData.picture;
        userInfo.style.display = 'block';
        signinButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
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
        google.accounts.id.revoke(token => {
            console.log('User logged out');
            userName.textContent = '"USER"';
            userPic.src = '';
            userInfo.style.display = 'none';
            signinButton.style.display = 'block';
            logoutButton.style.display = 'none';
        });
    }

    initGoogleSignIn();

    logoutButton.addEventListener('click', handleLogout);
});
