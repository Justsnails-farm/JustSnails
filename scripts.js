// Add this inside script.js
function calculateTotal() {
  const pricePerKg = 3500; // ₦3,500 per kg
  const kgInput = document.getElementById('kg').value;
  const totalPriceElement = document.getElementById('totalPrice');
  
  const total = kgInput * pricePerKg;
  
  // Update the text in HTML formatted with commas
  totalPriceElement.innerText = "₦" + total.toLocaleString();
}

let cart = JSON.parse(localStorage.getItem('justsnails_cart')) || [];

// Run updateCartUI immediately when the page loads to show the correct saved number
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Save the current cart array to the browser's memory
function saveCart() {
    localStorage.setItem('justsnails_cart', JSON.stringify(cart));
}

// Toggle Cart Sidebar Open/Close
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
}

// Add item to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    saveCart(); // Save changes
    updateCartUI();
    
    // Automatically open drawer when item is added
    document.getElementById('cart-drawer').classList.add('open');
}

// Change quantity (+ / -)
function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart(); // Save changes
    updateCartUI();
}

// Refresh Cart Display
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('cart-total-price');

    // Calculate total quantity & total price
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.innerText = totalItems;
    totalPriceEl.innerText = "₦" + totalPrice.toLocaleString();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <div>₦${item.price.toLocaleString()} × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

// Send cart order to WhatsApp
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phoneNumber = "2348000000000"; // Replace with your actual WhatsApp phone number
    let message = "Hi JustSnails Farm! I'd like to place an order:\n\n";

    let grandTotal = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;
        message += `${index + 1}. ${item.name} x${item.quantity} - ₦${itemTotal.toLocaleString()}\n`;
    });

    message += `\n*Total Order Value:* ₦${grandTotal.toLocaleString()}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear the cart after they hit checkout so they don't accidentally order twice
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart(); // Close the drawer
}