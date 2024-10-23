document.addEventListener('DOMContentLoaded', () => {
    
function slashImage() {
    const image = document.querySelector('.image');
    const container = document.querySelector('.container');
    const body = document.body;
    const gifBackground = document.getElementById('gifBackground');

    // Change the clip-path for a diagonal reveal
    image.style.clipPath = 'polygon(0 0, 100% 0, 0 100%)';

    // Play sound effect
    const sound = new Audio('path-to-your-sound-effect.mp3'); // Replace with your sound file path
    sound.play();

    // Flash background color
    body.style.background = 'white';
    setTimeout(() => {
        body.style.background = 'black';
        body.style.background = 'var(--nagirosa)';
        body.style.background = 'var(--nagimagenta)';
        body.style.background = 'linear-gradient(0.25turn, #a81e96, #430e53,#26152e, #382142, #a81e96)';

    }, 300); // Flash duration

    // Show the GIF background
    gifBackground.style.opacity = 1;
    
    setTimeout(() => {
    gifBackground.style.opacity = 0;
    }, 200); // Duration to keep the GIF visible

    // Add shake animation
    container.style.animation = 'shake 0.5s ease';
    container.style.background = 'black';


    // Remove animation class after it finishes to allow re-triggering
    setTimeout(() => {
        container.style.animation = 'none';
    }, 500); // Match duration of shake animation
}

document.getElementById('slash-button').addEventListener('click', slashImage);
    
});
