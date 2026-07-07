import { db } from "../firebase/firebase.js";

import {
collection,
query,
orderBy,
limit,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firstName=document.getElementById("firstName");
const firstAmount=document.getElementById("firstAmount");

const secondName=document.getElementById("secondName");
const secondAmount=document.getElementById("secondAmount");

const thirdName=document.getElementById("thirdName");
const thirdAmount=document.getElementById("thirdAmount");

const leaderboardList=document.getElementById("leaderboardList");

/* ==========================
LOAD LEADERBOARD
========================== */

const q=query(

collection(db,"users"),

orderBy("totalWinning","desc"),

limit(100)

);

onSnapshot(q,(snapshot)=>{

let players=[];

snapshot.forEach((doc)=>{

players.push(doc.data());

});

/* TOP 3 */

if(players.length>0){

firstName.textContent=players[0].name||"---";

firstAmount.textContent="₹"+(players[0].totalWinning||0);

}

if(players.length>1){

secondName.textContent=players[1].name||"---";

secondAmount.textContent="₹"+(players[1].totalWinning||0);

}

if(players.length>2){

thirdName.textContent=players[2].name||"---";

thirdAmount.textContent="₹"+(players[2].totalWinning||0);

}

/* LIST */

leaderboardList.innerHTML="";

if(players.length===0){

leaderboardList.innerHTML=`

<div class="playerCard">

<h3 style="width:100%;text-align:center;">

No Players Found

</h3>

</div>

`;

return;

}

players.forEach((item,index)=>{

leaderboardList.innerHTML+=`

<div class="playerCard">

<div class="left">

<div class="rank">

${index+1}

</div>

<div class="playerInfo">

<h3>${item.name||"Player"}</h3>

<p>

Wins : ${item.totalWins||0}

&nbsp;&nbsp;|&nbsp;&nbsp;

Matches : ${item.totalMatches||0}

</p>

</div>

</div>

<div class="amount">

₹${item.totalWinning||0}

</div>

</div>

`;

});

});

console.log("BattleG Leaderboard Loaded");
