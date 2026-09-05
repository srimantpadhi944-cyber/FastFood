// ==========================================
// CHECKOUT SYSTEM
// ==========================================


// ==========================================
// LOAD CHECKOUT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCheckout();

    updateCartCount();

    setupCheckoutForm();

});


// ==========================================
// GET CART
// ==========================================

function getCheckoutCart() {

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];

}


// ==========================================
// LOAD CHECKOUT ITEMS
// ==========================================

function loadCheckout() {

    const cart = getCheckoutCart();

    const container =
        document.getElementById(
            "checkout-items"
        );


    // If cart is empty
    if (cart.length === 0) {

        container.innerHTML = `

            <div class="checkout-empty">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <a href="menu.html">
                    Go to Menu
                </a>

            </div>

        `;

        document.querySelector(
            ".place-order-btn"
        ).disabled = true;

        return;

    }


    container.innerHTML = "";


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        const div =
            document.createElement("div");


        div.className =
            "checkout-item";


        div.innerHTML = `

            <div class="checkout-item-info">

                <span class="checkout-emoji">
                    ${item.emoji}
                </span>

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ₹${item.price} ×
                        ${item.quantity}
                    </p>

                </div>

            </div>


            <strong>
                ₹${itemTotal}
            </strong>

        `;


        container.appendChild(div);

    });


    updateCheckoutTotal(cart);

}


// ==========================================
// CALCULATE TOTAL
// ==========================================

function updateCheckoutTotal(cart) {

    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    // Delivery rules
    const delivery =
        subtotal >= 499
            ? 0
            : 40;


    const total =
        subtotal + delivery;


    document.getElementById(
        "checkout-subtotal"
    ).textContent =
        `₹${subtotal}`;


    document.getElementById(
        "checkout-delivery"
    ).textContent =
        delivery === 0
            ? "FREE"
            : `₹${delivery}`;


    document.getElementById(
        "checkout-total"
    ).textContent =
        `₹${total}`;

}


// ==========================================
// FORM
// ==========================================

function setupCheckoutForm() {

    const form =
        document.getElementById(
            "checkout-form"
        );


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            placeOrder();

        }
    );

}


// ==========================================
// PLACE ORDER
// ==========================================

function placeOrder() {

    const cart = getCheckoutCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty!"
        );

        return;

    }


    // ================================
    // CUSTOMER INFORMATION
    // ================================

    const name =
        document.getElementById(
            "customer-name"
        ).value.trim();


    const phone =
        document.getElementById(
            "customer-phone"
        ).value.trim();


    const email =
        document.getElementById(
            "customer-email"
        ).value.trim();


    const address =
        document.getElementById(
            "customer-address"
        ).value.trim();


    const city =
        document.getElementById(
            "customer-city"
        ).value.trim();


    // ================================
    // VALIDATION
    // ================================

    if (
        name === "" ||
        phone === "" ||
        address === "" ||
        city === ""
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    // Phone validation
    const phonePattern =
        /^[6-9][0-9]{9}$/;


    if (!phonePattern.test(phone)) {

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;

    }


    // ================================
    // DELIVERY
    // ================================

    const delivery =
        document.querySelector(
            'input[name="delivery"]:checked'
        ).value;


    // ================================
    // PAYMENT
    // ================================

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    // ================================
    // TOTAL
    // ================================

    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    const deliveryCharge =
        subtotal >= 499
            ? 0
            : 40;


    const total =
        subtotal + deliveryCharge;


    // ================================
    // ORDER ID
    // ================================

    const orderId =
        "FB" +
        Date.now().toString().slice(-6);


    // ================================
    // CREATE ORDER
    // ================================

    const order = {

        id: orderId,

        customer: {

            name: name,

            phone: phone,

            email: email,

            address: address,

            city: city

        },

        deliveryOption:
            delivery,

        paymentMethod:
            payment,

        items: cart,

        subtotal: subtotal,

        deliveryCharge:
            deliveryCharge,

        total: total,

        status: "Pending",

        date:
            new Date().toISOString()

    };


    // ================================
    // SAVE ORDER
    // ================================

    let orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    // ================================
    // SAVE LAST ORDER
    // ================================

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    // ================================
    // CLEAR CART
    // ================================

    localStorage.removeItem("cart");


    // ================================
    // OPEN SUCCESS PAGE
    // ================================

    window.location.href =
        "order-success.html";

}


// ==========================================
// CART COUNTER
// ==========================================

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    if (!cartCount) return;


    const cart =
        getCheckoutCart();


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    cartCount.textContent =
        total;

}


// ==========================================
// CART PAGE
// ==========================================

function goToCart() {

    window.location.href =
        "cart.html";

}