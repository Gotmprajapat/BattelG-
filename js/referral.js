import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;
let referralCode = "";

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="index.html";
return;

}

currentUser = user;

try{

const userSnap = await getDoc(doc(db,"users",user.uid));

if(userSnap.exists()){

const data = userSnap.data();

referralCode = data.referralCode || "";

document.getElementById("referralCode").textContent = referralCode;

}

loadReferrals();

}catch(e){

console.log(e);

}

});

async function loadReferrals(){

const list = document.getElementById("referralList");

list.innerHTML="";

const q = query(

collection(db,"users"),

where("referredBy","==",referralCode)

);

const snap = await getDocs(q);

if(snap.empty){

list.innerHTML="<div class='empty'>No Referrals Yet</div>";

return;

}

snap.forEach(docu=>{

const data = docu.data();

const status = data.firstPaidMatch ? "Success" : "Pending";

const className = data.firstPaidMatch ? "success" : "pending";

list.innerHTML += `

<div class="referralItem">

<div>

<div class="referralName">

${data.name}

</div>

<small>${data.email}</small>

</div>

<div class="status ${className}">

${status}

</div>

</div>

`;

});

}

document.getElementById("copyBtn").onclick=()=>{

navigator.clipboard.writeText(referralCode);

alert("Referral Code Copied");

};

document.getElementById("shareBtn").onclick=()=>{

const text =

`Join BattleG and earn rewards!

Use my referral code:

${referralCode}`;

if(navigator.share){

navigator.share({

title:"BattleG",

text:text

});

}else{

navigator.clipboard.writeText(text);

alert("Referral Message Copied");

}

};
