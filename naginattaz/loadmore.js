// JavaScript

let currentIndex = 0; // To track the current index of items being displayed
const itemsPerPage = 10; // Number of items to load per click

// URL to the JSON file
const jsonUrl = 'items.json'; 

// Fetch JSON data
async function fetchItems() {
    try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        return data.items; // Adjust this if your JSON structure is different
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

// Function to create a flip card element
function createFlipCard(item) {
    // Determine whether to show the "Add to Cart" button
    const addToCartButton = item.stock > 0 
        ? `<button class="add-to-cart">Add to Cart</button>` 
        : '';

    return `
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${item.image}" alt="${item.title}">
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


// Function to load more items
async function loadMoreItems() {
    const gridContainer = document.querySelector('.grid-container');
    const items = await fetchItems(); // Fetch all items

    if (currentIndex >= items.length) {
        // No more items to load
        document.getElementById('load-more').style.display = 'none';
        return;
    }

    const itemsToLoad = items.slice(currentIndex, currentIndex + itemsPerPage);
    itemsToLoad.forEach(item => {
        gridContainer.innerHTML += createFlipCard(item);
    });

    currentIndex += itemsPerPage;
}

// Event listener for the "Load More" button
document.getElementById('load-more').addEventListener('click', loadMoreItems);

// Initial load
loadMoreItems();
