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

const referralCode=document.getElementById("referralCode");
const totalReferrals=document.getElementById("totalReferrals");
const referralEarning=document.getElementById("referralEarning");
const copyCode=document.getElementById("copyCode");
const shareBtn=document.getElementById("shareBtn");

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

referralCode.value=userData.referralCode||"";

loadReferralData();

});
async function loadReferralData(){

const refQuery=query(

collection(db,"users"),

where("referredBy","==",userData.referralCode)

);

const refSnap=await getDocs(refQuery);

totalReferrals.textContent=refSnap.size;

let total=0;

refSnap.forEach((doc)=>{

const data=doc.data();

total+=(data.referralBonus||0);

});

referralEarning.textContent=total;

}

/* Copy */

copyCode.onclick=()=>{

navigator.clipboard.writeText(referralCode.value);

alert("Referral Code Copied");

};

/* Share */

shareBtn.onclick=()=>{

const text=

`🎮 Join BattleG & Earn Daily!

Use My Referral Code:

${referralCode.value}

Download Now!`;

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
