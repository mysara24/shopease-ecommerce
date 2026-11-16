
/* ==========================================
   SHOPEASE - BEAUTY E-COMMERCE MANAGEMENT
   ========================================== */

const USERS_KEY = "shopease_users";
const PRODUCTS_KEY = "shopease_products";
const ORDERS_KEY = "shopease_orders";
const CUSTOMERS_KEY = "shopease_customers";
const SESSION_KEY = "shopease_session";
const THEME_KEY = "shopease_theme";

/* Demo account */

const demoUser = {
  name: "Administrator",
  username: "admin",
  password: "ShopEase123!"
};

/* Default products */

const defaultProducts = [
  { id: 1, name: "Hydrating Facial Cleanser", category: "Skincare", price: 35, stock: 40 },
  { id: 2, name: "Vitamin C Serum", category: "Skincare", price: 55, stock: 25 },
  { id: 3, name: "Matte Lipstick", category: "Makeup", price: 29, stock: 50 },
  { id: 4, name: "Rose Blush Palette", category: "Makeup", price: 42, stock: 18 },
  { id: 5, name: "Repair Hair Mask", category: "Haircare", price: 38, stock: 30 },
  { id: 6, name: "Body Lotion", category: "Bodycare", price: 32, stock: 45 }
];

/* Default orders: January to November 2026 */

const defaultOrders = [
  { id: "ORD001", customer: "Aisha", date: "2026-01-12", total: 45, status: "Completed" },
  { id: "ORD002", customer: "Sofia", date: "2026-02-08", total: 60, status: "Completed" },
  { id: "ORD003", customer: "Nurul", date: "2026-03-17", total: 75, status: "Completed" },
  { id: "ORD004", customer: "Mira", date: "2026-04-11", total: 85, status: "Completed" },
  { id: "ORD005", customer: "Aisha", date: "2026-05-06", total: 95, status: "Completed" },
  { id: "ORD006", customer: "Sofia", date: "2026-06-19", total: 110, status: "Completed" },
  { id: "ORD007", customer: "Nurul", date: "2026-07-14", total: 120, status: "Completed" },
  { id: "ORD008", customer: "Mira", date: "2026-08-09", total: 130, status: "Completed" },
  { id: "ORD009", customer: "Aisha", date: "2026-09-22", total: 145, status: "Completed" },
  { id: "ORD010", customer: "Sofia", date: "2026-10-16", total: 170, status: "Completed" },
  { id: "ORD011", customer: "Nurul", date: "2026-11-03", total: 210, status: "Completed" },
  { id: "ORD012", customer: "Mira", date: "2026-11-08", total: 68, status: "Pending" },
  { id: "ORD013", customer: "Aisha", date: "2026-11-12", total: 92, status: "Processing" },
  { id: "ORD014", customer: "Sofia", date: "2026-11-15", total: 55, status: "Pending" }
];

const defaultCustomers = [
  { name: "Aisha", username: "aisha01", date: "2026-10-01" },
  { name: "Sofia", username: "sofia02", date: "2026-10-05" },
  { name: "Nurul", username: "nurul03", date: "2026-10-12" },
  { name: "Mira", username: "mira04", date: "2026-10-18" }
];

/* Local storage functions */

function getData(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initialiseStorage() {
  const users = getData(USERS_KEY);

  if (!users.some(user => user.username === "admin")) {
    users.push(demoUser);
    saveData(USERS_KEY, users);
  }

  if (!localStorage.getItem(PRODUCTS_KEY)) {
    saveData(PRODUCTS_KEY, defaultProducts);
  }

  if (!localStorage.getItem(ORDERS_KEY)) {
    saveData(ORDERS_KEY, defaultOrders);
  }

  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    saveData(CUSTOMERS_KEY, defaultCustomers);
  }
}

initialiseStorage();

/* Update original four demo orders only */

const existingOrders = getData(ORDERS_KEY);
const originalDemoIds = ["ORD001", "ORD002", "ORD003", "ORD004"];

