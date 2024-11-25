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

        // After login, load calendar events
        loadCalendarEvents();
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

            // Load calendar events if the user is already logged in
            loadCalendarEvents();
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

    // Function to load Google Calendar events
function loadCalendarEvents() {
    gapi.load("client:auth2", initCalendarClient); // Ensure the client is loaded and initialized
}

// Function to initialize Google Calendar client
function initCalendarClient() {
    gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
    }).then(() => {
        // Now we can make the API call to fetch calendar events
        getCalendarEvents();
    }).catch(error => {
        console.error("Error initializing the calendar client:", error);
    });
}

// Function to fetch calendar events
function getCalendarEvents() {
    const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    if (!accessToken) {
        console.log("No access token found. Please authenticate.");
        return;
    }

    // Use 'primary' for the user's primary calendar
    gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        method: 'GET',
        params: {
            access_token: accessToken
        }
    }).then(response => {
        console.log("API Response:", response);
        if (response && response.result && response.result.items) {
            displayCalendarEvents(response.result.items);
        } else {
            console.error("No events found or API response format is incorrect.");
        }
    }).catch(error => {
        console.error('Error fetching calendar events:', error);
    });
}


    // Function to display calendar events
    function displayCalendarEvents(events) {
        calendarEventsContainer.innerHTML = ''; // Clear existing events

        if (events.length === 0) {
            calendarEventsContainer.innerHTML = '<p>No upcoming events</p>';
            return;
        }

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.innerHTML = `
                <p><strong>Event:</strong> ${event.summary}</p>
                <p><strong>Start:</strong> ${new Date(event.start.dateTime).toLocaleString()}</p>
                <p><strong>End:</strong> ${new Date(event.end.dateTime).toLocaleString()}</p>
            `;
            calendarEventsContainer.appendChild(eventElement);
        });
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
