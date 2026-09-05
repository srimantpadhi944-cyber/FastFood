// FastBite main JavaScript

document.addEventListener("DOMContentLoaded", () => {

    // Get existing cart from localStorage
    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    // Update cart counter
    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = totalItems;
    }

});