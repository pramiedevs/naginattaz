document.addEventListener('DOMContentLoaded', () => {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartButton = document.getElementById('cart-button');
    const checkoutButton = document.getElementById('checkout-button');
    const closeDrawerButton = document.getElementById('close-drawer');
    const cart = {}; // Object to store cart items with their quantities
    let jsonData = null; // Global variable to hold JSON data

    // Function to update the cart quantity display
    function updateCartButtonQuantity() {
        if (!cartButton) {
            console.error('Cart button not found!');
            return;
        }
        const totalQuantity = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
        
        // Update only the quantity text node, preserve existing HTML structure
        const quantityElement = cartButton.querySelector('.cart-quantity');
        if (quantityElement) {
            quantityElement.textContent = `(${totalQuantity})`;
        } else {
            // Create a new quantity element if it doesn't exist
            cartButton.insertAdjacentHTML('beforeend', ` <span class="cart-quantity">(${totalQuantity})</span>`);
        }
    }

    // Function to render cart items
    function renderCart() {
        if (!cartItemsContainer) {
            console.error('Cart items container not found!');
            return;
        }
        cartItemsContainer.innerHTML = ''; // Clear previous items
        let totalPrice = 0;
    
        for (const [itemId, item] of Object.entries(cart)) {
            const itemHTML = `
                <div class="cart-item" data-id="${itemId}">
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.title}" style="width:50px">
                        <div>
                            <h4>${item.title}</h4>
                            <p>${item.price}</p>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="increase-quantity">+</button>
                        <button class="decrease-quantity">-</button>
                        <button class="remove-item">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
            totalPrice += parseFloat(item.price.replace('$', '')) * item.quantity;
        }
    
        // Update total price
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        } else {
            console.error('Total price element not found!');
        }
    
        // Update the cart button quantity display
        updateCartButtonQuantity();
    }

    // Add item to cart
    function addToCart(item) {
        if (!jsonData) {
            console.error('JSON data not loaded');
            return;
        }

        const itemId = item.title; // Assuming title is unique

        // Find the item in the JSON data
        const itemInJson = jsonData.items.find(i => i.title === itemId);
        
        if (!itemInJson) {
            console.error('Item not found in JSON data');
            return;
        }

        // Check if the item is already in the cart
        if (cart[itemId]) {
            // Check if we can increase the quantity based on the stock
            if (cart[itemId].quantity < parseInt(itemInJson.stock, 10)) {
                cart[itemId].quantity += 1;
            } else {
                console.log('Cannot increase quantity. Stock limit reached.');
                return;
            }
        } else {
            // Add new item to the cart
            cart[itemId] = {
                image: item.image,
                title: item.title,
                price: item.price,
                quantity: 1,
                stock: itemInJson.stock // Initialize with stock value
            };
        }
        
        console.log('Cart updated:', cart); // Debugging
        renderCart();
    }

    // Handle cart actions
    function handleCartAction(event) {
        const target = event.target;
        if (!target.closest('.cart-item-actions')) return;
    
        const itemElement = target.closest('.cart-item');
        if (!itemElement) return;
    
        const itemId = itemElement.getAttribute('data-id');
        const item = cart[itemId];
    
        if (!item) {
            console.error('Item not found in cart:', itemId);
            return;
        }
    
        if (target.classList.contains('increase-quantity')) {
            if (item.quantity < item.stock) {
                item.quantity += 1;
            } else {
                console.log('Cannot increase quantity. Stock limit reached.');
                return;
            }
        } else if (target.classList.contains('decrease-quantity')) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                delete cart[itemId];
            }
        } else if (target.classList.contains('remove-item')) {
            delete cart[itemId];
        }
        renderCart();
    }

    // Fetch and load JSON data
    async function loadJsonData() {
        try {
            const response = await fetch('items.json'); // Adjust the path as needed
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            jsonData = await response.json();
            console.log('JSON Data loaded:', jsonData); // Debugging
            renderCart(); // Optionally render the cart with updated data
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    }

    // Function to update stock on checkout
    async function updateStockOnCheckout() {
        try {
            const response = await fetch('http://localhost:5500/update-stock', { // Update URL if needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: Object.values(cart) }) // Send cart items in the request body
            });
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Stock updated successfully:', data);
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    }
    
    // Assuming you have a button with id 'checkout-button' to trigger stock update
    document.getElementById('checkout-button').addEventListener('click', updateStockOnCheckout);
    

    // Add event listeners
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const item = {
                image: event.target.dataset.image,
                title: event.target.dataset.title,
                price: event.target.dataset.price,
                stock: event.target.dataset.stock
            };
            addToCart(item);
        } else if (event.target.classList.contains('increase-quantity') ||
                   event.target.classList.contains('decrease-quantity') ||
                   event.target.classList.contains('remove-item')) {
            handleCartAction(event);
        }
    });

    // Open and close drawer
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            cartDrawer.classList.toggle('show');
        });
    }

    if (closeDrawerButton) {
        closeDrawerButton.addEventListener('click', () => {
            cartDrawer.classList.remove('show');
        });
    }

    // Checkout button navigation
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // Perform checkout
            updateStockOnCheckout(); // Call function to update stock
        });
    }

    // Initialize
    loadJsonData(); // Load JSON data after all functions are defined
});
