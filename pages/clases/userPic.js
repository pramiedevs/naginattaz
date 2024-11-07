document.addEventListener('DOMContentLoaded', () => {
    const userPic = document.getElementById('user-pic');
    
    // Retrieve the URL from localStorage
    const profilePictureURL = sessionStorage.getItem('userPic');
    
    if (profilePictureURL) {
        userPic.src = profilePictureURL;
    }
});



document.getElementById('logout-button').addEventListener('click', () => {
    // Redirect back to clases.html
    window.location.href = '../clases.html';
});
