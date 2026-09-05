// ======================================
// CART SYSTEM
// ======================================


// Load cart when page opens
document.addEventListener("DOMContentLoaded", () => {

    loadCart();

    updateCartCount();

});


// ======================================
// GET CART
// ======================================

function getCart() {

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];

}


// ======================================
// SAVE CART
// ======================================

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ======================================
// LOAD CART
// ======================================

function loadCart() {

    const cart = getCart();

    const container =
        document.getElementById(
            "cart-items-container"
        );

    const cartLayout =
        document.getElementById(
            "cart-layout"
        );

    const emptyCart =
        document.getElementById(
            "empty-cart"
        );


    // Empty cart
    if (cart.length === 0) {

        cartLayout.style.display = "none";

        emptyCart.style.display = "block";

        updateSummary([]);

        return;

    }


    cartLayout.style.display = "grid";

    emptyCart.style.display = "none";


    container.innerHTML = "";


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-product">

                <div class="cart-product-image">
                    ${item.emoji}
                </div>

                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price} each
                    </p>

                </div>

            </div>


            <div class="cart-quantity">

                <button
                    onclick="decreaseQuantity(${item.id})"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${item.id})"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                <strong>
                    ₹${itemTotal}
                </strong>

                <button
                    class="remove-btn"
                    onclick="removeItem(${item.id})"
                >
                    🗑
                </button>

            </div>

        `;


        container.appendChild(cartItem);

    });


    updateSummary(cart);

}


// ======================================
// INCREASE QUANTITY
// ======================================

function increaseQuantity(productId) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (item) {

        item.quantity += 1;

    }


    saveCart(cart);

    loadCart();

    updateCartCount();

}


// ======================================
// DECREASE QUANTITY
// ======================================

function decreaseQuantity(productId) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    if (item.quantity > 1) {

        item.quantity -= 1;

    } else {

        const index =
            cart.findIndex(
                item => item.id === productId
            );

        cart.splice(index, 1);

    }


    saveCart(cart);

    loadCart();

    updateCartCount();

}


// ======================================
// REMOVE ITEM
// ======================================

function removeItem(productId) {

    let cart = getCart();


    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart(cart);

    loadCart();

    updateCartCount();

}


// ======================================
// CLEAR CART
// ======================================

function clearCart() {

    const cart = getCart();


    if (cart.length === 0) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem("cart");


    loadCart();

    updateCartCount();

}


// ======================================
// UPDATE SUMMARY
// ======================================

function updateSummary(cart) {

    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    // Free delivery above ₹499
    const delivery =
        subtotal === 0
            ? 0
            : subtotal >= 499
                ? 0
                : 40;


    const total =
        subtotal + delivery;


    document.getElementById(
        "subtotal"
    ).textContent =
        `₹${subtotal}`;


    document.getElementById(
        "delivery"
    ).textContent =
        delivery === 0 && subtotal >= 499
            ? "FREE"
            : `₹${delivery}`;


    document.getElementById(
        "grand-total"
    ).textContent =
        `₹${total}`;

}


// ======================================
// UPDATE CART COUNTER
// ======================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) return;


    const cart = getCart();


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;

}


// ======================================
// GO TO CART
// ======================================

function goToCart() {

    window.location.href =
        "cart.html";

}


// ======================================
// CHECKOUT
// ======================================

function proceedToCheckout() {

    const cart = getCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;

    }


    window.location.href =
        "checkout.html";

}