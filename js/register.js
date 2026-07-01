import { auth, db } from "../firebase/firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;
const referral = document.getElementById("referral").value.trim();

if(name==="" || email==="" || password===""){
alert("Please fill all required fields.");
return;
}

try{

const userCredential = await createUserWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

await setDoc(doc(db,"users",user.uid),{

name:name,
email:email,
wallet:0,
totalDeposit:0,
totalWithdraw:0,
totalWinning:0,
referralCode:"BG"+Math.floor(Math.random()*999999),
referredBy:referral,
firstPaidMatch:false,
createdAt:serverTimestamp()

});

alert("Account Created Successfully");

window.location.href="home.html";

}catch(error){

alert(error.message);

}

});
