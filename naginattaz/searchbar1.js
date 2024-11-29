document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-bar');
    const searchButton = document.querySelector('.search-bar button');
    const content1 = document.getElementById('content1');
    const loadMoreButton = document.querySelector('.load-more');

    let allItems = [];  // Holds all items from the JSON
    let displayedItems = [];  // Items currently shown
    let currentIndex = 0;  // Track which items are currently displayed
    let searchQuery = '';  // Store the current search query

    function createFlipCard(item) {
        const addToCartButton = item.stock > 0
            ? `<button class="add-to-cart" data-image="${item.image}" data-title="${item.title}" data-price="${item.price}" data-stock="${item.stock}">Add to Cart</button>`
            : '';
    
        return `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${item.image}" alt="${item.title}" style="width:30vh">
                        <div style="color: black;">
                            <h3>${item.title}</h3>
                            <p>${item.price}</p>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <p>${item.description}</p>
                        <h3>${item.title}</h3>
                        <p>${item.price}</p>
                        ${addToCartButton}
                    </div>
                </div>
            </div>
        `;
    }
    


    // Function to create a "not found" flip card
    function createNotFoundCard() {
        return `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="https://via.placeholder.com/200" alt="Not Found">
                        <div style="color: black;">
                            <h3>No se ha encontrado</h3>
                            <p>$0.00</p>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <h3>No se ha encontrado</h3>
                        <p>$0.00</p>
                        <p>El producto que usted busca no está dentro de nuestro inventario.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to render items
    function renderItems(items) {
        content1.innerHTML = items.map(createFlipCard).join('');
    }

    // Function to render "not found" card
    function renderNotFoundCard() {
        content1.innerHTML = createNotFoundCard();
        loadMoreButton.style.display = 'none';  // Hide "Load More" button if no items are found
    }

    // Load items from JSON
    function loadItems() {
        fetch('items.json')
            .then(response => response.json())
            .then(data => {
                allItems = data.items;  // Access the 'items' array from the JSON data
                displayedItems = allItems.slice(0, 10);  // Show the first 10 items initially
                currentIndex = 10;  // Set the index to the next set of items to be shown
                renderItems(displayedItems);  // Render the first set of items
                loadMoreButton.style.display = 'block';  // Ensure "Load More" button is visible
            })
            .catch(error => console.error('Error fetching items:', error));
    }

    // Function to handle the "Load More" button click
    function loadMoreItems() {
        if (currentIndex >= allItems.length) {
            loadMoreButton.textContent = 'No more items';
            loadMoreButton.disabled = true;  // Disable button if no more items
            return;
        }
        const nextItems = allItems.slice(currentIndex, currentIndex + 10);
        displayedItems = [...displayedItems, ...nextItems];
        currentIndex += 10;
        renderItems(displayedItems);
    }

    // Function to perform search and render results
    function performSearch() {
        const query = searchInput.value.toLowerCase();
        searchQuery = query;  // Update the search query

        if (query) {
            const filteredItems = allItems.filter(item => item.title.toLowerCase().includes(query));
            if (filteredItems.length === 0) {
                renderNotFoundCard();
            } else {
                displayedItems = filteredItems.slice(0, 10);  // Reset displayed items to the first 10 of the filtered results
                currentIndex = 10;  // Reset index for filtered results
                renderItems(displayedItems);
                loadMoreButton.style.display = filteredItems.length > 10 ? 'block' : 'none';  // Show button if more items are available
                if (filteredItems.length <= 10) {
                    loadMoreButton.textContent = 'No more items';
                    loadMoreButton.disabled = true;  // Disable button if no more items
                } else {
                    loadMoreButton.textContent = 'Load More';
                    loadMoreButton.disabled = false;  // Enable button if there are more items
                }
            }
        } else {
            // If the search input is cleared, reset the displayed items to show all items
            displayedItems = allItems.slice(0, 10);  // Show the first 10 items initially
            currentIndex = 10;  // Set the index to the next set of items to be shown
            renderItems(displayedItems);
            loadMoreButton.style.display = 'block';  // Ensure "Load More" button is visible
            loadMoreButton.textContent = 'Load More';  // Reset button text
            loadMoreButton.disabled = false;  // Enable button
        }
    }

    // Event listener for search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    searchInput.addEventListener('input', performSearch);

    // Event listener for "Load More" button
    loadMoreButton.addEventListener('click', loadMoreItems);

    // Initial load of items
    loadItems();
});
