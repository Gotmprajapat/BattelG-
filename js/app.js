import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    // Agar user login hai aur login/register page par hai
    if (user) {
        if (
            window.location.pathname.includes("index.html") ||
            window.location.pathname.includes("login.html") ||
            window.location.pathname.includes("register.html") ||
            window.location.pathname === "/"
        ) {
            window.location.href = "home.html";
        }
    } else {
        // Agar login nahi hai aur protected page khola
        if (
            window.location.pathname.includes("home.html") ||
            window.location.pathname.includes("wallet.html") ||
            window.location.pathname.includes("deposit.html")
        ) {
            window.location.href = "login.html";
        }
    }

});
