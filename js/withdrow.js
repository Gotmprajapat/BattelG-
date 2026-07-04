import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
addDoc,
collection,
serverTimestamp,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;
let wallet = 0;

const walletBalance = document.getElementById("walletBalance");
const upiInput = document.getElementById("upi");
const amountInput = document.getElementById("amount");
const withdrawBtn = document.getElementById("withdrawBtn");

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);

    onSnapshot(userRef, (snap) => {

        if (!snap.exists()) return;

        const data = snap.data();

        wallet = Number(data.wallet || 0);

        walletBalance.textContent = wallet.toFixed(2);

        upiInput.value = data.upi || "";

    }, (error) => {

        console.log(error);

    });

});

withdrawBtn.addEventListener("click", async () => {

    if (!currentUser) {
        alert("Please wait...");
        return;
    }

    const amount = Number(amountInput.value);

    const upi = upiInput.value.trim();

    if (upi === "") {
        alert("Please Enter UPI ID");
        return;
    }

    if (amount < 50) {
        alert("Minimum Withdraw ₹50");
        return;
    }

    if (amount > wallet) {
        alert("Insufficient Wallet Balance");
        return;
    }

    try {

        await addDoc(collection(db, "withdrawRequests"), {

            uid: currentUser.uid,
            amount: amount,
            upi: upi,
            status: "Pending",
            createdAt: serverTimestamp()

        });

        alert("Withdraw Request Submitted Successfully");

        amountInput.value = "";

    } catch (e) {

        console.log(e);

        alert("Something Went Wrong");

    }

});
