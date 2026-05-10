
// LOAD DATA
let db = JSON.parse(localStorage.getItem("db"));

if (!db) {
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
        content: "<h2>Welcome</h2><p>Default page</p>"
      }
    }
  };

  localStorage.setItem("db", JSON.stringify(db));
}

// AUTO LOGIN
if (localStorage.getItem("loggedIn") === "yes") {
  showContent();
}

// LOGIN
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  const u = db.users[user];

  if (!u) return setError("User not found");

  if (u.banned) return setError("User is banned");

  if (u.password !== pass) return setError("Wrong password");

  localStorage.setItem("loggedIn", "yes");
  localStorage.setItem("username", user);
  localStorage.setItem("role", u.role);

  showContent();
}

// SIGNUP (USER ONLY)
function signup() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (db.users[user]) return setError("User exists");

  db.users[user] = {
    password: pass,
    role: "member",
    banned: false
  };

  saveDB();
  setSuccess("Account created");
}

// SHOW CONTENT + ADMIN CHECK
function showContent() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("content").style.display = "block";

  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  document.getElementById("welcome").innerText =
    `Welcome ${user} (${role})`;

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    renderAdmin();
    renderPages();
  }

  loadPages();
}

// LOAD PAGES INTO UI
function loadPages() {
  const container = document.getElementById("pages");
  container.innerHTML = "";

  Object.keys(db.pages).forEach(key => {
    const page = db.pages[key];

    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = `
      <h2>${page.title}</h2>
      ${page.content}
    `;

    container.appendChild(div);
  });
}

// ADMIN PANEL
function renderAdmin() {
  const container = document.getElementById("userList");
  container.innerHTML = "";

  Object.keys(db.users).forEach(name => {
    const u = db.users[name];

    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.background = "#333";
    div.innerHTML = `
      <b>${name}</b> (${u.role})<br>
      ${u.banned ? "🚫 banned" : "active"}<br>

      <button onclick="toggleBan('${name}')">Ban/Unban</button>
      <button onclick="makeAdmin('${name}')">Make Admin</button>
    `;

    container.appendChild(div);
  });
}

// CREATE USER FROM ADMIN
function createUser() {
  const name = prompt("Username?");
  const pass = prompt("Password?");
  const role = prompt("Role (admin/member)?", "member");

  db.users[name] = {
    password: pass,
    role: role,
    banned: false
  };

  saveDB();
  renderAdmin();
}

// BAN SYSTEM
function toggleBan(name) {
  if (name === "admin") return alert("Cannot ban admin");

  db.users[name].banned = !db.users[name].banned;
  saveDB();
  renderAdmin();
}

// PROMOTE TO ADMIN
function makeAdmin(name) {
  db.users[name].role = "admin";
  saveDB();
  renderAdmin();
}

// CREATE PAGE (NEW FEATURE)
function createPage() {
  const id = prompt("Page ID (no spaces)");
  const title = prompt("Page title");
  const content = prompt("HTML content (like <h1>Hi</h1>)");

  db.pages[id] = {
    title,
    content
  };

  saveDB();
  loadPages();
  renderPages();
}

// ADMIN PAGE LIST
function renderPages() {
  const container = document.getElementById("pageList");
  container.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const p = db.pages[id];

    const div = document.createElement("div");
    div.style.background = "#222";
    div.style.margin = "5px";
    div.style.padding = "10px";

    div.innerHTML = `
      <b>${p.title}</b><br>
      ID: ${id}<br>
      <button onclick="deletePage('${id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

// DELETE PAGE
function deletePage(id) {
  delete db.pages[id];
  saveDB();
  loadPages();
  renderPages();
}

// SAVE
function saveDB() {
  localStorage.setItem("db", JSON.stringify(db));
}

// UI HELPERS
function setError(msg) {
  document.getElementById("error").innerText = msg;
}

function setSuccess(msg) {
  const e = document.getElementById("error");
  e.style.color = "lime";
  e.innerText = msg;
}

// LOGOUT
function logout() {
  localStorage.clear();
  location.reload();
}
