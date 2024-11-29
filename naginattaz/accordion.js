document.addEventListener('DOMContentLoaded', () => {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    // Accordion functionality
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
    
    // Price range functionality
    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
    });
});
