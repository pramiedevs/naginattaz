document.addEventListener('DOMContentLoaded', function() {
    const calendarBtn = document.getElementById('calendar-btn');
    const danceBtn = document.getElementById('dance-btn');
    const exercisesBtn = document.getElementById('exercises-btn');
    const dietBtn = document.getElementById('diet-btn');

    const calendarSection = document.getElementById('calendar-section');
    const danceSection = document.getElementById('dance-section');
    const exercisesSection = document.getElementById('exercises-section');
    const dietSection = document.getElementById('diet-section');

    function showSection(sectionToShow) {
        calendarSection.style.display = 'none';
        danceSection.style.display = 'none';
        exercisesSection.style.display = 'none';
        dietSection.style.display = 'none';
        sectionToShow.style.display = 'block';
    }

    calendarBtn.addEventListener('click', function() {
        showSection(calendarSection);
    });

    danceBtn.addEventListener('click', function() {
        showSection(danceSection);
    });

    exercisesBtn.addEventListener('click', function() {
        showSection(exercisesSection);
    });

    dietBtn.addEventListener('click', function() {
        showSection(dietSection);
    });
});
