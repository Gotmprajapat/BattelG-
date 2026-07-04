import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;
let wallet = 0;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  try {

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {

      const data = snap.data();

      wallet = Number(data.wallet || 0);

      document.getElementById("walletBalance").textContent =
      wallet.toFixed(2);

      document.getElementById("upi").value =
      data.upi || "";

    }

  } catch (e) {

    console.log(e);

  }

});

document.getElementById("withdrawBtn").addEventListener("click", async () => {

  const upi =
  document.getElementById("upi").value.trim();

  const amount =
  Number(document.getElementById("amount").value);

  if (upi === "") {

    alert("Please Enter UPI ID");

    return;

  }

  if (!amount || amount < 20) {

    alert("Minimum Withdraw ₹20");

    return;

  }

  if (amount > wallet) {

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

    alert("Withdraw Request Submitted Successfully");

    document.getElementById("amount").value = "";

  } catch (e) {

    console.log(e);

    alert("Something went wrong.");

  }

});
