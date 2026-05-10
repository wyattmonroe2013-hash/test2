
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwg4U18Nw_3NfWbOBAAywI1ztVBCLBwAVvpCAldd5ZoXkiHVABpFgX_9d6PcAEhwf-c3g/exec";

// =======================
// LOGIN
// =======================

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    return setError("Fill all fields");
  }

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      username,
      password
    })
  });

  const data = await res.json();

  if (!data.success) {
    return setError(data.message || "Login failed");
  }

  localStorage.setItem("session", JSON.stringify(data));

  showContent();
}

// =======================
// SIGNUP
// =======================

async function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    return setError("Fill all fields");
  }

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "signup",
      username,
      password
    })
  });

  const data = await res.json();

  if (!data.success) {
    return setError("Signup failed");
  }

  setSuccess("Account created!");
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
    loadUsers();
  }
}

// =======================
// LOAD PAGES FROM BACKEND
// =======================

async function loadPages() {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getPages"
    })
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
}

// =======================
// LOAD USERS (ADMIN)
// =======================

async function loadUsers() {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getUsers"
    })
  });

  const users = await res.json();

  const container = document.getElementById("userList");
  container.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.style.background = "#333";
    div.style.margin = "5px";
    div.style.padding = "10px";

    div.innerHTML = `
      <b>${u.username}</b><br>
      Role: ${u.role}<br>
      Banned: ${u.banned}<br>
      <button onclick="toggleBan('${u.username}')">Ban/Unban</button>
    `;

    container.appendChild(div);
  });
}

// =======================
// CREATE PAGE (ADMIN)
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

  loadUsers();
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
  el.style.color = "red";
  el.innerText = msg;
}

function setSuccess(msg) {
  const el = document.getElementById("error");
  el.style.color = "lime";
  el.innerText = msg;
}
