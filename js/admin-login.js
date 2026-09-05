const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "FastBite@123";

const loginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        sessionStorage.setItem("adminLoggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        loginError.textContent =
            "Invalid username or password.";

    }

});