document.addEventListener('DOMContentLoaded', () => {
    const userPic = document.getElementById('user-pic');
    
    const profilePictureURL = sessionStorage.getItem('userPicClass');
    
    if (profilePictureURL) {
        userPic.src = profilePictureURL;
    } else {
        console.log("No profile picture found in localStorage");
    }
});




