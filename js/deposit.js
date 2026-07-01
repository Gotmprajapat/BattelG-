const btn = document.getElementById("submitDeposit");

btn.addEventListener("click",()=>{

const amount = Number(document.getElementById("amount").value);
const utr = document.getElementById("utr").value.trim();

if(amount < 10 || amount > 1000){
alert("Deposit amount must be between ₹10 and ₹1000");
return;
}

if(utr.length < 8){
alert("Enter a valid UTR Number");
return;
}

alert("Deposit request submitted successfully.\nWaiting for Admin Approval.");

});
