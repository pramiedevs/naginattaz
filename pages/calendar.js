document.addEventListener('DOMContentLoaded', () => {
    const calendarBtn = document.getElementById('calendar-btn');
    const danceBtn = document.getElementById('dance-btn');
    const exercisesBtn = document.getElementById('exercises-btn');
    const dietBtn = document.getElementById('diet-btn');
    
    const calendarSection = document.getElementById('calendar-section');
    const fixedCalendarSection = document.getElementById('fixed-calendar-section');
    
    calendarBtn.addEventListener('click', () => {
        calendarSection.style.display = 'block';
        fixedCalendarSection.style.display = 'none';
    });
    
    danceBtn.addEventListener('click', () => {
        calendarSection.style.display = 'none';
        fixedCalendarSection.style.display = 'block';
    });
    
    exercisesBtn.addEventListener('click', () => {
        calendarSection.style.display = 'none';
        fixedCalendarSection.style.display = 'block';
    });
    
    dietBtn.addEventListener('click', () => {
        calendarSection.style.display = 'none';
        fixedCalendarSection.style.display = 'block';
    });
    
    // Generate rows for the fixed calendar
    const tbody = fixedCalendarSection.querySelector('tbody');
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            cell.textContent = `Timer ${i + 1}`;
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
});
