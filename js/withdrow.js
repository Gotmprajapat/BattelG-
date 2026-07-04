import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;
let walletBalance = 0;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

      const data = userSnap.data();

      walletBalance = Number(data.wallet ?? 0);

      document.getElementById("walletBalance").textContent =
        walletBalance.toFixed(2);

      document.getElementById("upi").value =
        data.upi ?? "";

    } else {

      alert("User data not found.");

    }

  } catch (error) {

    console.log(error);
    alert("Failed to load wallet.");

  }

});

document.getElementById("withdrawBtn").addEventListener("click", async () => {

  const upi = document.getElementById("upi").value.trim();
  const amount = Number(document.getElementById("amount").value);

  if (upi === "") {
    alert("Please enter UPI ID");
    return;
  }

  if (amount <50) {
    alert("Minimum Withdraw ₹50");
    return;
  }

  if (amount > walletBalance) {
    alert("Insufficient Wallet Balance");
    return;
  }

  try {

    await addDoc(collection(db, "withdrawRequests"), {

      uid: currentUser.uid,
      upi: upi,
      amount: amount,
      status: "Pending",
      createdAt: serverTimestamp()

    });

    alert("Withdraw request submitted successfully.");

    document.getElementById("amount").value = "";

  } catch (error) {

    console.log(error);
    alert("Something went wrong.");

  }

});
