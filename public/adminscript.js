// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const logoutBtn = document.getElementById('logoutBtn');

// Billing Page Elements
const billingItemsTable = document.getElementById('billing-items');
const billTable = document.getElementById('bill-table');
const billItemsBody = document.getElementById('bill-items');
const billTotalAmount = document.getElementById('bill-total-amount');
const emptyCartDiv = document.getElementById('empty-cart');
const completeBillBtn = document.getElementById('complete-bill');
const customerNameInput = document.getElementById('customerName');
const customerNumberInput = document.getElementById('customerNumber');
const submitCustomerBtn = document.getElementById('submit-customer');

// Stock Page Elements
const stockTableBody = document.getElementById('stock-table-body');

// Orders Page Elements
const ordersTableBody = document.getElementById('orders-table-body');
const orderSearchInput = document.getElementById('orderSearch');
const orderDetailsModal = document.getElementById('order-details-modal');
const orderDetailsContent = document.getElementById('order-details-content');
const closeModalBtn = document.querySelector('.close');

// Global Variables
let currentCustomerId = null;
let cartItems = [];
let allProducts = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadProducts();
    loadStock();
    loadOrders();

    // Set up event listeners
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            switchPage(pageId);
        });
    });

    // Logout button
    logoutBtn.addEventListener('click', logoutAdmin);

    // Customer submission
    submitCustomerBtn.addEventListener('click', handleCustomerSubmission);

    // Complete bill button
    completeBillBtn.addEventListener('click', completeOrder);

    // Order search
    orderSearchInput.addEventListener('input', searchOrders);

    // Modal close button
    closeModalBtn.addEventListener('click', () => {
        orderDetailsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === orderDetailsModal) {
            orderDetailsModal.style.display = 'none';
        }
    });
}

// Page Navigation
function switchPage(pageId) {
    pages.forEach(page => {
        page.style.display = 'none';
    });

    navButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(`${pageId}-page`).style.display = 'block';
    document.querySelector(`.nav-btn[data-page="${pageId}"]`).classList.add('active');

    // Refresh page data when switched to
    if (pageId === 'stock') {
        loadStock();
    } else if (pageId === 'orders') {
        loadOrders();
    }
}

// Load Products for Billing
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products. Please try again.');
    }
}

function renderProducts(products) {
    billingItemsTable.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>Rs. ${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-add" data-product-id="${product.id}">Add to Bill</button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to all "Add to Bill" buttons
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Customer Handling
async function handleCustomerSubmission() {
    const name = customerNameInput.value.trim();
    const phone = customerNumberInput.value.trim();

    if (!name || !phone) {
        alert('Please enter both customer name and phone number');
        return;
    }

    try {
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone })
        });

        if (!response.ok) throw new Error('Failed to create customer');

        const data = await response.json();
        currentCustomerId = data.customerId;
        submitCustomerBtn.disabled = true;
        customerNameInput.disabled = true;
        customerNumberInput.disabled = true;
        
        alert('Customer created successfully. You can now add items to the bill.');
    } catch (error) {
        console.error('Error creating customer:', error);
        alert('Failed to create customer. Please try again.');
    }
}

// Cart Management
async function addToCart(event) {
    if (!currentCustomerId) {
        alert('Please submit customer details first');
        return;
    }

    const productId = event.target.dataset.productId;
    const product = allProducts.find(p => p.id == productId);

    if (!product) {
        alert('Product not found');
        return;
    }

    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.product_id == productId);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: currentCustomerId,
                productId: productId,
                quantity: 1 // Always add 1 at a time
            })
        });

        if (!response.ok) throw new Error('Failed to add to cart');

        // Update local cart
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cartItems.push({
                product_id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }

        updateCartDisplay();
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
}

