// LOAD USERS
let users = JSON.parse(localStorage.getItem("users"));

if (!users) {
  users = {
    admin: {
      password: "1234",
      role: "admin",
      banned: false
    }
  };

  localStorage.setItem("users", JSON.stringify(users));
}

// AUTO LOGIN
if (localStorage.getItem("loggedIn") === "yes") {
  showContent();
}

// LOGIN
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!users[user]) {
    document.getElementById("error").innerText = "User not found";
    return;
  }

  if (users[user].banned) {
    document.getElementById("error").innerText = "This account is banned";
    return;
  }

  if (users[user].password === pass) {
    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("username", user);
    localStorage.setItem("role", users[user].role);

    showContent();
  } else {
    document.getElementById("error").innerText = "Wrong password";
  }
}

// SIGN UP
function signup() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    document.getElementById("error").innerText = "Fill all fields";
    return;
  }

  if (users[user]) {
    document.getElementById("error").innerText = "User already exists";
    return;
  }

  users[user] = {
    password: pass,
    role: "member",
    banned: false
  };

  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("error").style.color = "lime";
  document.getElementById("error").innerText = "Account created!";
}

// SHOW CONTENT
function showContent() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("content").style.display = "block";

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  document.getElementById("welcome").innerText =
    `Welcome ${username} (${role})`;

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    renderUsers();
  }
}

// ADMIN USER LIST
function renderUsers() {
  const container = document.getElementById("userList");
  container.innerHTML = "";

  Object.keys(users).forEach(username => {
    const u = users[username];

    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.margin = "5px";
    div.style.background = "#333";
    div.style.borderRadius = "8px";

    div.innerHTML = `
      <b>${username}</b><br>
      Role: ${u.role}<br>
      Status: ${u.banned ? "🚫 BANNED" : "✅ Active"}<br>
      <button onclick="toggleBan('${username}')">
        ${u.banned ? "Unban" : "Ban"}
      </button>
    `;

    container.appendChild(div);
  });
}

// BAN / UNBAN
function toggleBan(username) {
  if (username === "admin") {
    alert("You cannot ban admin");
    return;
  }

  users[username].banned = !users[username].banned;

  localStorage.setItem("users", JSON.stringify(users));

  renderUsers();
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  location.reload();
}
