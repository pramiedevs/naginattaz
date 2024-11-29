document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const featuredProducts = document.getElementById('featured-products');
    const mainSection = document.getElementById('main-section');
    const contentDivs = mainSection.querySelectorAll('.content');
    const inicioContent = document.getElementById('inicio-content'); ;

    const displayProperties = {
        'pinturas': 'flex',
        'ferreteria': 'flex',
        'herramientas': 'flex',
        'sanitarios': 'flex',
        'herramientas': 'flex',        
        'catalogo': 'block',
        'galeria': 'block',
        // Add other sections and their display properties here
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const linkId = this.id;

            if (linkId === 'inicio') {
                // Redirect to index.html
                window.location.href = '../index.html';
            } else {
                // Hide the featured products section
                featuredProducts.style.display = 'none';

                // Hide all content divs
                contentDivs.forEach(div => {
                    div.style.display = 'none';
                });

                
                // Show the corresponding content div
                const contentToShow = document.getElementById(`${linkId}-content`);
                if (contentToShow) {
                    // Set the display property based on the linkId
                    const displayProperty = displayProperties[linkId] || 'block'; // Default to 'block' if not specified
                    contentToShow.style.display = displayProperty;
                    inicioContent.style.display = "none";
                }
            }
        });
    });
});
