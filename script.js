
console.log("CMS Loaded");

// =========================
// SAFE DATABASE LOAD
// =========================

let db = JSON.parse(localStorage.getItem("db") || "null");

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
        content: "<div class='game'><h2>Welcome</h2></div>"
      }
    }
  };

  localStorage.setItem("db", JSON.stringify(db));
}

// =========================
// AUTO LOGIN
// =========================

if (localStorage.getItem("loggedIn") === "yes") {
  showContent();
}

// =========================
// LOGIN
// =========================

function login() {
  const user = username.value.trim();
  const pass = password.value.trim();

  const u = db.users[user];

  if (!u) return setError("User not found");
  if (u.banned) return setError("User is banned");
  if (u.password !== pass) return setError("Wrong password");

  localStorage.setItem("loggedIn", "yes");
  localStorage.setItem("username", user);
  localStorage.setItem("role", u.role);

  showContent();
}

// =========================
// SIGNUP
// =========================

function signup() {
  const user = username.value.trim();
  const pass = password.value.trim();

  if (!user || !pass) return setError("Fill all fields");
  if (db.users[user]) return setError("User exists");

  db.users[user] = {
    password: pass,
    role: "member",
    banned: false
  };

  saveDB();
  setSuccess("Account created!");
}

// =========================
// SHOW CONTENT
// =========================

function showContent() {
  loginPage.style.display = "none";
  content.style.display = "block";

  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  welcome.innerText = `Welcome ${user} (${role})`;

  loadPages();

  if (role === "admin") {
    adminPanel.style.display = "block";
    renderUsers();
    renderPages();
  }
}

// =========================
// PAGES
// =========================

function loadPages() {
  pages.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const p = db.pages[id];

    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = p.content;

    pages.appendChild(div);
  });
}

// =========================
// ADMIN USERS
// =========================

function renderUsers() {
  userList.innerHTML = "";

  Object.keys(db.users).forEach(name => {
    const u = db.users[name];

    const div = document.createElement("div");
    div.style.background = "#333";
    div.style.margin = "5px";
    div.style.padding = "10px";

    div.innerHTML = `
      <b>${name}</b><br>
      ${u.role}<br>
      ${u.banned ? "🚫 banned" : "active"}<br>
      <button onclick="toggleBan('${name}')">Ban</button>
      <button onclick="makeAdmin('${name}')">Admin</button>
    `;

    userList.appendChild(div);
  });
}

// =========================
// ADMIN PAGES
// =========================

function renderPages() {
  pageList.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const p = db.pages[id];

    const div = document.createElement("div");
    div.style.background = "#333";
    div.style.margin = "5px";
    div.style.padding = "10px";

    div.innerHTML = `
      <b>${p.title}</b><br>
      <button onclick="deletePage('${id}')">Delete</button>
    `;

    pageList.appendChild(div);
  });
}

// =========================
// CREATE USER
// =========================

function createUser() {
  const name = prompt("Username");
  const pass = prompt("Password");
  const role = prompt("Role admin/member", "member");

  db.users[name] = {
    password: pass,
    role: role,
    banned: false
  };

  saveDB();
  renderUsers();
}

// =========================
// CREATE PAGE (TEXT ONLY)
// =========================

function createPage() {
  const id = prompt("Page ID");
  const title = prompt("Title");
  const text = prompt("Text");

  db.pages[id] = {
    title,
    content: `<div class="game"><h2>${title}</h2><p>${text}</p></div>`
  };

  saveDB();
  loadPages();
  renderPages();
}

// =========================
// BAN SYSTEM
// =========================

function toggleBan(name) {
  if (name === "admin") return alert("No banning admin");

  db.users[name].banned = !db.users[name].banned;
  saveDB();
  renderUsers();
}

// =========================
// MAKE ADMIN
// =========================

function makeAdmin(name) {
  db.users[name].role = "admin";
  saveDB();
  renderUsers();
}

// =========================
// DELETE PAGE
// =========================

function deletePage(id) {
  delete db.pages[id];
  saveDB();
  loadPages();
  renderPages();
}

// =========================
// SAVE (FIXED)
// =========================

function saveDB() {
  localStorage.setItem("db", JSON.stringify(db));
}

// =========================
// UI
// =========================

function setError(msg) {
  error.style.color = "red";
  error.innerText = msg;
}

function setSuccess(msg) {
  error.style.color = "lime";
  error.innerText = msg;
}

// =========================
// LOGOUT
// =========================

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  location.reload();
}