function updateCartDisplay() {
    if (cartItems.length === 0) {
        emptyCartDiv.style.display = 'flex';
        billTable.style.display = 'none';
        billTotalAmount.style.display = 'none';
        completeBillBtn.style.display = 'none';
        return;
    }

    emptyCartDiv.style.display = 'none';
    billTable.style.display = 'table';
    billTotalAmount.style.display = 'block';
    completeBillBtn.style.display = 'block';

    // Calculate total
    let total = 0;
    
    billItemsBody.innerHTML = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <tr>
                <td>${item.name}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn" data-product-id="${item.product_id}" data-action="decrease">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" data-product-id="${item.product_id}" data-action="increase">+</button>
                    </div>
                </td>
                <td>Rs. ${item.price.toFixed(2)}</td>
                <td>Rs. ${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="btn-remove" data-product-id="${item.product_id}">Remove</button>
                </td>
            </tr>
        `;
    }).join('');

    // Update total
    document.getElementById('bill-total-amount').textContent = total.toFixed(2);

    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

async function handleQuantityChange(event) {
    const productId = event.target.dataset.productId;
    const action = event.target.dataset.action;
    const item = cartItems.find(item => item.product_id == productId);

    if (!item) return;

    let newQuantity = item.quantity;
    
    if (action === 'increase') {
        newQuantity += 1;
    } else if (action === 'decrease') {
        newQuantity -= 1;
        if (newQuantity < 1) {
            await removeFromCart({ target: { dataset: { productId } } });
            return;
        }
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: currentCustomerId,
                productId: productId,
                quantity: action === 'increase' ? 1 : -1
            })
        });

        if (!response.ok) throw new Error('Failed to update cart');

        item.quantity = newQuantity;
        updateCartDisplay();
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Failed to update item quantity. Please try again.');
    }
}

async function removeFromCart(event) {
    const productId = event.target.dataset.productId;

    try {
        const response = await fetch(`/api/cart/${currentCustomerId}/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to remove from cart');

        cartItems = cartItems.filter(item => item.product_id != productId);
        updateCartDisplay();
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Failed to remove item from cart. Please try again.');
    }
}

// Order Completion
async function completeOrder() {
    if (cartItems.length === 0) {
        alert('Cannot complete empty order');
        return;
    }

    if (!currentCustomerId) {
        alert('Customer information is missing');
        return;
    }

    try {
        completeBillBtn.disabled = true;
        completeBillBtn.textContent = 'Processing...';

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order payload
        const orderData = {
            customerId: currentCustomerId,
            items: cartItems,
            total: total
        };

        // Send order to server
        const response = await fetch('/api/orders/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to complete order');
        }

        // Clear frontend cart only after successful server response
        cartItems = [];
        updateCartDisplay();
        
        // Reset customer form
        currentCustomerId = null;
        customerNameInput.value = '';
        customerNumberInput.value = '';
        submitCustomerBtn.disabled = false;
        customerNameInput.disabled = false;
        customerNumberInput.disabled = false;

        // Reload data
        loadProducts();
        loadStock();
        loadOrders();

        alert('Order completed successfully!');
    } catch (error) {
        console.error('Error completing order:', error);
        alert(`Failed to complete order: ${error.message}`);
    } 
    }


// Stock Management
async function loadStock() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch stock');
        
        const products = await response.json();
        renderStock(products);
    } catch (error) {
        console.error('Error loading stock:', error);
        alert('Failed to load stock data. Please try again.');
    }
}

function renderStock(products) {
    stockTableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.stock}</td>
        </tr>
    `).join('');
}

// Order History
async function loadOrders() {
  
        // In a real system, you would fetch orders from an /api/orders endpoint
        // For now, we'll simulate with an empty array
        const orders = []; // Replace with actual API call
        
        renderOrders(orders);
}

function renderOrders(orders) {
    if (orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-orders">No orders found</td>
            </tr>
        `;
        return;
    }

    ordersTableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>Rs. ${order.total.toFixed(2)}</td>
            <td>
                <button class="btn-view-order" data-order-id="${order.id}">View Details</button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to view order buttons
    document.querySelectorAll('.btn-view-order').forEach(button => {
        button.addEventListener('click', viewOrderDetails);
    });
}

function searchOrders() {
    const searchTerm = orderSearchInput.value.toLowerCase();
    const rows = ordersTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function viewOrderDetails(event) {
    const orderId = event.target.dataset.orderId;
    
    // In a real system, you would fetch order details from the server
    // For now, we'll simulate with sample data
    const orderDetails = {
        id: orderId,
        customer: "Sample Customer",
        date: new Date().toLocaleString(),
        items: [
            { name: "Product 1", quantity: 2, price: 100 },
            { name: "Product 2", quantity: 1, price: 200 }
        ],
        total: 400
    };

    renderOrderDetails(orderDetails);
    orderDetailsModal.style.display = 'block';
}

function renderOrderDetails(order) {
    orderDetailsContent.innerHTML = `
        <h3>Order #${order.id}</h3>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        
        <h4>Items:</h4>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs. ${item.price.toFixed(2)}</td>
                        <td>Rs. ${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="order-total">
            <p><strong>Order Total:</strong> Rs. ${order.total.toFixed(2)}</p>
        </div>
    `;
}

// Admin Logout
function logoutAdmin() {
    // Clear cookies (assuming you're using the same cookie names as in your server)
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirect to login page
    window.location.href = '/adminlogin.html';
}