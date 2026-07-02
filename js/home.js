import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const userName = document.getElementById("userName");
const walletBalance = document.getElementById("walletBalance");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

      const data = userSnap.data();

      userName.textContent = data.name || "Player";
      walletBalance.textContent = data.wallet || 0;

    } else {

      userName.textContent = "Player";
      walletBalance.textContent = "0";

    }

  } catch (error) {

    console.error("Home Error:", error);

    alert("Unable to load user data.");

  }

});
