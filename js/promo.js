import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
updateDoc,
collection,
query,
where,
getDocs,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const promoCode=document.getElementById("promoCode");
const applyPromo=document.getElementById("applyPromo");
const promoMessage=document.getElementById("promoMessage");

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

});

applyPromo.onclick=async()=>{

try{

const code=promoCode.value.trim().toUpperCase();

if(!code){

promoMessage.innerHTML="Enter Promo Code";

promoMessage.style.color="red";

return;

}

applyPromo.disabled=true;

applyPromo.innerText="Checking...";

/* Check Promo */

const promoQuery=query(

collection(db,"promoCodes"),

where("code","==",code)

);

const promoSnap=await getDocs(promoQuery);

if(promoSnap.empty){

promoMessage.innerHTML="Invalid Promo Code";

promoMessage.style.color="red";

applyPromo.disabled=false;
applyPromo.innerText="Apply Promo";

return;

}

const promoDoc=promoSnap.docs[0];

const promoData=promoDoc.data();

/* Active */

if(promoData.status!="active"){

promoMessage.innerHTML="Promo Expired";

promoMessage.style.color="red";

applyPromo.disabled=false;
applyPromo.innerText="Apply Promo";

return;

}

/* Already Used */

const usedRef=doc(db,"usedPromo",currentUser.uid+"_"+code);

const usedSnap=await getDoc(usedRef);

if(usedSnap.exists()){

promoMessage.innerHTML="Promo Already Used";

promoMessage.style.color="red";

applyPromo.disabled=false;
applyPromo.innerText="Apply Promo";

return;

}
  /* Usage Limit */

if((promoData.used||0)>=promoData.limit){

promoMessage.innerHTML="Promo Usage Limit Reached";

promoMessage.style.color="red";

applyPromo.disabled=false;
applyPromo.innerText="Apply Promo";

return;

}

/* Wallet Update */

await updateDoc(doc(db,"users",currentUser.uid),{

wallet:(userData.wallet||0)+promoData.reward

});

/* Update Promo Used */

await updateDoc(doc(db,"promoCodes",promoDoc.id),{

used:(promoData.used||0)+1

});

/* Save Used Promo */

await updateDoc(doc(db,"usedPromo",currentUser.uid+"_"+code),{

uid:currentUser.uid,

promoCode:code,

reward:promoData.reward,

usedAt:serverTimestamp()

}).catch(async()=>{

await addDoc(collection(db,"usedPromo"),{

uid:currentUser.uid,

promoCode:code,

reward:promoData.reward,

usedAt:serverTimestamp()

});

});

/* Transaction */

await addDoc(collection(db,"transactions"),{

uid:currentUser.uid,

type:"Promo Reward",

amount:promoData.reward,

status:"Success",

createdAt:serverTimestamp()

});

/* Notification */

await addDoc(collection(db,"notifications"),{

uid:currentUser.uid,

title:"Promo Applied",

message:`₹${promoData.reward} added successfully.`,

createdAt:serverTimestamp()

});

promoMessage.innerHTML=`Promo Applied Successfully +₹${promoData.reward}`;

promoMessage.style.color="#00e676";

promoCode.value="";

applyPromo.disabled=false;
applyPromo.innerText="Apply Promo";

}catch(error){

console.log(error);

promoMessage.innerHTML=error.message;

promoMessage.style.color="red";

applyPromo.disabled=false;
applyPromo.innerText="Apply Promo";

}

};

console.log("BattleG Promo Module Loaded");
