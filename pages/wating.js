document.addEventListener('DOMContentLoaded', () => {
    // Show the loader
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
  
    // Simulate loading time
    setTimeout(() => {
      // Hide loader and show main content
      loader.style.display = 'none';
      mainContent.classList.remove('wating');
    }, 3000); // Adjust this duration to match your loading animation time
  });