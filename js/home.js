import { auth, db } from "../firebase/firebase.js";

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

const snap = await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data = snap.data();

document.getElementById("userName").innerText = data.name;

document.getElementById("walletBalance").innerText = data.wallet;

}

});

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=async()=>{

await signOut(auth);

window.location.href="login.html";

}

}
