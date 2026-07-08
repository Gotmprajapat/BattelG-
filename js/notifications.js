import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
collection,
query,
where,
orderBy,
onSnapshot,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const notificationList=document.getElementById("notificationList");

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";

return;

}

loadNotifications(user.uid);

});

/* ==========================
LOAD NOTIFICATIONS
========================== */

function loadNotifications(uid){

const q=query(

collection(db,"notifications"),

where("uid","==",uid),

orderBy("createdAt","desc")

);

onSnapshot(q,async(snapshot)=>{

notificationList.innerHTML="";

if(snapshot.empty){

notificationList.innerHTML=`

<div class="loading">

No Notifications

</div>

`;

return;

}

for(const item of snapshot.docs){

const data=item.data();

const date=data.createdAt?

new Date(

data.createdAt.seconds*1000

).toLocaleString()

:

"Just Now";

notificationList.innerHTML+=`

<div class="notificationCard">

<h3>${data.title}</h3>

<p>${data.message}</p>

<span>${date}</span>

</div>

`;

/* Mark as Read */

if(data.read!==true){

await updateDoc(

doc(db,"notifications",item.id),

{

read:true

}

);

}

}

});

}

console.log("BattleG Notifications Loaded");
