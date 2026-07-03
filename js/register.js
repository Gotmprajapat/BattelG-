import { auth, db } from "../firebase/firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Show / Hide Password

const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", () => {

  if (password.type === "password") {

    password.type = "text";

    toggle.classList.replace("fa-eye", "fa-eye-slash");

  } else {

    password.type = "password";

    toggle.classList.replace("fa-eye-slash", "fa-eye");

  }

});

// Register

document.getElementById("registerBtn").addEventListener("click", async () => {

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const pass = password.value;

  const referral = document.getElementById("referral").value.trim();

  if (name === "" || email === "" || pass === "") {

    alert("Please fill all required fields.");

    return;

  }

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);

    const user = userCredential.user;

    const referralCode =

      "BG" + Math.floor(100000 + Math.random() * 900000);

    await setDoc(doc(db, "users", user.uid), {

      uid: user.uid,

      name: name,

      email: email,

      wallet: 0,

      totalDeposit: 0,

      totalWithdraw: 0,

      totalWinning: 0,

      referralCode: referralCode,

      referredBy: referral,

      firstPaidMatch: false,

      upi: "",

      todayEarning: 0,

      totalEarning: 0,

      createdAt: serverTimestamp()

    });

    alert("Account Created Successfully");

    window.location.href = "home.html";

  } catch (e) {

    alert(e.message);

  }

});
