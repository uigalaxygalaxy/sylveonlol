
// DOM Elements
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const subtotalElement = document.getElementById('subtotal');
const addToCartButtons = document.querySelectorAll('.addToCart');

// Cart Data
let cart = loadCart(); // Load cart from localStorage

// Load Cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Toggle Cart Panel
cartButton.addEventListener('click', () => {
    cartPanel.classList.toggle('active');
});

closeCart.addEventListener('click', () => {
    cartPanel.classList.remove('active');
});

// Quantity Controls for Products
document.querySelectorAll('.product').forEach(product => {
    const decreaseButton = product.querySelector('.decrease');
    const increaseButton = product.querySelector('.increase');
    const quantityInput = product.querySelector('.quantity');

    // Decrease Quantity
    decreaseButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value, 10);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    // Increase Quantity
    increaseButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value, 10);
        quantityInput.value = currentValue + 1;
    });

    // Ensure quantity doesn't go below 1
    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) {
            quantityInput.value = 1;
        }
    });
});

// Add to Cart Functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.closest('.product');
        const productName = button.getAttribute('data-name');
        const quantity = parseInt(product.querySelector('.quantity').value, 10);

        // Handle color options for Product 3
        let productPrice;
        let selectedColor = null;
        if (productName === "Ash's favorite Toy") {
            selectedColor = product.querySelector('input[name="color"]:checked');
            productPrice = parseFloat(selectedColor.getAttribute('data-price'));
        } else {
            productPrice = parseFloat(button.getAttribute('data-price'));
        }

        // Check if the item already exists in the cart
        const existingItem = cart.find(item => item.name === productName && (!item.color || item.color === selectedColor?.value));

        if (existingItem) {
            // Increase quantity if the item already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to cart
            const newItem = {
                name: productName,
                price: productPrice,
                quantity: quantity,
            };

            // Add color property for Product 3
            if (productName === "Ash's favorite Toy" && selectedColor) {
                newItem.color = selectedColor.value;
            }

            cart.push(newItem);
        }

        updateCartUI();
        saveCart(); // Save cart to localStorage

        // Show the cart panel
        cartPanel.classList.add('active');
    });
});

// Update Cart UI
function updateCartUI() {
    // Clear existing items (except the empty cart message)
    cartItems.innerHTML = '<p id="emptyCartMessage">Its getting lonely in here... <span style="font-family: Arial"> (´• ω •`)ﾉ </span>	</p>';

    // Update cart items
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
            <div>
            <div>
                <span style="font-family: B612; color: white; font-size: 16px; text-shadow: 0 0 8px rgba(255, 255, 255, 1);">${item.name}${item.color ? ` (${item.color})` : ''}</span>
                <span class="subtotalValue" style="font-size: 24px">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                            <div>
     <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="changeQuantity(${index}, 0, this.value)">
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItem(${index})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Update subtotal
    subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    subtotalElement.textContent = subtotal.toFixed(2);

    // Update cart button
    cartButton.innerHTML = ` CART: <span class="Money">(${cart.reduce((total, item) => total + item.quantity, 0)})</span><div class="cartBg"></div> `;
    // Show/hide empty cart message
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
    }
}

// Change Quantity Function
function changeQuantity(index, change, newValue) {
    if (newValue !== undefined) {
        // Update quantity based on input value
        cart[index].quantity = parseInt(newValue, 10);
    } else {
        // Update quantity based on increment/decrement
        cart[index].quantity += change;
    }

    // Remove item if quantity is less than 1
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }

    updateCartUI();
    saveCart(); // Save cart to localStorage
}

// Remove Item Function
function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCart(); // Save cart to localStorage
}

// Initialize Cart UI on Page Load
updateCartUI();

function adjustBestSellingItems() {
    const container = document.getElementById("bestsellingWrapper");
    const items = container.querySelectorAll(".bestSellingItemWrapper");
    const screenWidth = window.innerWidth;

    let maxVisible = 8; // Default (for large screens)

    if (screenWidth <= 1651) {
        maxVisible = Math.floor(screenWidth / 240);
    }

    // Show only the needed number of items
    items.forEach((item, index) => {
        item.style.display = index < maxVisible ? "grid" : "none";
    });
}

// Run on page load and window resize
window.addEventListener("load", adjustBestSellingItems);
window.addEventListener("resize", adjustBestSellingItems);

// Run function on load & resize
window.addEventListener('load', hideOverflowingItems);
window.addEventListener('resize', hideOverflowingItems);
