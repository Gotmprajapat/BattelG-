import { onUserData } from "./userService.js";

const walletBalance = document.getElementById("walletBalance");
const userName = document.getElementById("userName");

const liveContainer =
document.getElementById("liveTournamentContainer");

const upcomingContainer =
document.getElementById("upcomingTournamentContainer");

/* USER DATA */

onUserData((user)=>{

walletBalance.textContent=
Number(user.wallet||0).toFixed(2);

userName.textContent=
user.name||"Player";

});

/* ===========================
   LIVE TOURNAMENT
=========================== */

function loadLiveTournament(){

/*

Future Me

tournamentService.js

Ye function automatically
Firebase se Live Tournament
load karega.

*/

liveContainer.innerHTML=`

<div class="empty">

<h3>🔥 No Live Tournament</h3>

<p>

Live Tournament will appear here automatically.

</p>

</div>

`;

}

/* ===========================
UPCOMING
=========================== */

function loadUpcomingTournament(){

/*

Future Me

Firebase se

Upcoming Tournament

load honge.

*/

upcomingContainer.innerHTML=`

<div class="empty">

<h3>⏰ Coming Soon</h3>

<p>

Upcoming Tournament will appear here automatically.

</p>

</div>

`;

}

/* ===========================
INIT
=========================== */

loadLiveTournament();

loadUpcomingTournament();

/* ===================================
   BattleG Home Tournament System
   Part 1
=================================== */

import {
collection,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { db } from "../firebase/firebase.js";

const tournamentContainer =
document.getElementById("tournamentContainer");

function loadTournaments(){

const q = query(

collection(db,"tournaments"),

where("status","in",["live","upcoming"])

);

onSnapshot(q,(snapshot)=>{

tournamentContainer.innerHTML="";

if(snapshot.empty){

tournamentContainer.innerHTML=`

<div class="noTournament">

No Tournament Available

</div>

`;

return;

}

snapshot.forEach((doc)=>{

const t = doc.data();

const badge =
t.status==="live"
? "🟢 LIVE"
: "🟡 UPCOMING";

const disabled =
t.joinClosed ? "disabled" : "";

const text =
t.joinClosed ? "FULL" : "JOIN";

tournamentContainer.innerHTML += `

<div class="tournamentCard">

<h3>${t.title}</h3>

<p>${badge}</p>

<p>🎮 ${t.game}</p>

<p>💰 Entry ₹${t.entryFee}</p>

<p>🏆 Prize ₹${t.prizePool}</p>

<p>👥 ${t.joined}/${t.slots}</p>

<button
class="joinBtn"
${disabled}
onclick="joinTournament('${doc.id}')">

${text}

</button>

</div>

`;

});

});

}

loadTournaments();

import { auth, db } from "../firebase/firebase.js";

import {
collection,
doc,
getDoc,
setDoc,
addDoc,
updateDoc,
serverTimestamp,
increment
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

window.joinTournament = async (tournamentId) => {

const user = auth.currentUser;

if (!user) {
alert("Please Login");
return;
}

const userRef = doc(db,"users",user.uid);
const userSnap = await getDoc(userRef);

if(!userSnap.exists()){
alert("User Not Found");
return;
}

const userData = userSnap.data();

const tournamentRef = doc(db,"tournaments",tournamentId);
const tournamentSnap = await getDoc(tournamentRef);

if(!tournamentSnap.exists()){
alert("Tournament Not Found");
return;
}

const tournament = tournamentSnap.data();

const joinRef = doc(db,"joinedTournaments",user.uid+"_"+tournamentId);

const alreadyJoined = await getDoc(joinRef);

if(alreadyJoined.exists()){
alert("Already Joined");
return;
}

if(tournament.joined>=tournament.slots){
alert("Tournament Full");
return;
}

if(userData.wallet<tournament.entryFee){
alert("Insufficient Wallet Balance");
return;
}

await updateDoc(userRef,{
wallet:userData.wallet-tournament.entryFee
});

await updateDoc(tournamentRef,{
joined:increment(1)
});

await setDoc(joinRef,{
uid:user.uid,
tournamentId:tournamentId,
joinedAt:serverTimestamp(),
status:"joined"
});

await addDoc(collection(db,"transactions"),{
uid:user.uid,
type:"Tournament Join",
amount:tournament.entryFee,
status:"Success",
createdAt:serverTimestamp()
});

alert("Tournament Joined Successfully");

};
