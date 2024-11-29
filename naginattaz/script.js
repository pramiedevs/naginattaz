function applyDayOrNightMode() {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 14) {
        // Morning/Daytime (6am - 2pm): use default variables
        document.documentElement.classList.remove('darkmode');
        document.documentElement.classList.remove('noon');
    } else if (currentHour >= 14 && currentHour < 20) {
        // Noon (2pm - 8pm): apply noon mode variables
        document.documentElement.classList.add('noon');
        document.documentElement.classList.remove('darkmode');
    } else {
        // Nighttime (8pm - 6am): apply dark mode variables
        document.documentElement.classList.add('darkmode');
        document.documentElement.classList.remove('noon');
    }
}

// Apply the appropriate mode when the page loads
window.onload = applyDayOrNightMode;

