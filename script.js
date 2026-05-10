console.log("Script loaded");

// =======================
// DATABASE LOAD
// =======================

let db;

try {
  db = JSON.parse(localStorage.getItem("db"));
} catch (e) {
  db = null;
}

if (!db || !db.users || !db.pages) {
  db = {
    users: {
      admin: {
        password: "1234",
        role: "admin",
        banned: false
      }
    },
    pages: {
      home: {
        title: "Home",
        content: "<h2>Welcome</h2><p>Your system is working.</p>"
      }
    }
  };

  localStorage.setItem("db", JSON.stringify(db));
}

// =======================
// AUTO LOGIN
// =======================

if (localStorage.getItem("loggedIn") === "yes") {
  showContent();
}

// =======================
// LOGIN
// =======================

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  const u = db.users[user];

  if (!u) return setError("User not found");

  if (u.banned) return setError("This user is banned");

  if (u.password !== pass) return setError("Wrong password");

  localStorage.setItem("loggedIn", "yes");
  localStorage.setItem("username", user);
  localStorage.setItem("role", u.role);

  showContent();
}

// =======================
// SIGN UP
// =======================

function signup() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) return setError("Fill all fields");

  if (db.users[user]) return setError("User already exists");

  db.users[user] = {
    password: pass,
    role: "member",
    banned: false
  };

  saveDB();
  setSuccess("Account created!");
}

// =======================
// SHOW CONTENT
// =======================

function showContent() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("content").style.display = "block";

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  document.getElementById("welcome").innerText =
    `Welcome ${username} (${role})`;

  loadPages();

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    renderUsers();
    renderPages();
  }
}

// =======================
// LOAD PAGES
// =======================

function loadPages() {
  const container = document.getElementById("pages");
  container.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const page = db.pages[id];

    const div = document.createElement("div");
    div.className = "game";

    div.innerHTML = `
      <h2>${page.title}</h2>
      ${page.content}
    `;

    container.appendChild(div);
  });
}

// =======================
// ADMIN - USERS
// =======================

function renderUsers() {
  const container = document.getElementById("userList");
  container.innerHTML = "";

  Object.keys(db.users).forEach(name => {
    const u = db.users[name];

    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.background = "#333";
    div.style.borderRadius = "8px";

    div.innerHTML = `
      <b>${name}</b><br>
      Role: ${u.role}<br>
      Status: ${u.banned ? "🚫 BANNED" : "✅ Active"}<br>
      <button onclick="toggleBan('${name}')">Ban/Unban</button>
      <button onclick="makeAdmin('${name}')">Make Admin</button>
    `;

    container.appendChild(div);
  });
}

// =======================
// ADMIN - PAGES
// =======================

function renderPages() {
  const container = document.getElementById("pageList");
  container.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const p = db.pages[id];

    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.background = "#333";
    div.style.borderRadius = "8px";

    div.innerHTML = `
      <b>${p.title}</b><br>
      ID: ${id}<br>
      <button onclick="deletePage('${id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

// =======================
// CREATE USER
// =======================

function createUser() {
  const name = prompt("Username:");
  const pass = prompt("Password:");
  const role = prompt("Role (admin/member):", "member");

  if (!name || !pass) return;

  db.users[name] = {
    password: pass,
    role: role || "member",
    banned: false
  };

  saveDB();
  renderUsers();
}

// =======================
// CREATE PAGE
// =======================

function createPage() {
  const id = prompt("Page ID (no spaces):");
  const title = prompt("Page title:");
  const content = prompt("HTML content:");

  if (!id || !title) return;

  db.pages[id] = {
    title,
    content
  };

  saveDB();
  loadPages();
  renderPages();
}

// =======================
// ACTIONS
// =======================

function toggleBan(name) {
  if (name === "admin") return alert("Cannot ban admin");

  db.users[name].banned = !db.users[name].banned;
  saveDB();
  renderUsers();
}

function makeAdmin(name) {
  db.users[name].role = "admin";
  saveDB();
  renderUsers();
}

function deletePage(id) {
  delete db.pages[id];
  saveDB();
  loadPages();
  renderPages();
}

// =======================
// SAVE
// =======================

function saveDB() {
  localStorage.setItem("db", JSON.stringify(db));
}

// =======================
// UI HELPERS
// =======================

function setError(msg) {
  const el = document.getElementById("error");
  el.style.color = "red";
  el.innerText = msg;
}

function setSuccess(msg) {
  const el = document.getElementById("error");
  el.style.color = "lime";
  el.innerText = msg;
}

// =======================
// LOGOUT
// =======================

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  location.reload();
}
