import { auth, db } from "../firebase/firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

});

const continueBtn = document.getElementById("continueBtn");
const submitBtn = document.getElementById("submitBtn");

continueBtn.addEventListener("click", () => {

    const amount = Number(document.getElementById("amount").value);

    if (amount < 10 || amount > 1000) {
        alert("Deposit amount must be between ₹10 and ₹1000");
        return;
    }

    document.getElementById("showAmount").innerText = amount;

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";

});

submitBtn.addEventListener("click", async () => {

    const paid = document.getElementById("paid").checked;
    const utr = document.getElementById("utr").value.trim();
    const amount = Number(document.getElementById("showAmount").innerText);

    if (!paid) {
        alert("Please confirm payment.");
        return;
    }

    if (utr.length < 8) {
        alert("Enter a valid UTR Number.");
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

        alert("Deposit request submitted successfully.");

        window.location.href = "home.html";

    } catch (e) {

        alert("Failed to submit request.");

        console.log(e);

    }

});
