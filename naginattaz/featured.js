
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.carousel-container');
    const items = document.querySelector('.carousel-items');
    const products = Array.from(document.querySelectorAll('.product'));
    
    // Ensure there are enough products to create a pendulum effect
    if (products.length <= 5) {
        console.error('Not enough products to create a pendulum effect.');
        return;
    }

    const productWidth = products[0].offsetWidth + 20; // Including margin
    const displayCount = 5; // Number of products to display at a time
    const totalProducts = products.length;
    const totalWidth = productWidth * totalProducts; // Total width of all products
    const containerWidth = productWidth * displayCount; // Width of the visible area

    // Duplicate the carousel items to create a loop effect
    items.innerHTML += items.innerHTML; // Duplicate items

    items.style.width = `${totalWidth * 2}px`; // Set the width of the items container to fit all items

    let position = 0;
    let direction = 1; // 1 for right, -1 for left

    const moveCarousel = () => {
        position += direction * productWidth;

        // Check if we need to change direction
        if (position >= totalWidth || position <= 0) {
            direction *= -1; // Reverse direction
            position = Math.max(0, Math.min(position, totalWidth));
        }

        items.style.transform = `translateX(-${position}px)`;
    };

    // Start the carousel movement
    setInterval(moveCarousel, 3500); // Move every 50ms for smooth animation
  
});
