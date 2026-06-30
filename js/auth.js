import { auth } from "../firebase/firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if(email === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {

        alert("Login Successful");

        window.location.href = "home.html";

    })
    .catch((error) => {

        alert(error.message);

    });

});
