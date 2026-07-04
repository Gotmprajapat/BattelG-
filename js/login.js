import { auth } from "../firebase/firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Show / Hide Password
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", () => {

  if (password.type === "password") {
    password.type = "text";
    toggle.classList.remove("fa-eye");
    toggle.classList.add("fa-eye-slash");
  } else {
    password.type = "password";
    toggle.classList.remove("fa-eye-slash");
    toggle.classList.add("fa-eye");
  }

});

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const pass = password.value;

  if (email === "" || pass === "") {
    alert("Please fill all fields.");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, pass);

    window.location.href = "home.html";

  } catch (e) {

    alert("Invalid Email or Password.");

  }

});
