import { auth, db } from "../firebase/firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {

        const data = snap.data();

        wallet = data.wallet || 0;

        document.getElementById("walletBalance").innerText = wallet;

        if (data.upi) {
            document.getElementById("upi").value = data.upi;
        }

    }

});

document.getElementById("withdrawBtn").addEventListener("click", async () => {

    const amount = Number(document.getElementById("amount").value);
    const upi = document.getElementById("upi").value.trim();

    if (amount < 50 || amount > 1000) {
        alert("Withdraw amount must be between ₹50 and ₹1000");
        return;
    }

    if (amount > wallet) {
        alert("Insufficient wallet balance");
        return;
    }

    if (upi.length < 5) {
        alert("Enter a valid UPI ID");
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

        alert("Withdraw request submitted successfully.");

        window.location.href = "home.html";

    } catch (e) {

        console.log(e);

        alert("Something went wrong.");

    }

});
