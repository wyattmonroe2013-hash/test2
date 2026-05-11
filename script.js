
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// =======================
// FIREBASE CONFIG
// =======================

const firebaseConfig = {
  apiKey: "AIzaSyAjJIl9ahqtTxqYpbgDWMf6WvYJ86QQ4nk",
  authDomain: "test-5c980.firebaseapp.com",
  projectId: "test-5c980",
  storageBucket: "test-5c980.firebasestorage.app",
  messagingSenderId: "934327818159",
  appId: "1:934327818159:web:06ad5d8fc6670a327a015a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// LOGIN
// =======================

window.login = async function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    showContent();
  } catch (e) {
    msg.innerText = e.message;
  }
};

// =======================
// SIGNUP
// =======================

window.signup = async function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    msg.innerText = "Account created!";
  } catch (e) {
    msg.innerText = e.message;
  }
};

// =======================
// SHOW CONTENT
// =======================

function showContent() {
  loginPage.style.display = "none";
  content.style.display = "block";

  welcome.innerText = "Logged in";

  loadPages();
}

// =======================
// LOGOUT
// =======================

window.logout = async function () {
  await signOut(auth);
  location.reload();
};

// =======================
// LOAD PAGES
// =======================

window.loadPages = async function () {
  const snap = await getDocs(collection(db, "pages"));

  pages.innerHTML = "";

  snap.forEach(doc => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = doc.data().content;
    pages.appendChild(div);
  });
};

// =======================
// CREATE PAGE (ADMIN)
// =======================

window.createPage = async function () {
  const title = prompt("Title");
  const text = prompt("Text");

  await addDoc(collection(db, "pages"), {
    content: `<h3>${title}</h3><p>${text}</p>`
  });

  loadPages();
};

// =======================
// LOAD USERS (simple admin viewer)
// =======================

window.loadUsers = async function () {
  const snap = await getDocs(collection(db, "users"));

  userList.innerHTML = "";

  snap.forEach(doc => {
    const u = doc.data();
    const div = document.createElement("div");

    div.innerHTML = `${u.email || "no email"}`;
    userList.appendChild(div);
  });
};
