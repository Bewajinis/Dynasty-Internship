// Open & close cart
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const closeCart = document.querySelector('#cart-close');

cartIcon.addEventListener('click', () => {
    cart.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cart.classList.remove('active');
});

// Start when the document is ready
if (document.readyState == "loading") {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}

// Start
function start() {
    addEvents();
}

// Update and Renders
function update() {
    addEvents();
    updateTotal();
}

// Add Events
function addEvents() {
    // Remove items from cart
    let cartRemove_btns = document.querySelectorAll('.cart-remove');
    cartRemove_btns.forEach(btn => {
        btn.addEventListener('click', handle_removeCartItem);
    });

    // Change item quantity
    let cartQuantity_inputs = document.querySelectorAll('.cart-quantity');
    cartQuantity_inputs.forEach(input => {
        input.addEventListener('change', handle_changeItemQuantity);
    });

    // Add item to cart
    let addCart_btns = document.querySelectorAll('.add-cart');
    addCart_btns.forEach(btn => {
        btn.addEventListener("click", handle_addCartItem);
    });

    // Buy Order
    const buy_btn = document.querySelector('.btn-buy');
    buy_btn.addEventListener('click', handle_buyOrder);
}

// Handle Events Functions
let itemsAdded = [];

function handle_addCartItem() {
    let product = this.parentElement;
    let title = product.querySelector('.product-title').innerHTML;
    let price = product.querySelector('.product-price').innerHTML;
    let ImgSrc = product.querySelector('.product-img').src;

    let newToAdd = {
        title,
        price,
        ImgSrc,
    };

    // Handle duplicate items
    if (itemsAdded.find(el => el.title == newToAdd.title)) {
        alert("This item already exists!");
        return;
    }

    itemsAdded.push(newToAdd);

    // Add product to cart
    let cartBoxElement = CartBoxComponent(title, price, ImgSrc);
    let newNode = document.createElement('div');
    newNode.innerHTML = cartBoxElement;
    const cartContent = cart.querySelector('.cart-content');
    cartContent.appendChild(newNode);

    update();
    updateCartCount();
}



function handle_removeCartItem() {
    this.parentElement.remove();
    itemsAdded = itemsAdded.filter(el => el.title != this.parentElement.querySelector('.cart-product-title').innerHTML);

    update();
    updateCartCount();
}

function handle_changeItemQuantity() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    }
    this.value = Math.floor(this.value); // Ensure integer values only

    update();
}

function handle_buyOrder() {
    if (itemsAdded.length <= 0) {
        showTemporaryAlert('❌ There is no order to place yet. Please add items to your cart.', 3000);
        return;
    }

    // Get the total price from the cart
    const totalElement = document.querySelector('.total-price').innerHTML;

    // Remove currency symbols, commas, and spaces
    const totalPrice = parseFloat(totalElement.replace(/[₦#,]/g, '').trim());

    // Prompt user for email with validation
    let email = prompt("Please enter your email address:");
    if (!validateEmail(email)) return;

    // Prompt user for amount with validation
    let amount;
    do {
        amount = prompt(`Enter the total amount to pay (₦${totalPrice.toFixed(2)}):`);
        amount = parseFloat(amount.replace(/[₦#,]/g, '').trim());

        if (isNaN(amount) || amount !== totalPrice) {
            showTemporaryAlert(`❌ Incorrect amount. Please enter the exact total price: ₦${totalPrice.toFixed(2)}`, 3000);
        }
    } while (isNaN(amount) || amount !== totalPrice);

    // Proceed to payment if the correct amount is provided
    payWithPaystack(email, totalPrice);

    // Clear the cart after successful payment
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = "";
    itemsAdded = [];

    // Reset cart count to zero
    updateCartCount(); 
    update();
}

// Email validation function
function validateEmail(email) {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        showTemporaryAlert("❌ Invalid email format. Please enter a valid email.", 3000);
        return false;
    }
    return true;
}