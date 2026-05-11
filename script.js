
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =======================
// LOGIN
// =======================

window.login = async function () {
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  const email = emailEl?.value?.trim();
  const password = passEl?.value?.trim();

  console.log("LOGIN TRY:", email, password);

  if (!email || !password) {
    alert("Missing email or password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("content").style.display = "block";

    loadPages();

  } catch (e) {
    alert("Login failed: " + e.message);
  }
};


// =======================
// SIGNUP
// =======================

window.signup = async function () {
  const emailEl = document.getElementById("email");
  const passEl = document.getElementById("password");

  const email = emailEl?.value?.trim();
  const password = passEl?.value?.trim();

  console.log("SIGNUP TRY:", email, password);

  if (!email || !password) {
    alert("Missing email or password");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created!");
  } catch (e) {
    alert("Signup failed: " + e.message);
  }
};


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

  const container = document.getElementById("pages");
  container.innerHTML = "";

  snap.forEach(doc => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = doc.data().content;
    container.appendChild(div);
  });
};


// =======================
// CREATE PAGE (ADMIN)
// =======================

window.createPage = async function () {
  const title = prompt("Page title");
  const text = prompt("Page content (HTML allowed)");

  if (!title || !text) return;

  await addDoc(collection(db, "pages"), {
    content: `<h2>${title}</h2><p>${text}</p>`
  });

  loadPages();
};


// =======================
// GLOBAL SAFETY (IMPORTANT)
// =======================

window.auth = auth;
window.db = db;
