// BattelG Home

console.log("Home Loaded");

// Welcome Animation
window.addEventListener("load", () => {
    document.body.style.opacity = "1";
});

// Tournament Join Buttons
const joinButtons = document.querySelectorAll(".card button");

joinButtons.forEach((button) => {
    button.addEventListener("click", () => {
        alert("Tournament System Coming Soon 🚀");
    });
});

// Deposit Button
document.querySelector(".wallet-btn button:first-child")
.addEventListener("click", () => {
    alert("Deposit Page Coming Soon 💰");
});

// Withdraw Button
document.querySelector(".wallet-btn button:last-child")
.addEventListener("click", () => {
    alert("Withdraw Page Coming Soon 💸");
});
