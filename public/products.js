// Store products globally after fetching
let products = [];

// Fetch and display products when page loads
document.addEventListener('DOMContentLoaded', async () => {
    products = await fetchProducts();
    renderProducts(products);
    
    // Initialize event listeners after products are loaded
    const filterOptions = document.querySelectorAll('.filter-option input');
    filterOptions.forEach(option => {
        option.addEventListener('change', applyFilters);
    });
});

/**
 * Fetch products from the backend based on the selected category
 * @param {string} category - Category to filter products by
 * @returns {Array} - Array of products
 */
async function fetchProducts(category) {
    const url = category === 'All' || !category
        ? '/api/products' // If no category is selected, fetch all products
        : `/api/products?category=${encodeURIComponent(category)}`; // Encode category for URL

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * Filter products based on the selected category
 * @param {string} category - Category to filter products by
 */
async function filterProducts(categories) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<p>Loading products...</p>';

    // If no category is selected, show all products
    if (!categories || categories.length === 0) {
        // If you want fresh fetch, uncomment the next line:
        // products = await fetchProducts(); 
        renderProducts(products);
        return;
    }

    // Filter products by selected categories
    const filteredProducts = products.filter(product => categories.includes(product.category));
    renderProducts(filteredProducts);
}


/**
 * Render products on the page
 * @param {Array} products - List of products to render
 */
function renderProducts(products) {
    const productList = document.getElementById('product-list');

    if (!products || products.length === 0) {
        productList.innerHTML = '<p>No products found in this category.</p>';
        return;
    }

    productList.innerHTML = ''; // Clear previous content
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price} / ${product.unit}</p>
            <div class="quantity-controls">
                <button class="quantity-btn minus" onclick="decrementQuantity(${product.id})">-</button>
                <input type="number" min="0" value="0" id="qty-${product.id}" class="quantity-input" readonly>
                <button class="quantity-btn plus" onclick="incrementQuantity(${product.id})">+</button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(card);
    });
}

function applyFilters() {
    const selectedOptions = document.querySelectorAll('.filter-option input:checked');
    const selectedCategories = Array.from(selectedOptions).map(option => option.value);

    filterProducts(selectedCategories);
}



/**
 * Filter products based on the selected categories
 */


// Quantity and cart functions remain the same
function incrementQuantity(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function decrementQuantity(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
        quantityInput.value = currentValue - 1;
    }
}

// Replace your existing cart functions with these:

async function addToCart(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (quantity === 0) {
        alert('Please select at least 1 item to add to cart.');
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            }),
            credentials: 'include' // Important for sending cookies
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add to cart');
        }

        alert(`Added ${quantity} item(s) to cart!`);
        quantityInput.value = 0;
        
        // Optional: Refresh cart display if you have one
        // await updateCartDisplay();
        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to add to cart');
    }
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove from cart');
        }

        alert('Item removed from cart!');
        // Optional: Refresh cart display
        // await updateCartDisplay();
        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to remove from cart');
    }
}

// Optional: Function to display cart items
async function updateCartDisplay() {
    try {
        const response = await fetch('/api/cart', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cartItems = await response.json();
        // Implement your cart display logic here
        console.log('Cart items:', cartItems);
        
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

