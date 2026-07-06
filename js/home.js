import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
collection,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const userName=document.getElementById("userName");
const wallet=document.getElementById("wallet");
const notice=document.getElementById("notice");
const liveTournament=document.getElementById("liveTournament");

let currentUser=null;

/* ==========================
LOGIN CHECK
========================== */

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";
return;

}

currentUser=user;

loadUser();

loadSettings();

loadLiveTournament();

});

/* ==========================
USER DATA
========================== */

function loadUser(){

const ref=doc(db,"users",currentUser.uid);

onSnapshot(ref,(snap)=>{

if(!snap.exists()) return;

const data=snap.data();

userName.textContent=data.name||"Player";

wallet.textContent=data.wallet||0;

});

}

/* ==========================
APP SETTINGS
========================== */

function loadSettings(){

const ref=doc(db,"settings","app");

onSnapshot(ref,(snap)=>{

if(!snap.exists()) return;

const data=snap.data();

notice.textContent=data.notice||"Welcome To BattleG";

/* Maintenance */

if(data.maintenance===true){

document.body.innerHTML=`

<div style="
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#111;
color:#fff;
font-family:Poppins;
text-align:center;
padding:20px;
">

<div>

<h1>🚧 Maintenance</h1>

<p>

BattleG is under maintenance.

Please try again later.

</p>

</div>

</div>

`;

return;

}

});

}

/* ==========================
LIVE TOURNAMENT
========================== */

function loadLiveTournament(){

const q=query(

collection(db,"tournaments"),

where("status","==","live")

);

onSnapshot(q,(snapshot)=>{

let list=[];

snapshot.forEach((docu)=>{

list.push({

id:docu.id,

...docu.data()

});

});

list.sort((a,b)=>{

const aTime=a.createdAt?.seconds||0;

const bTime=b.createdAt?.seconds||0;

return bTime-aTime;

});

liveTournament.innerHTML="";

if(list.length===0){

liveTournament.innerHTML=`

<h3 style="text-align:center;">

No Live Tournament

</h3>

`;

return;

      }

list.forEach((item)=>{

liveTournament.innerHTML+=`

<div class="tournamentCard">

<h3>${item.title || "Tournament"}</h3>

<p><b>Game :</b> ${item.game || "Free Fire"}</p>

<p><b>Entry :</b> ₹${item.entryFee || 0}</p>

<p><b>Prize :</b> ₹${item.prize || 0}</p>

<p><b>Slots :</b> ${item.joinedSlots || 0}/${item.totalSlots || item.slots || 0}</p>

<p><b>Room Time :</b> ${item.roomTime || "--:--"}</p>

<button
class="joinBtn"
${(item.joinedSlots || 0) >= (item.totalSlots || item.slots || 0) ? "disabled" : ""}
onclick="joinTournament('${item.id}')">

${(item.joinedSlots || 0) >= (item.totalSlots || item.slots || 0)
? "Tournament Full"
: "Join Now"}

</button>

</div>

`;

});

});

}

/* ==========================
JOIN TOURNAMENT
========================== */

window.joinTournament=(id)=>{

window.location.href=`tournament.html?id=${id}`;

};

/* ==========================
ERROR HANDLING
========================== */

window.addEventListener("error",(e)=>{

console.log(e.error);

});

console.log("BattleG Home Loaded");
