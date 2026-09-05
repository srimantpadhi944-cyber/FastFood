// ========================================
// ADMIN AUTHENTICATION
// ========================================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {

    window.location.href = "login.html";

}


// ========================================
// GET ORDERS
// ========================================

function getOrders() {

    return JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

}


// ========================================
// LOAD DASHBOARD
// ========================================

function loadOrders() {

    const orders = getOrders();

    const tableBody =
        document.getElementById("ordersTableBody");

    tableBody.innerHTML = "";


    // Statistics

    document.getElementById("totalOrders").textContent =
        orders.length;


    const pendingCount = orders.filter(
        order => order.status === "Pending"
    ).length;

    document.getElementById("pendingOrders").textContent =
        pendingCount;


    const deliveredCount = orders.filter(
        order => order.status === "Delivered"
    ).length;

    document.getElementById("deliveredOrders").textContent =
        deliveredCount;


    const totalSales = orders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    document.getElementById("totalSales").textContent =
        `₹${totalSales}`;


    // Empty State

    if (orders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-orders">
                    📦 No orders found
                </td>
            </tr>
        `;

        return;
    }


    // Latest orders first

    const sortedOrders = [...orders].reverse();


    sortedOrders.forEach(order => {

        const itemCount = order.items.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${order.id}</strong>
            </td>

            <td>
                ${order.customer.name}
            </td>

            <td>
                ${itemCount} item(s)
            </td>

            <td>
                <strong>₹${order.total}</strong>
            </td>

            <td>
                ${order.paymentMethod}
            </td>

            <td>

                <select
                    class="status-select"
                    onchange="updateOrderStatus('${order.id}', this.value)"
                >

                    <option value="Pending"
                        ${order.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="Confirmed"
                        ${order.status === "Confirmed" ? "selected" : ""}>
                        Confirmed
                    </option>

                    <option value="Preparing"
                        ${order.status === "Preparing" ? "selected" : ""}>
                        Preparing
                    </option>

                    <option value="Out for Delivery"
                        ${order.status === "Out for Delivery" ? "selected" : ""}>
                        Out for Delivery
                    </option>

                    <option value="Delivered"
                        ${order.status === "Delivered" ? "selected" : ""}>
                        Delivered
                    </option>

                    <option value="Cancelled"
                        ${order.status === "Cancelled" ? "selected" : ""}>
                        Cancelled
                    </option>

                </select>

            </td>

            <td>
                ${formatDate(order.date)}
            </td>

            <td>

                <button
                    class="view-order-btn"
                    onclick="viewOrder('${order.id}')"
                >
                    👁️ View
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ========================================
// UPDATE ORDER STATUS
// ========================================

function updateOrderStatus(orderId, newStatus) {

    const orders = getOrders();

    const orderIndex = orders.findIndex(
        order => order.id === orderId
    );


    if (orderIndex === -1) {
        return;
    }


    orders[orderIndex].status = newStatus;


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    loadOrders();

}


// ========================================
// VIEW ORDER
// ========================================

function viewOrder(orderId) {

    const orders = getOrders();

    const order = orders.find(
        order => order.id === orderId
    );


    if (!order) {
        return;
    }


    const details =
        document.getElementById("orderDetails");


    const itemsHTML = order.items.map(item => `

        <div class="modal-item">

            <span>
                ${item.emoji || "🍔"}
                ${item.name}
                × ${item.quantity || 1}
            </span>

            <strong>
                ₹${Number(item.price) * Number(item.quantity || 1)}
            </strong>

        </div>

    `).join("");


    details.innerHTML = `

        <div class="customer-info">

            <h3>👤 Customer Information</h3>

            <p>
                <strong>Name:</strong>
                ${order.customer.name}
            </p>

            <p>
                <strong>Phone:</strong>
                ${order.customer.phone}
            </p>

            <p>
                <strong>Email:</strong>
                ${order.customer.email || "Not provided"}
            </p>

            <p>
                <strong>Address:</strong>
                ${order.customer.address}
            </p>

            <p>
                <strong>City:</strong>
                ${order.customer.city}
            </p>

        </div>


        <div class="modal-order-info">

            <h3>📦 Order Information</h3>

            <p>
                <strong>Order ID:</strong>
                ${order.id}
            </p>

            <p>
                <strong>Delivery:</strong>
                ${order.deliveryOption}
            </p>

            <p>
                <strong>Payment:</strong>
                ${order.paymentMethod}
            </p>

            <p>
                <strong>Status:</strong>
                ${order.status}
            </p>

            <p>
                <strong>Date:</strong>
                ${formatDate(order.date)}
            </p>

        </div>


        <div class="modal-items">

            <h3>🍔 Ordered Items</h3>

            ${itemsHTML}

        </div>


        <div class="modal-total">

            <span>Subtotal</span>
            <strong>₹${order.subtotal}</strong>

        </div>


        <div class="modal-total">

            <span>Delivery</span>
            <strong>
                ${order.deliveryCharge === 0
                    ? "FREE"
                    : "₹" + order.deliveryCharge}
            </strong>

        </div>


        <div class="modal-total grand">

            <span>Total</span>
            <strong>₹${order.total}</strong>

        </div>

    `;


    document
        .getElementById("orderModal")
        .classList.add("show");

}


// ========================================
// CLOSE MODAL
// ========================================

function closeOrderModal() {

    document
        .getElementById("orderModal")
        .classList.remove("show");

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    return new Date(date).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// ========================================
// LOGOUT
// ========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function () {

        sessionStorage.removeItem("adminLoggedIn");

        window.location.href = "login.html";

    });


// ========================================
// INITIAL LOAD
// ========================================

loadOrders();