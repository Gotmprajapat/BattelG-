import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
updateDoc,
collection,
addDoc,
query,
where,
getDocs,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const walletBalance=document.getElementById("walletBalance");
const amount=document.getElementById("amount");
const upi=document.getElementById("upi");
const withdrawBtn=document.getElementById("withdrawBtn");

let currentUser;
let userData;

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

if(userData.upiId){

upi.value=userData.upiId;

}

});
withdrawBtn.onclick=async()=>{

try{

const withdrawAmount=Number(amount.value);

const upiId=upi.value.trim();

if(withdrawAmount<50){

alert("Minimum Withdraw ₹50");

return;

}

if(withdrawAmount>(userData.wallet||0)){

alert("Insufficient Wallet Balance");

return;

}

if(!upiId){

alert("Enter UPI ID");

return;

}

/* Check Pending Withdraw */

const pendingQuery=query(

collection(db,"withdraws"),

where("uid","==",currentUser.uid),

where("status","==","pending")

);

const pendingSnap=await getDocs(pendingQuery);

if(!pendingSnap.empty){

alert("You already have a pending withdraw request.");

return;

}

withdrawBtn.disabled=true;
withdrawBtn.innerText="Submitting...";

/* Save UPI */

await updateDoc(doc(db,"users",currentUser.uid),{

upiId:upiId

});

/* Save Withdraw Request */

await addDoc(collection(db,"withdraws"),{

uid:currentUser.uid,

name:userData.name||"Player",

amount:withdrawAmount,

upiId:upiId,

status:"pending",

createdAt:serverTimestamp()

});

alert("Withdraw Request Submitted Successfully");

amount.value="";

withdrawBtn.disabled=false;
withdrawBtn.innerText="Request Withdraw";

}catch(error){

console.log(error);

alert(error.message);

withdrawBtn.disabled=false;
withdrawBtn.innerText="Request Withdraw";

}

};