const isOriginalDemoData =
  existingOrders.length === 4 &&
  originalDemoIds.every(id =>
    existingOrders.some(order => order.id === id)
  );

if (isOriginalDemoData) {
  saveData(ORDERS_KEY, defaultOrders);
}

/* Application variables */

let products = getData(PRODUCTS_KEY);
let orders = getData(ORDERS_KEY);
let customers = getData(CUSTOMERS_KEY);
let charts = {};

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const appSection = document.getElementById("appSection");

/* Registration and login navigation */

document.getElementById("showRegister").addEventListener("click", event => {
  event.preventDefault();

  loginSection.classList.add("d-none");
  registerSection.classList.remove("d-none");
});

document.getElementById("showLogin").addEventListener("click", event => {
  event.preventDefault();

  registerSection.classList.add("d-none");
  loginSection.classList.remove("d-none");
});

/* Registration */

document.getElementById("registerForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  const message = document.getElementById("registerMessage");

  const users = getData(USERS_KEY);

  if (password !== confirm) {
    message.className = "text-danger small";
    message.textContent = "Passwords do not match.";
    return;
  }

  if (users.some(user =>
    user.username.toLowerCase() === username.toLowerCase()
  )) {
    message.className = "text-danger small";
    message.textContent = "Username already exists.";
    return;
  }

  users.push({ name, username, password });
  saveData(USERS_KEY, users);

  customers = getData(CUSTOMERS_KEY);

  customers.push({
    name,
    username,
    date: new Date().toISOString().slice(0, 10)
  });

  saveData(CUSTOMERS_KEY, customers);

  message.className = "text-success small";
  message.textContent = "Registration successful! You can now log in.";

  document.getElementById("registerForm").reset();
});

/* Login */

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = getData(USERS_KEY);

  const user = users.find(item =>
    item.username.toLowerCase() === username.toLowerCase() &&
    item.password === password
  );

  const error = document.getElementById("loginError");

  if (!user) {
    error.textContent = "Incorrect username or password. Please try again.";
    return;
  }

  error.textContent = "";

  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    name: user.name,
    username: user.username
  }));

  openApplication(user);
});

/* Open application */

function openApplication(user) {
  loginSection.classList.add("d-none");
  registerSection.classList.add("d-none");
  appSection.classList.remove("d-none");

  document.getElementById("currentUser").textContent = user.name;

  products = getData(PRODUCTS_KEY);
  orders = getData(ORDERS_KEY);
  customers = getData(CUSTOMERS_KEY);

  renderAll();
}

/* Restore session */

const savedSession = sessionStorage.getItem(SESSION_KEY);

if (savedSession) {
  try {
    openApplication(JSON.parse(savedSession));
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

/* Logout */

document.getElementById("logoutButton").addEventListener("click", logout);

function logout() {
  sessionStorage.removeItem(SESSION_KEY);

  appSection.classList.add("d-none");
  registerSection.classList.add("d-none");
  loginSection.classList.remove("d-none");

  document.getElementById("loginForm").reset();
}

/* Navigation */

const pageDetails = {
  dashboard: ["Dashboard", "Welcome to your ShopEase management system."],
  products: ["Products", "Manage your beauty product inventory."],
  orders: ["Orders", "Manage customer orders."],
  customers: ["Customers", "View registered customers."],
  analytics: ["Sales Analytics", "Analyse your store performance."]
};

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});

function showPage(page) {
  if (!pageDetails[page]) return;

  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.add("d-none");
  });

  document.getElementById(page + "Page").classList.remove("d-none");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  document.getElementById("pageHeading").textContent = pageDetails[page][0];
  document.getElementById("pageSubheading").textContent = pageDetails[page][1];

  document.getElementById("sidebar").classList.remove("show");

  if (page === "analytics") {
    setTimeout(renderCharts, 150);
  }
}

/* Mobile sidebar */

document.getElementById("sidebarToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("show");
});

/* Dark and light mode */

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark-mode");

  applyTheme(isDark ? "light" : "dark");

  renderCharts();
}

