import { auth, db } from "../firebase/firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const referral = document.getElementById("referral").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all required fields");
        return;
    }

    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            referral: referral,
            wallet: 0,
            createdAt: new Date().toISOString()
        });

        alert("Account Created Successfully!");

        window.location.href = "home.html";

    } catch (error) {
        alert(error.message);
    }

});
