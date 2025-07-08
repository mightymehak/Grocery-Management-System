// Load cart from backend
async function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
  
    cartItemsContainer.innerHTML = '';
  
    try {
      const res = await fetch('/api/cart');
      const cartItems = await res.json();
  
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
      }
  
      cartEmptyMessage.style.display = 'none';
      cartSummary.style.display = 'block';
  
      let subtotal = 0;
  
      cartItems.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        subtotal += parseFloat(itemTotal);
  
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
          <div class="product-info">
            <div class="product-details">
              <h3>${item.name}</h3>
              <p>${item.unit}</p>
            </div>
          </div>
          <div class="product-price">₹${item.price.toFixed(2)}</div>
          <div class="product-quantity">
            <div class="quantity-controls">
              <button class="quantity-btn minus" onclick="updateCartItem(${item.product_id}, ${item.quantity - 1})">-</button>
              <input type="number" min="1" value="${item.quantity}" id="cart-qty-${item.product_id}" class="quantity-input" readonly>
              <button class="quantity-btn plus" onclick="updateCartItem(${item.product_id}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <div class="product-total">₹${itemTotal}</div>
          <div class="product-action">
            <button class="remove-btn" onclick="removeFromCart(${item.product_id})">Remove</button>
          </div>
        `;
  
        cartItemsContainer.appendChild(cartItemElement);
      });
  
      updateSummary(subtotal);
  
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  async function proceedToCheckout() {
    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await res.json();

        if (res.ok) {
            window.location.href = 'checkout.html'; 
        } else {
            alert('Checkout failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout.');
    }
}


// Add event listener to checkout button
document.querySelector('.checkout-btn').addEventListener('click', proceedToCheckout);
  
  // Update cart item quantity on backend
  async function updateCartItem(productId, newQuantity) {
    if (newQuantity < 1) return;

    try {
      await fetch(`/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      loadCart();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }
  
  // Remove item from backend cart
  async function removeFromCart(productId) {
    try {
      await fetch(`/api/cart/${productId}`, {
        method: 'DELETE'
      });
      loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
  
  // Update summary section
  function updateSummary(subtotal) {
    const taxRate = 0.1;
    const tax = (subtotal * taxRate).toFixed(2);
    const total = (subtotal + parseFloat(tax)).toFixed(2);
  
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax}`;
    document.getElementById('total').textContent = `₹${total}`;
  }
  
  document.addEventListener('DOMContentLoaded', loadCart);

  // Proceed to checkout


