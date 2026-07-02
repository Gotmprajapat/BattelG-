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

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {

        const data = snap.data();

        document.getElementById("userName").innerText = data.name || "";
        document.getElementById("userEmail").innerText = data.email || "";
        document.getElementById("walletBalance").innerText = data.wallet || 0;
        document.getElementById("referralCode").innerText = data.referralCode || "";

        if (data.upi) {
            document.getElementById("upi").value = data.upi;
        }

    }

});

document.getElementById("saveBtn").addEventListener("click", async () => {

    const upi = document.getElementById("upi").value.trim();

    if (upi.length < 5) {
        alert("Enter a valid UPI ID");
        return;
    }

    await updateDoc(doc(db, "users", currentUser.uid), {
        upi: upi
    });

    alert("UPI ID Saved Successfully");

});

document.getElementById("logoutBtn").addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
