let selectedCategory = "all";


// ===============================
// LOAD MENU
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    displayProducts(products);

    setupFilters();

    setupSearch();

    updateCartCount();

});


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(productList) {

    const productGrid =
        document.getElementById("product-grid");

    const productCount =
        document.getElementById("product-count");

    const noProducts =
        document.getElementById("no-products");


    productGrid.innerHTML = "";


    productCount.textContent =
        `${productList.length} items`;


    if (productList.length === 0) {

        noProducts.style.display = "block";

        return;

    }


    noProducts.style.display = "none";


    productList.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                ${
                    product.badge
                    ? `<span class="product-badge">
                        ${product.badge}
                       </span>`
                    : ""
                }

                <span class="food-emoji">
                    ${product.emoji}
                </span>

            </div>


            <div class="product-info">

                <div class="product-rating">
                    ⭐ ${product.rating}
                </div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <strong>
                        ₹${product.price}
                    </strong>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        + Add
                    </button>

                </div>

            </div>

        `;


        productGrid.appendChild(card);

    });

}


// ===============================
// CATEGORY FILTER
// ===============================

function setupFilters() {

    const buttons =
        document.querySelectorAll(".filter-btn");


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            selectedCategory =
                button.dataset.category;


            filterProducts();

        });

    });

}


// ===============================
// SEARCH
// ===============================

function setupSearch() {

    const searchInput =
        document.getElementById("search-input");


    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


// ===============================
// FILTER PRODUCTS
// ===============================

function filterProducts() {

    const searchInput =
        document.getElementById("search-input");


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    let filtered =
        products.filter(product => {

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    displayProducts(filtered);

}


// ===============================
// ADD TO CART
// ===============================

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            emoji: product.emoji,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showAddedMessage(product.name);

}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");


    if (!cartCount) return;


    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    cartCount.textContent = total;

}


// ===============================
// ADD MESSAGE
// ===============================

function showAddedMessage(productName) {

    alert(
        `${productName} added to cart!`
    );

}


// ===============================
// GO TO CART
// ===============================

function goToCart() {

    window.location.href =
        "cart.html";

}