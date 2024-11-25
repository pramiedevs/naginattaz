document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const signinButton = document.getElementById('g-signin-button');
    const logoutButton = document.getElementById('logout-button');
    const calendarEventsContainer = document.getElementById('calendar-events-container'); // container to display events

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
        sessionStorage.setItem('idToken', response.credential);
        sessionStorage.setItem('loggedIn', 'true');

        
        if (window.opener) {
            console.log("Redirecting parent window");
            window.opener.location.href = './clases.html'; // Redirect parent window
        } else {
            console.log("No opener found, redirecting this window");
            window.location.href = './clases.html'; // Fallback for testing
        }
        // After login, load calendar events
        loadGoogleCalendar();
    }

    function initGoogleSignIn() {
        if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
            console.error('Google Sign-In library is not loaded.');
            return;
        }

        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            scope: 'https://www.googleapis.com/auth/calendar.readonly' // Add Calendar scope here
        });

        google.accounts.id.renderButton(
            document.getElementById('g-signin-button'),
            { theme: 'outline', size: 'large' }
        );
    }

    async function loadGoogleCalendar() {
        // Check if user is already logged in
        const accessToken = sessionStorage.getItem('idToken');
        if (!accessToken) {
            console.log("No access token found. Please authenticate.");
            return;
        }

        // Load the gapi client
        gapi.load("client:auth2", initCalendarClient);
    }

    function initCalendarClient() {
        gapi.auth2.init({ client_id: clientId }).then(() => {
            // Once initialized, get the user's email and time zone
            const userEmail = sessionStorage.getItem('userEmail');
            gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest").then(() => {
                // Fetch user's calendar settings
                getCalendarSettings(userEmail);
            });
        });
    }

    // Function to fetch user's time zone and generate calendar iframe
    function getCalendarSettings(userEmail) {
        const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

        gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${userEmail}/settings`,
            method: 'GET',
            params: {
                access_token: accessToken
            }
        }).then(response => {
            const timeZone = response.result.timeZone; // Get user's time zone

            // Dynamically create the iframe for the calendar
            createCalendarIframe(userEmail, timeZone);
        }).catch(error => {
            console.error('Error fetching calendar settings:', error);
        });
    }

    // Function to create and embed the calendar iframe dynamically
    function createCalendarIframe(userEmail, timeZone) {
        const calendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userEmail)}&ctz=${encodeURIComponent(timeZone)}`;
        const iframe = document.createElement('iframe');
        iframe.src = calendarUrl;
        iframe.style = "border: 0";
        iframe.width = "800";
        iframe.height = "600";
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        
        // Clear the previous content and append the new iframe
        calendarEventsContainer.innerHTML = '';
        calendarEventsContainer.appendChild(iframe);
    }

    // Initialize Google Sign-In
    loadConfig();

    // Custom button click to trigger Google Sign-In
    signinButton.addEventListener('click', () => {
        google.accounts.id.prompt(); // Show the Google sign-in dialog
    });

    // Load configuration
    loadConfig();

    // Handle logout button click
    logoutButton.addEventListener('click', handleLogout);

    
});
