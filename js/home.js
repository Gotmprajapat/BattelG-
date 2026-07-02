import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Elements
const userName = document.getElementById("userName");
const walletBalance = document.getElementById("walletBalance");

// Login Check
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

            userName.innerText = data.name || "Player";
            walletBalance.innerText = data.wallet || 0;

        } else {

            userName.innerText = "Player";
            walletBalance.innerText = 0;

        }

    } catch (error) {

        console.error("Home Error:", error);
        alert("Failed to load user data.");

    }

});
