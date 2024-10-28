document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.container .image');

    images.forEach(image => {
        const imageLink = image.parentElement.querySelector('.image-link'); // Get the link element here

        // Click event for opening a popup
        if (imageLink) { // Check if imageLink is defined
            imageLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor click behavior
                const url = imageLink.href; // Use the href of the link
                window.open(url, 'popupWindow', 'width=600,height=400'); // Open popup
            });
        }
    });
});
