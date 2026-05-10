
// =========================
// WAIT FOR PAGE TO LOAD (IMPORTANT FIX)
// =========================

window.onload = function () {
  init();
};

// =========================
// DATABASE
// =========================

let db = JSON.parse(localStorage.getItem("db") || "null");

function init() {

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

    saveDB();
  }

  // AUTO LOGIN
  if (localStorage.getItem("loggedIn") === "yes") {
    showContent();
  }

  // BUTTON HOOK SAFETY
  window.login = login;
  window.signup = signup;
  window.logout = logout;
  window.createUser = createUser;
  window.createPage = createPage;
  window.toggleBan = toggleBan;
  window.makeAdmin = makeAdmin;
  window.deletePage = deletePage;
}

// =========================
// LOGIN
// =========================

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

// =========================
// SIGNUP
// =========================

function signup() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

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
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("content").style.display = "block";

  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  document.getElementById("welcome").innerText =
    `Welcome ${user} (${role})`;

  loadPages();

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    renderUsers();
    renderPages();
  }
}

// =========================
// PAGES
// =========================

function loadPages() {
  const container = document.getElementById("pages");
  container.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = db.pages[id].content;
    container.appendChild(div);
  });
}

// =========================
// ADMIN USERS
// =========================

function renderUsers() {
  const container = document.getElementById("userList");
  container.innerHTML = "";

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

    container.appendChild(div);
  });
}

// =========================
// ADMIN PAGES
// =========================

function renderPages() {
  const container = document.getElementById("pageList");
  container.innerHTML = "";

  Object.keys(db.pages).forEach(id => {
    const div = document.createElement("div");
    div.style.background = "#333";
    div.style.margin = "5px";
    div.style.padding = "10px";

    div.innerHTML = `
      <b>${db.pages[id].title}</b><br>
      <button onclick="deletePage('${id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

// =========================
// CREATE USER
// =========================

function createUser() {
  const name = prompt("Username");
  const pass = prompt("Password");
  const role = prompt("Role admin/member", "member");

  if (!name || !pass) return;

  db.users[name] = {
    password: pass,
    role: role,
    banned: false
  };

  saveDB();
  renderUsers();
}

// =========================
// CREATE PAGE
// =========================

function createPage() {
  const id = prompt("Page ID");
  const title = prompt("Title");
  const text = prompt("Text");

  if (!id || !title) return;

  db.pages[id] = {
    title,
    content: `<div class="game"><h2>${title}</h2><p>${text}</p></div>`
  };

  saveDB();
  loadPages();
  renderPages();
}

// =========================
// BAN
// =========================

function toggleBan(name) {
  if (name === "admin") return alert("No admin ban");

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
// SAVE
// =========================

function saveDB() {
  localStorage.setItem("db", JSON.stringify(db));
}

// =========================
// UI
// =========================

function setError(msg) {
  document.getElementById("error").style.color = "red";
  document.getElementById("error").innerText = msg;
}

function setSuccess(msg) {
  document.getElementById("error").style.color = "lime";
  document.getElementById("error").innerText = msg;
}

// =========================
// LOGOUT
// =========================

function logout() {
  localStorage.clear();
  location.reload();
}
