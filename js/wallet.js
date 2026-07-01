// BattelG Wallet

console.log("Wallet Loaded");

// Temporary Balance
let balance = 0;

document.getElementById("balance").innerText = `₹${balance.toFixed(2)}`;

// Future Firebase Wallet Data
window.addEventListener("load", () => {
    console.log("Wallet Ready");
});
