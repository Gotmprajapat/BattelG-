import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
collection,
query,
where,
onSnapshot,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const myTournamentList=document.getElementById("myTournamentList");

let currentUser=null;

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";
return;

}

currentUser=user;

loadMyTournaments();

});

function loadMyTournaments(){

const q=query(

collection(db,"joinedTournaments"),

where("uid","==",currentUser.uid)

);

onSnapshot(q,async(snapshot)=>{

myTournamentList.innerHTML="";

if(snapshot.empty){

myTournamentList.innerHTML=`

<div class="loading">

No Tournament Joined Yet

</div>

`;

return;

}

for(const joinDoc of snapshot.docs){

const joinData=joinDoc.data();

const tournamentRef=doc(db,"tournaments",joinData.tournamentId);

const tournamentSnap=await getDoc(tournamentRef);

if(!tournamentSnap.exists()) continue;

const t=tournamentSnap.data();

let statusClass="upcoming";

if(t.status==="live") statusClass="live";

if(t.status==="completed") statusClass="completed";

myTournamentList.innerHTML+=`

<div class="tournamentCard">

<img
class="tournamentImage"
src="${t.image||'images/tournament.jpg'}">

<div class="tournamentTitle">

${t.title}

</div>

<div class="info">

<span class="label">

Entry

</span>

<span class="value">

₹${t.entryFee}

</span>

</div>

<div class="info">

<span class="label">

Prize

</span>

<span class="value">

₹${t.prize}

</span>

</div>

<div class="info">

<span class="label">

Date

</span>

<span class="value">

${t.date||"--"}

</span>

</div>

<div class="info">

<span class="label">

Time

</span>

<span class="value">

${t.time||"--"}

</span>

</div>

<div class="status ${statusClass}">

${t.status.toUpperCase()}

</div>

<button
class="roomBtn"
onclick="location.href='tournament.html?id=${joinData.tournamentId}'">

View Details

</button>

</div>

`;

}

});

}

console.log("BattleG My Tournaments Loaded");
