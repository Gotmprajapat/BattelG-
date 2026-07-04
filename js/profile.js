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

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="index.html";
return;

}

currentUser=user;

try{

const snap=await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data=snap.data();

document.getElementById("userName").textContent=data.name||"Player";

document.getElementById("userEmail").textContent=data.email||"";

document.getElementById("walletBalance").textContent=Number(data.wallet||0).toFixed(2);

document.getElementById("totalDeposit").textContent="₹"+Number(data.totalDeposit||0).toFixed(2);

document.getElementById("totalWithdraw").textContent="₹"+Number(data.totalWithdraw||0).toFixed(2);

document.getElementById("totalWinning").textContent="₹"+Number(data.totalWinning||0).toFixed(2);

document.getElementById("totalPlayed").textContent=data.totalPlayed||0;

document.getElementById("totalWon").textContent=data.totalWon||0;

document.getElementById("referralCode").value=data.referralCode||"";

document.getElementById("upi").value=data.upi||"";

}

}catch(e){

console.log(e);

}

});

document.getElementById("copyReferral").onclick=()=>{

const code=document.getElementById("referralCode");

code.select();

document.execCommand("copy");

alert("Referral Code Copied");

};

document.getElementById("saveUPI").onclick=async()=>{

const upi=document.getElementById("upi").value.trim();

if(upi==""){

alert("Enter UPI ID");

return;

}

try{

await updateDoc(doc(db,"users",currentUser.uid),{

upi:upi

});

alert("UPI Saved Successfully");

}catch(e){

console.log(e);

alert("Failed to Save UPI");

}

};

document.getElementById("logoutBtn").onclick=async()=>{

await signOut(auth);

window.location.href="index.html";

};
