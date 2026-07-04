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

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {

            const data = userDoc.data();

            wallet = parseFloat(data.wallet || 0);

            document.getElementById("walletBalance").innerText =
                wallet.toFixed(2);

            document.getElementById("upi").value =
                data.upi || "";

        }

    } catch (error) {

        console.log(error);
        alert("Failed to load wallet.");

    }

});

document.getElementById("withdrawBtn").addEventListener("click", async () => {

    if (!currentUser) {
        alert("Please wait...");
        return;
    }

    const upi = document.getElementById("upi").value.trim();

    const amount = parseFloat(
        document.getElementById("amount").value
    );

    if (upi === "") {

        alert("Enter UPI ID");
        return;

    }

    if (isNaN(amount) || amount < 50) {

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

        document.getElementById("amount").value = "";

    } catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

});