document.getElementById("themeToggle").addEventListener("click", toggleTheme);
document.getElementById("mobileTheme").addEventListener("click", toggleTheme);

applyTheme(localStorage.getItem(THEME_KEY) || "light");

/* Product modal */

const productModal = new bootstrap.Modal(
  document.getElementById("productModal")
);

document.getElementById("addProductButton").addEventListener("click", () => {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productModalTitle").textContent = "Add Product";

  productModal.show();
});

/* Add and edit product */

document.getElementById("productForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = document.getElementById("productId").value;

  const product = {
    id: id ? Number(id) : Date.now(),
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    price: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value)
  };

  if (!product.name || !product.category ||
      !Number.isFinite(product.price) || product.price <= 0 ||
      !Number.isInteger(product.stock) || product.stock < 0) {
    alert("Please enter valid product information.");
    return;
  }

  if (id) {
    products = products.map(item =>
      item.id === Number(id) ? product : item
    );
  } else {
    products.push(product);
  }

  saveData(PRODUCTS_KEY, products);

  productModal.hide();
  renderAll();
});

/* Edit product */

function editProduct(id) {
  const product = products.find(item => item.id === id);

  if (!product) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productModalTitle").textContent = "Edit Product";

  productModal.show();
}

/* Delete product */

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  products = products.filter(item => item.id !== id);

  saveData(PRODUCTS_KEY, products);
  renderAll();
}

/* Display products */

function renderProducts() {
  const search = document.getElementById("productSearch").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search) &&
    (!category || product.category === category)
  );

  document.getElementById("productTable").innerHTML = filtered.map(product => `
    <tr>
      <td><strong>${escapeHTML(product.name)}</strong></td>
      <td>${escapeHTML(product.category)}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary"
          onclick="editProduct(${product.id})">Edit</button>

        <button class="btn btn-sm btn-outline-danger"
          onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    </tr>
  `).join("") ||
  `<tr><td colspan="5" class="text-center">No products found.</td></tr>`;
}

document.getElementById("productSearch").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);

/* Order management */

function renderOrders() {
  const search = document.getElementById("orderSearch").value.toLowerCase();

  const filtered = orders.filter(order =>
    order.id.toLowerCase().includes(search) ||
    order.customer.toLowerCase().includes(search)
  );

  document.getElementById("orderTable").innerHTML = filtered.map(order => `
    <tr>
      <td>${escapeHTML(order.id)}</td>
      <td>${escapeHTML(order.customer)}</td>
      <td>${escapeHTML(order.date)}</td>
      <td>${Number(order.total).toFixed(2)}</td>
      <td>
        <span class="badge text-bg-secondary">
          ${escapeHTML(order.status)}
        </span>
      </td>
      <td>
        <select class="form-select form-select-sm"
          onchange="updateOrderStatus('${escapeHTML(order.id)}', this.value)">
          ${["Pending", "Processing", "Completed", "Cancelled"].map(status =>
            `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`
          ).join("")}
        </select>
      </td>
    </tr>
  `).join("") ||
  `<tr><td colspan="6" class="text-center">No orders found.</td></tr>`;
}

document.getElementById("orderSearch").addEventListener("input", renderOrders);

/* Update order status */

function updateOrderStatus(id, status) {
  const allowedStatuses = ["Pending", "Processing", "Completed", "Cancelled"];

  if (!allowedStatuses.includes(status)) return;

  orders = orders.map(order =>
    order.id === id ? { ...order, status } : order
  );

  saveData(ORDERS_KEY, orders);
  renderAll();
}

/* Customer management */

function renderCustomers() {
  const search = document.getElementById("customerSearch").value.toLowerCase();

  const filtered = customers.filter(customer =>
    customer.name.toLowerCase().includes(search) ||
    customer.username.toLowerCase().includes(search)
  );

  document.getElementById("customerTable").innerHTML = filtered.map(customer => `
    <tr>
      <td>${escapeHTML(customer.name)}</td>
      <td>${escapeHTML(customer.username)}</td>
      <td>${escapeHTML(customer.date)}</td>
    </tr>
  `).join("") ||
  `<tr><td colspan="3" class="text-center">No customers found.</td></tr>`;
}

