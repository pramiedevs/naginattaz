function applyDayOrNightMode() {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 18) {
        // Morning/Daytime (6am - 6pm): use default variables
        document.documentElement.classList.remove('darkmode');
    } else {
        // Nighttime (6pm - 6am): apply dark mode variables
        document.documentElement.classList.add('darkmode');
        document.documentElement.classList.remove('noon');
    }
}

// Apply the appropriate mode when the page loads
window.onload = applyDayOrNightMode;

