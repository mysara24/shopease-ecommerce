
// ==========================================
// SHOEASE - BEAUTY E-COMMERCE ADMIN SYSTEM
// ==========================================

// Demo administrator credentials
const DEMO_EMAIL = "admin@shopease.com";
const DEMO_PASSWORD = "ShopEase123!";

// Sample product data
let products = JSON.parse(localStorage.getItem("products")) || [
    {id: 1, name: "Vitamin C Brightening Serum", category: "Skincare", price: 45, stock: 24},
    {id: 2, name: "Hydrating Daily Moisturizer", category: "Skincare", price: 60, stock: 18},
    {id: 3, name: "Daily UV Sunscreen SPF 50", category: "Skincare", price: 35, stock: 8},
    {id: 4, name: "Velvet Matte Lip Cream", category: "Makeup", price: 29, stock: 32},
    {id: 5, name: "Rose Glow Blush", category: "Makeup", price: 39, stock: 14},
    {id: 6, name: "Nourishing Body Lotion", category: "Body Care", price: 42, stock: 5},
    {id: 7, name: "Repair Hair Mask", category: "Hair Care", price: 55, stock: 11}
];

// Sample order data
let orders = JSON.parse(localStorage.getItem("orders")) || [
    {id: 1001, customer: "Aisyah", product: "Vitamin C Brightening Serum", amount: 45, status: "Completed"},
    {id: 1002, customer: "Sarah", product: "Hydrating Daily Moisturizer", amount: 60, status: "Pending"},
    {id: 1003, customer: "Amira", product: "Daily UV Sunscreen SPF 50", amount: 35, status: "Processing"},
    {id: 1004, customer: "Nadia", product: "Velvet Matte Lip Cream", amount: 29, status: "Completed"},
    {id: 1005, customer: "Farah", product: "Nourishing Body Lotion", amount: 42, status: "Processing"}
];

// Sample customer data
let customers = JSON.parse(localStorage.getItem("customers")) || [
    {name: "Aisyah", email: "aisyah@example.com"},
    {name: "Sarah", email: "sarah@example.com"},
    {name: "Amira", email: "amira@example.com"},
    {name: "Nadia", email: "nadia@example.com"},
    {name: "Farah", email: "farah@example.com"}
];

let charts = {};

const get = id => document.getElementById(id);

function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("customers", JSON.stringify(customers));
}

function formatMoney(amount) {
    return "RM " + Number(amount).toFixed(2);
}

// Escape displayed text
function safeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// ==========================================
// LOGIN AND REGISTRATION
// ==========================================

function showPage(id) {
    ["loginPage", "registerPage", "dashboardPage"].forEach(page => {
        get(page).classList.add("hidden");
    });

    get(id).classList.remove("hidden");
}

get("showRegister").addEventListener("click", function(event) {
    event.preventDefault();
    showPage("registerPage");
});

get("showLogin").addEventListener("click", function(event) {
    event.preventDefault();
    showPage("loginPage");
});

// Login validation
get("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = get("loginEmail").value.trim().toLowerCase();
    const password = get("loginPassword").value;

    const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
    );

    const registeredUser = registeredUsers.find(user =>
        user.email === email && user.password === password
    );

    if (
        (email === DEMO_EMAIL && password === DEMO_PASSWORD) ||
        registeredUser
    ) {
        const admin = {
            name: registeredUser ? registeredUser.name : "Admin",
            email: email
        };

        sessionStorage.setItem("currentAdmin", JSON.stringify(admin));
        get("loginError").textContent = "";

        enterDashboard();
    } else {
        get("loginError").textContent =
            "Incorrect email or password. Please try again.";
    }
});

// Registration validation
get("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = get("registerName").value.trim();
    const email = get("registerEmail").value.trim().toLowerCase();
    const password = get("registerPassword").value;

    let users = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
    );

    if (email === DEMO_EMAIL || users.some(user => user.email === email)) {
        get("registerError").textContent =
            "This email address is already registered.";
        return;
    }

    if (password.length < 6) {
        get("registerError").textContent =
            "Password must contain at least 6 characters.";
        return;
    }

    users.push({name, email, password});

    localStorage.setItem("registeredUsers", JSON.stringify(users));

    get("registerForm").reset();

    get("registerError").textContent =
        "Account created successfully! Please log in.";

    setTimeout(() => {
        showPage("loginPage");
        get("loginError").textContent = "Your account is ready. Please sign in.";
    }, 800);
});

