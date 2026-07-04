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
