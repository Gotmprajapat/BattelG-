import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tournamentBox = document.getElementById("tournamentBox");

const params = new URLSearchParams(window.location.search);

const tournamentId = params.get("id");

let currentUser = null;

let currentTournament = null;

/* ===========================
LOGIN CHECK
=========================== */

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

currentUser=user;

loadTournament();

});

/* ===========================
LOAD TOURNAMENT
=========================== */

async function loadTournament(){

try{

const tournamentRef=doc(db,"tournaments",tournamentId);

const tournamentSnap=await getDoc(tournamentRef);

if(!tournamentSnap.exists()){

tournamentBox.innerHTML="<h2>Tournament Not Found</h2>";

return;

}

currentTournament=tournamentSnap.data();

showTournament();

}catch(error){

console.log(error);

tournamentBox.innerHTML="<h2>Something Went Wrong</h2>";

}

}
/* ===========================
SHOW TOURNAMENT
=========================== */

function showTournament(){

tournamentBox.innerHTML=`

<img
class="banner"
src="${currentTournament.banner || 'assets/tournament.jpg'}">

<div class="card">

<div class="title">

${currentTournament.title}

</div>

<div class="row">

<span class="label">

🎮 Game

</span>

<span class="value">

${currentTournament.game}

</span>

</div>

<div class="row">

<span class="label">

💰 Entry Fee

</span>

<span class="value">

₹${currentTournament.entryFee}

</span>

</div>

<div class="row">

<span class="label">

🏆 Prize Pool

</span>

<span class="value">

₹${currentTournament.prizePool}

</span>

</div>

<div class="row">

<span class="label">

👥 Slots

</span>

<span class="value">

${currentTournament.joinedPlayers || 0}/${currentTournament.slots}

</span>

</div>

<div class="row">

<span class="label">

📅 Date

</span>

<span class="value">

${currentTournament.startDate}

</span>

</div>

<div class="row">

<span class="label">

🕒 Time

</span>

<span class="value">

${currentTournament.startTime}

</span>

</div>

<div class="row">

<span class="label">

Status

</span>

<span class="status ${currentTournament.status}">

${currentTournament.status.toUpperCase()}

</span>

</div>

<div class="rules">

${currentTournament.rules}

</div>

<button
class="joinBtn"
id="joinBtn">

Join Tournament

</button>

</div>

`;

document
.getElementById("joinBtn")
.addEventListener("click",joinTournament);

}
/* ===========================
JOIN TOURNAMENT
=========================== */

import {
collection,
query,
where,
getDocs,
addDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function joinTournament(){

try{

const userRef=doc(db,"users",currentUser.uid);

const userSnap=await getDoc(userRef);

const userData=userSnap.data();

/* Wallet Check */

if((userData.wallet||0)<currentTournament.entryFee){

alert("Insufficient Wallet Balance");

return;

}

/* Already Joined */

const joinQuery=query(

collection(db,"joinedTournaments"),

where("uid","==",currentUser.uid),

where("tournamentId","==",tournamentId)

);

const joinSnap=await getDocs(joinQuery);

if(!joinSnap.empty){

alert("You Already Joined This Tournament");

return;

}

/* Tournament Full */

if((currentTournament.joinedPlayers||0)>=currentTournament.slots){

alert("Tournament Full");

return;

}

/* Deduct Wallet */

await updateDoc(userRef,{

wallet:userData.wallet-currentTournament.entryFee

});

/* Add Joined Tournament */

await addDoc(collection(db,"joinedTournaments"),{

uid:currentUser.uid,

tournamentId:tournamentId,

playerName:userData.name||"Player",

status:"Joined",

score:0,

rank:0,

winning:0,

joinedAt:serverTimestamp()

});

/* Update Tournament */

await updateDoc(

doc(db,"tournaments",tournamentId),

{

joinedPlayers:(currentTournament.joinedPlayers||0)+1

}

);

/* Transaction */

await addDoc(collection(db,"transactions"),{

uid:currentUser.uid,

type:"Tournament Join",

amount:currentTournament.entryFee,

status:"Success",

createdAt:serverTimestamp()

});

alert("Tournament Joined Successfully");

location.href="mytournaments.html";

}catch(error){

console.log(error);

alert(error.message);

}

}
