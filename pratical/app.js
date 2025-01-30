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
        alert('There is no order to place yet. Please add items to your cart.');
        return;
    }

    // Get the total price from the cart
    const totalElement = document.querySelector('.total-price').innerHTML;
    
    // Remove currency symbol (#), commas, and spaces, then parse to float
    const totalPrice = parseFloat(totalElement.replace(/[₦#,]/g, '').trim());

    // Prompt user for email (ensure it's provided)
    let email = prompt("Please enter your email address:");
    while (!email) {
        alert("Email is required to proceed.");
        email = prompt("Please enter your email address:");
    }

    // Validate email format
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    while (!emailPattern.test(email)) {
        alert("Invalid email format. Please enter a valid email.");
        email = prompt("Please enter your email address:");
    }

    // Keep prompting until the correct amount is entered
    let amount;
    do {
        amount = prompt(`Enter the total amount to pay (₦${totalPrice.toFixed(2)}):`);
        
        // Remove commas, currency symbols, and spaces from input
        amount = parseFloat(amount.replace(/[₦#,]/g, '').trim());

        if (isNaN(amount) || amount !== totalPrice) {
            alert(`❌ Incorrect amount. Please enter the exact total price: ₦${totalPrice.toFixed(2)}`);
        }
    } while (isNaN(amount) || amount !== totalPrice);

    // Proceed to payment if the correct amount is provided
    payWithPaystack(email, totalPrice);

    // Clear the cart after successful payment
    const cartContent = cart.querySelector('.cart-content');
    cartContent.innerHTML = "";
    alert("✅ Your order has been placed successfully!"); 
    itemsAdded = [];

    update();
}


// Update total price
function updateTotal() {
    let cartBoxes = document.querySelectorAll('.cart-box');
    const totalElement = cart.querySelector('.total-price');
    let total = 0;

    cartBoxes.forEach(cartBox => {
        let priceElement = cartBox.querySelector('.cart-price');
        let price = parseFloat(priceElement.innerHTML.replace(/[#,]/g, ''));
        let quantity = cartBox.querySelector('.cart-quantity').value;
        
        total += price * quantity;
    });

    totalElement.innerHTML = `#${total.toFixed(2)}`;
}

// Updating cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('#cart-count');
    cartCountElement.textContent = itemsAdded.length;
}

// HTML components
function CartBoxComponent(title, price, ImgSrc) {
    return `
        <div class="cart-box">
            <img src=${ImgSrc} alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class="bx bxs-trash-alt cart-remove"></i>
        </div>`;
}

// Paystack payment function
function payWithPaystack(email, amount) {
    let handler = PaystackPop.setup({
        key: 'pk_test_353ab3a55e63e69dda077c9f8e6361cac84db427',
        email: email,
        amount: amount * 100, 
        currency: "NGN",
        ref: '' + Math.floor((Math.random() * 100000000) + 1),

        onClose: function () {
            alert('Payment window closed.');
        },
        callback: function (response) {
            let message = 'Payment complete! Reference: ' + response.reference;
            alert(message);
        }
    });

    handler.openIframe();
}
