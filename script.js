
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwfc8zGznD5wre5PNIQWmnP6J64mZ5OLO207nO5pgNAMFMwz8oKmcsVLP6Zzv-lllmGyg/exec";

// =======================
// LOGIN
// =======================

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      username,
      password
    })
  });

  const data = await res.json();

  if (!data.success) return setError(data.message);

  localStorage.setItem("session", JSON.stringify(data));

  showContent();
}

// =======================
// SIGNUP
// =======================

async function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "signup",
      username,
      password
    })
  });

  setSuccess("Account created");
}

// =======================
// SHOW CONTENT
// =======================

async function showContent() {
  loginPage.style.display = "none";
  content.style.display = "block";

  const session = JSON.parse(localStorage.getItem("session"));

  welcome.innerText = `Welcome ${session.username} (${session.role})`;

  loadPages();

  if (session.role === "admin") {
    adminPanel.style.display = "block";
    renderUsers();
  }
}

// =======================
// LOAD PAGES
// =======================

async function loadPages() {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({ action: "getPages" })
  });

  const pages = await res.json();

  pagesContainer.innerHTML = "";

  pages.forEach(p => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = p.content;
    pages.appendChild(div);
  });
}

// =======================
// USERS
// =======================

async function renderUsers() {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({ action: "getUsers" })
  });

  let users = await res.json();

  const search = userSearch.value?.toLowerCase() || "";
  const filter = userFilter.value;

  users = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search);

    const matchFilter =
      filter === "all" ||
      (filter === "admin" && u.role === "admin") ||
      (filter === "member" && u.role === "member") ||
      (filter === "banned" && u.banned === "true");

    return matchSearch && matchFilter;
  });

  userList.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.style.background = "#333";
    div.style.margin = "5px";
    div.style.padding = "10px";

    div.innerHTML = `
      <b>${u.username}</b><br>
      ${u.role}<br>
      banned: ${u.banned}<br>
      <button onclick="toggleBan('${u.username}')">Ban</button>
    `;

    userList.appendChild(div);
  });
}

// =======================
// CREATE PAGE
// =======================

async function createPage() {
  const id = prompt("Page ID");
  const title = prompt("Title");
  const text = prompt("Text");

  await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "createPage",
      id,
      title,
      content: `<div class='game'><h2>${title}</h2><p>${text}</p></div>`
    })
  });

  loadPages();
}

// =======================
// BAN
// =======================

async function toggleBan(username) {
  await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "toggleBan",
      username
    })
  });

  renderUsers();
}

// =======================
// TABS
// =======================

function openTab(tab) {
  tab-users.style.display = "none";
  tab-pages.style.display = "none";
  tab-settings.style.display = "none";

  document.getElementById("tab-" + tab).style.display = "block";
}

// =======================
// LOGOUT
// =======================

function logout() {
  localStorage.clear();
  location.reload();
}

// =======================
// UI
// =======================

function setError(msg) {
  error.style.color = "red";
  error.innerText = msg;
}

function setSuccess(msg) {
  error.style.color = "lime";
  error.innerText = msg;
}
