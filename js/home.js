import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const userName = document.getElementById("userName");
const walletBalance = document.getElementById("walletBalance");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      userName.textContent = data.name || "Player";
      walletBalance.textContent = data.wallet || 0;
    } else {
      userName.textContent = "Player";
      walletBalance.textContent = "0";
    }

  } catch (e) {
    console.log(e);
    alert("Failed to load user data.");
  }

});

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "login.html";

});
