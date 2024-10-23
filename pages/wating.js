document.addEventListener('DOMContentLoaded', () => {
    // Show the loader
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const header = document.getElementById('header');
    const welcome = document.getElementById('welcome');

  
    // Simulate loading time
    setTimeout(() => {
      // Hide loader and show main content
      loader.style.display = 'none';
      mainContent.classList.remove('wating');
      header.classList.remove('wating');
      welcome.classList.remove('wating');
      mainContent.style.background = "linear-gradient(0.25turn, #111111, #26152e, #524257, #382142, #0f0f0f)";
    }, 3000); // Adjust this duration to match your loading animation time
  });