// Logout
get("logoutButton").addEventListener("click", function() {
    sessionStorage.removeItem("currentAdmin");
    showPage("loginPage");
});

// ==========================================
// DASHBOARD
// ==========================================

function enterDashboard() {
    const admin = JSON.parse(sessionStorage.getItem("currentAdmin"));

    showPage("dashboardPage");

    get("adminName").textContent = admin.name;
    get("welcomeName").textContent = admin.name;

    get("currentDate").textContent =
        new Date().toLocaleDateString("en-MY", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    renderAll();
    navigate("dashboard");
}

function updateDashboard() {
    get("totalProducts").textContent = products.length;
    get("totalOrders").textContent = orders.length;
    get("totalCustomers").textContent = customers.length;

    const revenue = orders.reduce(
        (total, order) => total + Number(order.amount), 0
    );

    get("totalRevenue").textContent = formatMoney(revenue);
}

// ==========================================
// NAVIGATION
// ==========================================

document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        navigate(button.dataset.page);
    });
});

function navigate(page) {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.add("hidden");
    });

    get(page + "Section").classList.remove("hidden");

    document.querySelectorAll(".nav-link").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === page
        );
    });

    const titles = {
        dashboard: "Dashboard",
        products: "Products",
        orders: "Orders",
        customers: "Customers",
        analytics: "Sales Analytics"
    };

    get("pageTitle").textContent = titles[page];

    if (page === "dashboard" || page === "analytics") {
        setTimeout(renderCharts, 100);
    }
}

// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

const productModal = new bootstrap.Modal(get("productModal"));

get("addProductButton").addEventListener("click", function() {
    get("productForm").reset();
    get("editProductId").value = "";
    get("modalTitle").textContent = "Add Product";

    productModal.show();
});

get("productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = Number(get("editProductId").value);

    const product = {
        id: id || Date.now(),
        name: get("productName").value.trim(),
        category: get("productCategory").value,
        price: Number(get("productPrice").value),
        stock: Number(get("productStock").value)
    };

    if (id) {
        products = products.map(item =>
            item.id === id ? product : item
        );
    } else {
        products.push(product);
    }

    saveData();
    renderProducts();
    updateDashboard();
    renderCharts();

    productModal.hide();
});

function renderProducts() {
    const search = get("productSearch").value.toLowerCase();
    const category = get("categoryFilter").value;

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    get("productsTable").innerHTML = filteredProducts.map(product => `
        <tr>
            <td><strong>${safeText(product.name)}</strong></td>
            <td>${safeText(product.category)}</td>
            <td>${formatMoney(product.price)}</td>
            <td>
                <span class="${product.stock < 10 ? "low-stock" : "normal-stock"}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="editProduct(${product.id})">
                    Edit
                </button>
                <button class="action-btn" onclick="deleteProduct(${product.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("") || `
        <tr><td colspan="5">No products found.</td></tr>
    `;
}

get("productSearch").addEventListener("input", renderProducts);
get("categoryFilter").addEventListener("change", renderProducts);

window.editProduct = function(id) {
    const product = products.find(item => item.id === id);

    get("editProductId").value = product.id;
    get("productName").value = product.name;
    get("productCategory").value = product.category;
    get("productPrice").value = product.price;
    get("productStock").value = product.stock;

    get("modalTitle").textContent = "Edit Product";

    productModal.show();
};

window.deleteProduct = function(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(product => product.id !== id);

        saveData();
        renderProducts();
        updateDashboard();
        renderCharts();
    }
};

// ==========================================
// ORDER MANAGEMENT
// ==========================================

function renderOrders() {
    const search = get("orderSearch").value.toLowerCase();
    const filter = get("orderFilter").value;

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            String(order.id).includes(search) ||
            order.customer.toLowerCase().includes(search) ||
            order.product.toLowerCase().includes(search);

        const matchesStatus =
            filter === "" || order.status === filter;

        return matchesSearch && matchesStatus;
    });

    get("ordersTable").innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${safeText(order.customer)}</td>
            <td>${safeText(order.product)}</td>
            <td>${formatMoney(order.amount)}</td>
            <td>
                <span class="status ${order.status}">
                    ${order.status}
                </span>
            </td>
            <td>
                <select class="form-select form-select-sm"
                    onchange="updateOrderStatus(${order.id}, this.value)">
                    <option ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${order.status === "Processing" ? "selected" : ""}>Processing</option>
                    <option ${order.status === "Completed" ? "selected" : ""}>Completed</option>
                </select>
            </td>
        </tr>
    `).join("") || `
        <tr><td colspan="6">No orders found.</td></tr>
    `;
}

