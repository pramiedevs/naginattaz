document.addEventListener('DOMContentLoaded', () => {
    const userPic = document.getElementById('user-pic');
    
    userPic.src = sessionStorage.getItem('userPic');
   
});



document.getElementById('logout-button').addEventListener('click', () => {
    // Clear the user picture URL from localStorage
    
    // Redirect back to clases.html
    window.location.href = '../clases.html';
});
