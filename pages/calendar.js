document.addEventListener('DOMContentLoaded', function() {
    // Get button elements
    const calendarBtn = document.getElementById('calendar-btn');
    const danceBtn = document.getElementById('dance-btn');
    const exercisesBtn = document.getElementById('exercises-btn');
    const dietBtn = document.getElementById('diet-btn');

    // Get section elements
    const calendarSection = document.getElementById('calendar-section');
    const danceSection = document.getElementById('dance-section');
    const exercisesSection = document.getElementById('exercises-section');
    const dietSection = document.getElementById('diet-section');

    // Function to show a specific section and hide others
    function showSection(sectionToShow) {
        // Hide all sections
        [calendarSection, danceSection, exercisesSection, dietSection].forEach(section => {
            if (section) section.style.display = 'none';
        });
        // Show the requested section
        if (sectionToShow) sectionToShow.style.display = 'block';
    }

    // Attach event listeners to buttons
    if (calendarBtn) calendarBtn.addEventListener('click', function() {
        showSection(calendarSection);
    });

    if (danceBtn) danceBtn.addEventListener('click', function() {
        showSection(danceSection);
    });

    if (exercisesBtn) exercisesBtn.addEventListener('click', function() {
        showSection(exercisesSection);
    });

    if (dietBtn) dietBtn.addEventListener('click', function() {
        showSection(dietSection);
    });

    // Optional: Show calendar section by default
    showSection(calendarSection);
});