get("orderSearch").addEventListener("input", renderOrders);
get("orderFilter").addEventListener("change", renderOrders);

window.updateOrderStatus = function(id, status) {
    orders = orders.map(order =>
        order.id === id ? {...order, status: status} : order
    );

    saveData();
    renderOrders();
    renderRecentOrders();
    updateDashboard();
    renderCharts();
};

// ==========================================
// CUSTOMER MANAGEMENT
// ==========================================

function renderCustomers() {
    const search = get("customerSearch").value.toLowerCase();

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search)
    );

    get("customersTable").innerHTML = filteredCustomers.map(customer => {
        const customerOrders = orders.filter(
            order => order.customer === customer.name
        );

        const totalSpent = customerOrders.reduce(
            (total, order) => total + Number(order.amount), 0
        );

        return `
            <tr>
                <td><strong>${safeText(customer.name)}</strong></td>
                <td>${safeText(customer.email)}</td>
                <td>${customerOrders.length}</td>
                <td>${formatMoney(totalSpent)}</td>
            </tr>
        `;
    }).join("") || `
        <tr><td colspan="4">No customers found.</td></tr>
    `;
}

get("customerSearch").addEventListener("input", renderCustomers);

// ==========================================
// RECENT ORDERS
// ==========================================

function renderRecentOrders() {
    get("recentOrdersTable").innerHTML = orders.slice(-5).reverse().map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${safeText(order.customer)}</td>
            <td>${safeText(order.product)}</td>
            <td>${formatMoney(order.amount)}</td>
            <td>
                <span class="status ${order.status}">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join("");
}

// ==========================================
// CHARTS USING CHART.JS
// ==========================================

function renderCharts() {
    if (typeof Chart === "undefined") return;

    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const revenueData = [3200, 4100, 3800, 5200, 4900, 6100];

    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };

    // Revenue bar chart
    charts.revenue = new Chart(get("revenueChart"), {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Revenue (RM)",
                data: revenueData,
                backgroundColor: "#B77F91",
                borderRadius: 7
            }]
        },
        options: {
            ...commonOptions,
            plugins: {legend: {display: false}},
            scales: {
                y: {beginAtZero: true}
            }
        }
    });

    // Order status doughnut chart
    charts.status = new Chart(get("statusChart"), {
        type: "doughnut",
        data: {
            labels: ["Completed", "Processing", "Pending"],
            datasets: [{
                data: [
                    orders.filter(o => o.status === "Completed").length,
                    orders.filter(o => o.status === "Processing").length,
                    orders.filter(o => o.status === "Pending").length
                ],
                backgroundColor: ["#8FB9A1", "#A895BD", "#E6BD83"],
                borderWidth: 0
            }]
        },
        options: {
            ...commonOptions,
            cutout: "65%"
        }
    });

    // Sales analytics line chart
    charts.sales = new Chart(get("salesChart"), {
        type: "line",
        data: {
            labels: months,
            datasets: [{
                label: "Monthly Revenue",
                data: revenueData,
                borderColor: "#9C6E83",
                backgroundColor: "#F2E2E8",
                fill: true,
                tension: 0.35
            }]
        },
        options: commonOptions
    });

    // Product category doughnut chart
    const categories = ["Skincare", "Makeup", "Body Care", "Hair Care"];

    charts.category = new Chart(get("categoryChart"), {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [{
                data: categories.map(category =>
                    products.filter(p => p.category === category).length
                ),
                backgroundColor: [
                    "#B77F91",
                    "#A895BD",
                    "#E6BD83",
                    "#8FB9A1"
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...commonOptions,
            cutout: "65%"
        }
    });
}

// ==========================================
// RENDER ALL DATA
// ==========================================

function renderAll() {
    updateDashboard();
    renderProducts();
    renderOrders();
    renderCustomers();
    renderRecentOrders();
    renderCharts();
}

// Save initial sample data
saveData();

// Restore session if administrator is already logged in
if (sessionStorage.getItem("currentAdmin")) {
    enterDashboard();
} else {
    showPage("loginPage");
}
