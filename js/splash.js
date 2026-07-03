firebase.auth().onAuthStateChanged((user) => {
    setTimeout(() => {
        if (user) {
            window.location.href = "home.html";
        } else {
            window.location.href = "login.html";
        }
    }, 2500);
});
