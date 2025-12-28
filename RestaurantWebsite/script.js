// ===============================
// ORDER & CART LOGIC
// ===============================

// Order object store karega selected items
let order = {};
let total = 0;

// Item add ya remove karne ka function
function addItem(name, price, qty) {
    qty = Number(qty);

    if (qty > 0) {
        order[name] = { qty: qty, amount: price * qty };
    } else {
        delete order[name];
    }

    updateCart();
}

// Cart / bill update function
function updateCart() {
    const billDiv = document.getElementById("bill");
    const totalSpan = document.getElementById("total");

    billDiv.innerHTML = "";
    total = 0;

    for (let item in order) {
        billDiv.innerHTML +=
            item + " × " +
            order[item].qty +
            " = ₹" + order[item].amount + "<br>";

        total += order[item].amount;
    }

    if (total === 0) {
        billDiv.innerHTML = "No items selected";
    }

    totalSpan.innerText = total;
}

// Proceed to payment page
function proceedToPay() {
    if (total === 0) {
        alert("Please select at least one item!");
        return;
    }

    localStorage.setItem("order", JSON.stringify(order));
    localStorage.setItem("total", total);

    window.location.href = "payment.html";
}


// ===============================
// SEARCH MENU FUNCTION
// ===============================

function searchMenu() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let items = document.querySelectorAll(".menu-grid .item");
    let noResultMsg = document.getElementById("noResultMsg");

    let found = false;

    items.forEach(item => {
        let title = item.querySelector("h4").innerText.toLowerCase();

        if (title.includes(input)) {
            item.style.display = "block";
            found = true;
        } else {
            item.style.display = "none";
        }
    });

    if (!found) {
        noResultMsg.innerText = "Dish not available!";
        noResultMsg.style.display = "block";
    } else {
        noResultMsg.style.display = "none";
    }
}


// ===============================
// PAYMENT LOGIC (PROFESSIONAL)
// ===============================

function payNow() {

    let card = document.getElementById("card").value;
    let expiry = document.getElementById("expiry").value; // YYYY-MM
    let cvv = document.getElementById("cvv").value;
    let address = document.getElementById("address").value;

    // ---------------- BASIC CHECKS ----------------

    if (card.length !== 16 || isNaN(card)) {
        alert("Card number must be 16 digits");
        return;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        alert("CVV must be 3 digits");
        return;
    }

    if (expiry === "") {
        alert("Please select expiry date");
        return;
    }

    if (address.trim() === "") {
        alert("Please enter delivery address");
        return;
    }

    // ---------------- EXPIRY LOGIC (FIXED) ----------------

    let today = new Date();

    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth() + 1; // 1–12

    let expYear = parseInt(expiry.split("-")[0]);
    let expMonth = parseInt(expiry.split("-")[1]);

    // ❌ Card expired
    if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
    ) {
        alert("❌ Card is expired.\nPlease renew your card.");
        return;
    }

    // ⚠️ Card expires THIS MONTH
    if (expYear === currentYear && expMonth === currentMonth) {
        alert("⚠️ Your card expires this month.\nPayment successful ✅");
    }
    // ✅ Future expiry
    else {
        alert("✅ Payment successful!\nThank you for your order 😊");
    }

    // ---------------- CLEAR DATA ----------------

    localStorage.removeItem("order");
    localStorage.removeItem("total");

    window.location.href = "index.htm";
}