document.getElementById("customerSearch").addEventListener("input", renderCustomers);

/* Dashboard summary */

function renderDashboard() {
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalOrders").textContent = orders.length;
  document.getElementById("totalCustomers").textContent = customers.length;

  const revenue = orders
    .filter(order => order.status === "Completed")
    .reduce((sum, order) => sum + Number(order.total), 0);

  document.getElementById("totalRevenue").textContent =
    "RM " + revenue.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

/* Chart.js visualisation */

function renderCharts() {
  if (typeof Chart === "undefined") return;

  const completedOrders = orders.filter(order =>
    order.status === "Completed"
  );

  const categoryNames = [
    "Skincare",
    "Makeup",
    "Haircare",
    "Bodycare"
  ];

  const categoryCounts = categoryNames.map(category =>
    products.filter(product => product.category === category).length
  );

  const monthlyLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyRevenue = monthlyLabels.map((month, index) =>
    completedOrders
      .filter(order => {
        const date = new Date(order.date + "T00:00:00");
        return date.getFullYear() === 2026 && date.getMonth() === index;
      })
      .reduce((sum, order) => sum + Number(order.total), 0)
  );

  const dark = document.body.classList.contains("dark-mode");
  const fontColor = dark ? "#f3edf4" : "#665b65";

  Object.values(charts).forEach(chart => chart.destroy());
  charts = {};

  const salesCanvas = document.getElementById("salesChart");
  const categoryCanvas = document.getElementById("categoryChart");
  const analyticsSales = document.getElementById("analyticsSalesChart");
  const analyticsCategory = document.getElementById("analyticsCategoryChart");

  const salesData = {
    labels: monthlyLabels,
    datasets: [{
      label: "Revenue (RM)",
      data: monthlyRevenue,
      backgroundColor: "#a77b9a",
      borderColor: "#80516f",
      borderWidth: 2,
      borderRadius: 6
    }]
  };

  const categoryData = {
    labels: categoryNames,
    datasets: [{
      data: categoryCounts,
      backgroundColor: [
        "#80516f",
        "#b58eaa",
        "#d4b9ce",
        "#ead8e5"
      ]
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: fontColor }
      }
    },
    scales: {
      x: {
        ticks: { color: fontColor },
        grid: { color: dark ? "#473c49" : "#eee5ed" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: fontColor },
        grid: { color: dark ? "#473c49" : "#eee5ed" }
      }
    }
  };

  if (salesCanvas && !salesCanvas.closest(".d-none")) {
    charts.sales = new Chart(salesCanvas, {
      type: "bar",
      data: salesData,
      options: commonOptions
    });
  }

  if (categoryCanvas && !categoryCanvas.closest(".d-none")) {
    charts.category = new Chart(categoryCanvas, {
      type: "doughnut",
      data: categoryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: fontColor }
          }
        }
      }
    });
  }

  if (analyticsSales && !analyticsSales.closest(".d-none")) {
    charts.analyticsSales = new Chart(analyticsSales, {
      type: "line",
      data: {
        labels: monthlyLabels,
        datasets: [{
          label: "Revenue (RM)",
          data: monthlyRevenue,
          borderColor: "#a77b9a",
          backgroundColor: "rgba(167,123,154,.15)",
          fill: true,
          tension: 0.35
        }]
      },
      options: commonOptions
    });
  }

  if (analyticsCategory && !analyticsCategory.closest(".d-none")) {
    charts.analyticsCategory = new Chart(analyticsCategory, {
      type: "pie",
      data: categoryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: fontColor }
          }
        }
      }
    });
  }
}

/* Prevent HTML injection */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

/* Refresh all application data */

function renderAll() {
  products = getData(PRODUCTS_KEY);
  orders = getData(ORDERS_KEY);
  customers = getData(CUSTOMERS_KEY);

  renderDashboard();
  renderProducts();
  renderOrders();
  renderCustomers();
  renderCharts();
}
