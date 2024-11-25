document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    const userPic = document.getElementById('user-pic');
    const userInfo = document.getElementById('user-info');
    const signinButton = document.getElementById('g-signin-button');
    const logoutButton = document.getElementById('logout-button');
    const calendarEventsContainer = document.getElementById('calendar-events-container'); // container to display events
    let accessToken = '';
    let isLoggedIn = false; // Track login status
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
        
        console.log('Logged in as: ', userEmail);
            console.log('Access Token:', response.credential); // Log the access token

            // Store the access token for API requests
            accessToken = response.credential;

            // After login, load the user's calendar
            loadCalendarEvents();
        
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

    // Load the calendar events
    function loadCalendarEvents() {
        if (!accessToken) {
            console.log("No access token found. Please authenticate.");
            return;
        }

        // Load the Google API client
        gapi.load('client:auth2', initCalendarClient);
    }

    // Initialize Google Calendar API client
    function initCalendarClient() {
        console.log('Initializing Google Calendar client...');
        gapi.auth2.init({ client_id: clientId }).then(() => {
            gapi.client.load('https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest').then(() => {
                getCalendarEvents();
            }).catch(error => {
                console.error('Error loading Google Calendar API:', error);
            });
        }).catch(error => {
            console.error('Error initializing Google Auth:', error);
        });
    }

    // Fetch the logged-in user's calendar events
    function getCalendarEvents() {
        if (!accessToken) {
            console.log("No access token found.");
            return;
        }

        // Use the logged-in user's email to display their calendar
        console.log('Fetching calendar events for:', userEmail);  // Log the user email
        gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${userEmail}/events`,  // Use the logged-in user's email
            method: 'GET',
            params: {
                access_token: accessToken
            }
        }).then(response => {
            console.log('Calendar events response:', response);  // Log the response to check if the API returns events
            if (response.result.items && response.result.items.length > 0) {
                // If events are found, display them
                const calendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userEmail)}&ctz=America%2FSao_Paulo`;
                createCalendarIframe(calendarUrl);
            } else {
                console.log('No events found in the calendar.');
                document.getElementById('calendar-container').innerHTML = '<p>No upcoming events found.</p>';
            }
        }).catch(error => {
            console.error('Error fetching calendar events:', error);
        });
    }

    // Create and embed the calendar iframe
    function createCalendarIframe(calendarUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = calendarUrl;
        iframe.style = "border: 0";
        iframe.width = "800";
        iframe.height = "600";
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        
        // Clear the previous content and append the new iframe
        document.getElementById('calendar-container').innerHTML = '';
        document.getElementById('calendar-container').appendChild(iframe);
    }

    // Initialize Google Sign-In
    function initGoogleSignIn() {
        if (typeof google === 'undefined') {
            // Retry initialization once the Google API is available
            setTimeout(initGoogleSignIn, 100);
            return;
        }

        google.accounts.id.initialize({
client_id: clientId,
callback: handleCredentialResponse,
scope: 'https://www.googleapis.com/auth/calendar.readonly' // Calendar scope
});

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
