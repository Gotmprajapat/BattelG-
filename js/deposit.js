import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

});

document.getElementById("submitDeposit").addEventListener("click", async () => {

  const amount = Number(document.getElementById("amount").value);

  const utr = document.getElementById("utr").value.trim();

  if (!amount || amount < 10) {
    alert("Minimum Deposit ₹10");
    return;
  }

  if (utr.length < 8) {
    alert("Enter Valid UTR Number");
    return;
  }

  try {

    await addDoc(collection(db, "depositRequests"), {

      uid: currentUser.uid,

      amount: amount,

      utr: utr,

      status: "Pending",

      createdAt: serverTimestamp()

    });

    alert("Deposit Request Submitted Successfully.");

    document.getElementById("amount").value = "";
    document.getElementById("utr").value = "";

  } catch (e) {

    alert("Something went wrong.");

    console.log(e);

  }

});
