import { auth, db, storage } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const walletBalance=document.getElementById("walletBalance");
const amount=document.getElementById("amount");
const utr=document.getElementById("utr");
const paymentScreenshot=document.getElementById("paymentScreenshot");
const depositBtn=document.getElementById("depositBtn");
const upiId=document.getElementById("upiId");
const copyUpi=document.getElementById("copyUpi");

let currentUser=null;
let userData=null;

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

currentUser=user;

const userRef=doc(db,"users",user.uid);

const userSnap=await getDoc(userRef);

userData=userSnap.data();

walletBalance.textContent=userData.wallet||0;

/* Abhi temporary UPI */
upiId.value="battleg@upi";

});
/* ==========================
COPY UPI
========================== */

copyUpi.onclick=()=>{

navigator.clipboard.writeText(upiId.value);

alert("UPI ID Copied");

};

/* ==========================
SUBMIT DEPOSIT
========================== */

depositBtn.onclick=async()=>{

try{

const depositAmount=Number(amount.value);

const utrNumber=utr.value.trim();

const file=paymentScreenshot.files[0];

if(depositAmount<10){

alert("Minimum Deposit is ₹10");

return;

}

if(utrNumber==""){

alert("Enter UTR Number");

return;

}

if(!file){

alert("Upload Payment Screenshot");

return;

}

depositBtn.disabled=true;

depositBtn.innerText="Uploading...";

/* Upload Screenshot */

const imageRef=ref(

storage,

`depositScreenshots/${currentUser.uid}_${Date.now()}`

);

await uploadBytes(imageRef,file);

const screenshotUrl=await getDownloadURL(imageRef);

/* Save Deposit */

await addDoc(collection(db,"deposits"),{

uid:currentUser.uid,

name:userData.name||"Player",

email:currentUser.email,

amount:depositAmount,

utr:utrNumber,

screenshot:screenshotUrl,

status:"pending",

createdAt:serverTimestamp()

});

alert("Deposit Request Submitted Successfully");

amount.value="";
utr.value="";
paymentScreenshot.value="";

depositBtn.disabled=false;

depositBtn.innerText="Submit Deposit";

}catch(error){

console.log(error);

alert(error.message);

depositBtn.disabled=false;

depositBtn.innerText="Submit Deposit";

}

};
