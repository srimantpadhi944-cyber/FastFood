// ========================================
// ORDER TRACKING
// ========================================

const trackingForm =
    document.getElementById("trackingForm");

const orderIdInput =
    document.getElementById("orderIdInput");

const trackingError =
    document.getElementById("trackingError");

const orderResult =
    document.getElementById("orderResult");


// ========================================
// GET ORDERS
// ========================================

function getOrders() {

    return JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

}


// ========================================
// TRACK ORDER
// ========================================

trackingForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const orderId =
            orderIdInput.value.trim().toUpperCase();


        trackingError.textContent = "";

        orderResult.innerHTML = "";


        if (!orderId) {

            trackingError.textContent =
                "Please enter your Order ID.";

            return;
        }


        const orders = getOrders();


        const order = orders.find(
            order =>
                order.id.toUpperCase() === orderId
        );


        if (!order) {

            trackingError.textContent =
                "Order not found. Please check your Order ID.";

            return;
        }


        displayOrder(order);

    }
);


// ========================================
// DISPLAY ORDER
// ========================================

function displayOrder(order) {

    const status = order.status || "Pending";


    const statusSteps = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered"
    ];


    let currentIndex =
        statusSteps.indexOf(status);


    if (status === "Cancelled") {

        currentIndex = -1;

    }


    const progressHTML =
        statusSteps.map(
            (step, index) => {

                let className = "";


                if (index < currentIndex) {

                    className = "completed";

                }
                else if (index === currentIndex) {

                    className = "current";

                }


                return `

                    <div class="tracking-step ${className}">

                        <div class="step-circle">

                            ${
                                index < currentIndex
                                ? "✓"
                                : index + 1
                            }

                        </div>

                        <div class="step-content">

                            <strong>
                                ${step}
                            </strong>

                            <span>
                                ${
                                    getStepDescription(step)
                                }
                            </span>

                        </div>

                    </div>

                `;

            }
        ).join("");


    const itemsHTML =
        order.items.map(
            item => `

                <div class="tracking-item">

                    <div class="tracking-item-name">

                        <span class="item-emoji">
                            ${item.emoji || "🍔"}
                        </span>

                        <div>

                            <strong>
                                ${item.name}
                            </strong>

                            <span>
                                Qty: ${item.quantity || 1}
                            </span>

                        </div>

                    </div>


                    <strong>
                        ₹${
                            Number(item.price) *
                            Number(item.quantity || 1)
                        }
                    </strong>

                </div>

            `
        ).join("");


    const cancelledMessage =
        status === "Cancelled"
        ? `
            <div class="cancelled-order">
                ❌ This order has been cancelled.
            </div>
        `
        : "";


    orderResult.innerHTML = `

        <div class="order-header-card">

            <div>

                <span class="small-label">
                    ORDER ID
                </span>

                <h2>
                    ${order.id}
                </h2>

                <p>
                    Placed on ${formatDate(order.date)}
                </p>

            </div>


            <div class="order-status-badge ${getStatusClass(status)}">

                ${getStatusIcon(status)}
                ${status}

            </div>

        </div>


        ${cancelledMessage}


        <div class="tracking-card">

            <h2>
                📍 Order Progress
            </h2>

            <div class="tracking-timeline">

                ${progressHTML}

            </div>

        </div>


        <div class="tracking-grid">


            <!-- Customer -->

            <div class="tracking-card">

                <h2>
                    👤 Delivery Details
                </h2>

                <div class="detail-row">

                    <span>Name</span>

                    <strong>
                        ${order.customer.name}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>Phone</span>

                    <strong>
                        ${order.customer.phone}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>Address</span>

                    <strong>
                        ${order.customer.address}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>City</span>

                    <strong>
                        ${order.customer.city}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>Delivery</span>

                    <strong>
                        ${order.deliveryOption}
                    </strong>

                </div>

            </div>


            <!-- Payment -->

            <div class="tracking-card">

                <h2>
                    💳 Payment
                </h2>

                <div class="detail-row">

                    <span>Payment Method</span>

                    <strong>
                        ${order.paymentMethod}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>Subtotal</span>

                    <strong>
                        ₹${order.subtotal}
                    </strong>

                </div>


                <div class="detail-row">

                    <span>Delivery Charge</span>

                    <strong>

                        ${
                            Number(order.deliveryCharge) === 0
                            ? "FREE"
                            : "₹" + order.deliveryCharge
                        }

                    </strong>

                </div>


                <div class="detail-row total-row">

                    <span>
                        Total
                    </span>

                    <strong>
                        ₹${order.total}
                    </strong>

                </div>

            </div>

        </div>


        <!-- Items -->

        <div class="tracking-card">

            <h2>
                🍔 Ordered Items
            </h2>

            <div class="tracking-items">

                ${itemsHTML}

            </div>

        </div>

    `;

}


// ========================================
// STEP DESCRIPTION
// ========================================

function getStepDescription(step) {

    const descriptions = {

        "Pending":
            "Order received",

        "Confirmed":
            "Restaurant confirmed your order",

        "Preparing":
            "Your food is being prepared",

        "Out for Delivery":
            "Your order is on the way",

        "Delivered":
            "Enjoy your delicious meal!"

    };


    return descriptions[step] || "";

}


// ========================================
// STATUS ICON
// ========================================

function getStatusIcon(status) {

    const icons = {

        "Pending": "⏳",

        "Confirmed": "✅",

        "Preparing": "👨‍🍳",

        "Out for Delivery": "🛵",

        "Delivered": "🎉",

        "Cancelled": "❌"

    };


    return icons[status] || "📦";

}


// ========================================
// STATUS CLASS
// ========================================

function getStatusClass(status) {

    return status
        .toLowerCase()
        .replaceAll(" ", "-");

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
// AUTO TRACK FROM URL
// Example:
// order-tracking.html?id=FB123456
// ========================================

const urlParams =
    new URLSearchParams(window.location.search);

const urlOrderId =
    urlParams.get("id");


if (urlOrderId) {

    orderIdInput.value =
        urlOrderId.toUpperCase();

    trackingForm.dispatchEvent(
        new Event("submit")
    );

}