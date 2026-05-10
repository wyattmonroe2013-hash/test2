console.log("SCRIPT LOADED");

// =======================
// CONFIG
// =======================

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwfc8zGznD5wre5PNIQWmnP6J64mZ5OLO207nO5pgNAMFMwz8oKmcsVLP6Zzv-lllmGyg/exec";

// =======================
// LOGIN
// =======================

async function login() {
  const u = username.value.trim();
  const p = password.value.trim();

  // emergency admin
  if (u === "Wyatt" && p === "Test") {
    localStorage.setItem("session", JSON.stringify({ username: u, role: "admin" }));
    showContent();
    return;
  }

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", username: u, password: p })
    });

    const data = await res.json();

    if (!data.success) return setError("Login failed");

    localStorage.setItem("session", JSON.stringify(data));
    showContent();

  } catch (e) {
    setError("Backend error");
    console.error(e);
  }
}

// =======================
// SIGNUP
// =======================

async function signup() {
  const u = username.value.trim();
  const p = password.value.trim();

  await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({ action: "signup", username: u, password: p })
  });

  setError("Account created");
}

// =======================
// SHOW CONTENT
// =======================

function showContent() {
  loginPage.style.display = "none";
  content.style.display = "block";

  const session = JSON.parse(localStorage.getItem("session"));
  welcome.innerText = `Welcome ${session.username}`;

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

  const users = await res.json();

  userList.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${u.username}</b> - ${u.role}`;
    userList.appendChild(div);
  });
}

// =======================
// PAGES
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
      content: `<div class='game'><h3>${title}</h3><p>${text}</p></div>`
    })
  });

  loadPages();
}

// =======================
// TABS
// =======================

function openTab(tab) {
  tab-users.classList.add("hidden");
  tab-pages.classList.add("hidden");
  tab-settings.classList.add("hidden");

  document.getElementById("tab-" + tab).classList.remove("hidden");
}

// =======================
// LOGOUT
// =======================

function logout() {
  localStorage.clear();
  location.reload();
}

// =======================
// ERROR
// =======================

function setError(msg) {
  error.innerText = msg;
}

// =======================
// CRITICAL FIX (THIS FIXES YOUR ERROR)
// =======================

window.login = login;
window.signup = signup;
window.logout = logout;
window.openTab = openTab;
window.createPage = createPage;
window.renderUsers = renderUsers;
