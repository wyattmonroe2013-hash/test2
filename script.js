
// =======================
// CONFIG
// =======================

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwfc8zGznD5wre5PNIQWmnP6J64mZ5OLO207nO5pgNAMFMwz8oKmcsVLP6Zzv-lllmGyg/exec";

// =======================
// LOGIN (WITH EMERGENCY ADMIN)
// =======================

async function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  // 🧯 EMERGENCY ADMIN BACKDOOR (LOCAL ONLY)
  if (user === "Wyatt" && pass === "Test") {
    localStorage.setItem("session", JSON.stringify({
      username: "Wyatt",
      role: "admin"
    }));

    showContent();
    return;
  }

  // 🔌 BACKEND LOGIN
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        username: user,
        password: pass
      })
    });

    const data = await res.json();

    if (!data.success) {
      return setError(data.message || "Login failed");
    }

    localStorage.setItem("session", JSON.stringify(data));
    showContent();

  } catch (err) {
    setError("Server error or invalid backend URL");
  }
}

// =======================
// SIGNUP
// =======================

async function signup() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) return setError("Fill all fields");

  try {
    await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "signup",
        username: user,
        password: pass
      })
    });

    setSuccess("Account created!");

  } catch (err) {
    setError("Signup failed");
  }
}

// =======================
// SHOW CONTENT
// =======================

async function showContent() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("content").style.display = "block";

  const session = JSON.parse(localStorage.getItem("session"));

  document.getElementById("welcome").innerText =
    `Welcome ${session.username} (${session.role})`;

  loadPages();

  if (session.role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    renderUsers();
    renderPages();
  }
}

// =======================
// LOAD PAGES
// =======================

async function loadPages() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getPages" })
    });

    const pages = await res.json();

    const container = document.getElementById("pages");
    container.innerHTML = "";

    pages.forEach(p => {
      const div = document.createElement("div");
      div.className = "game";
      div.innerHTML = p.content;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load pages");
  }
}

// =======================
// LOAD USERS (ADMIN)
// =======================

async function renderUsers() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getUsers" })
    });

    let users = await res.json();

    const search = document.getElementById("userSearch")?.value?.toLowerCase() || "";
    const filter = document.getElementById("userFilter")?.value || "all";

    users = users.filter(u => {
      const matchSearch = u.username.toLowerCase().includes(search);

      const matchFilter =
        filter === "all" ||
        (filter === "admin" && u.role === "admin") ||
        (filter === "member" && u.role === "member") ||
        (filter === "banned" && u.banned === "true");

      return matchSearch && matchFilter;
    });

    const container = document.getElementById("userList");
    container.innerHTML = "";

    users.forEach(u => {
      const div = document.createElement("div");

      div.style.background = "#333";
      div.style.margin = "5px";
      div.style.padding = "10px";
      div.style.borderRadius = "6px";

      div.innerHTML = `
        <b>${u.username}</b><br>
        Role: ${u.role}<br>
        Banned: ${u.banned}<br>
        <button onclick="toggleBan('${u.username}')">Ban/Unban</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("User load failed");
  }
}

// =======================
// CREATE PAGE
// =======================

async function createPage() {
  const id = prompt("Page ID");
  const title = prompt("Title");
  const text = prompt("Text");

  if (!id || !title) return;

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
// TOGGLE BAN
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
  document.getElementById("tab-users").classList.add("hidden");
  document.getElementById("tab-pages").classList.add("hidden");
  document.getElementById("tab-settings").classList.add("hidden");

  document.getElementById("tab-" + tab).classList.remove("hidden");
}

// =======================
// LOGOUT
// =======================

function logout() {
  localStorage.removeItem("session");
  location.reload();
}

// =======================
// UI HELPERS
// =======================

function setError(msg) {
  const el = document.getElementById("error");
  if (!el) return;
  el.style.color = "red";
  el.innerText = msg;
}

function setSuccess(msg) {
  const el = document.getElementById("error");
  if (!el) return;
  el.style.color = "lime";
  el.innerText = msg;
}
