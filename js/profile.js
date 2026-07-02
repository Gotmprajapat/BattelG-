import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

      document.getElementById("userName").textContent = data.name || "Player";

      document.getElementById("userEmail").textContent = data.email || user.email;

      document.getElementById("walletBalance").textContent = data.wallet || 0;

      document.getElementById("referralCode").textContent = data.referralCode || "Not Available";

      document.getElementById("upi").value = data.upi || "";

    }

  } catch (e) {

    console.log(e);

  }

  document.getElementById("saveBtn").onclick = async () => {

    const upi = document.getElementById("upi").value.trim();

    if (upi == "") {
      alert("Enter UPI ID");
      return;
    }

    await updateDoc(doc(db, "users", user.uid), {
      upi: upi
    });

    alert("UPI Saved Successfully");

  };

  document.getElementById("logoutBtn").onclick = async () => {

    await signOut(auth);

    window.location.href = "login.html";

  };

});
