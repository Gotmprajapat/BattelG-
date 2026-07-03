import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (snap.exists()) {

      const data = snap.data();

      document.getElementById("welcomeText").textContent =
        "Welcome, " + (data.name || "Player");

      document.getElementById("walletBalance").textContent =
        Number(data.wallet || 0).toFixed(2);

    }

  } catch (error) {

    console.log(error);

  }

});

// Future Ready
// Games will be loaded automatically here later.
