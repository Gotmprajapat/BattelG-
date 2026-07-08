// ======================================
// BattleG Live Leaderboard
// File : games/tap-challenge/leaderboard.js
// ======================================

import { auth } from "../../firebase/firebase.js";

import {
loadLeaderboard,
getRank
} from "./firebase.js";

const leaderboardList =
document.getElementById("leaderboardList");

const rankText =
document.getElementById("rank");

// ----------------------------
// Live Leaderboard
// ----------------------------

loadLeaderboard((players)=>{

leaderboardList.innerHTML="";

players.forEach((player,index)=>{

const card=document.createElement("div");

card.className="leaderboard-item";

const currentUser=auth.currentUser;

const isMe=

currentUser &&

player.uid===currentUser.uid;

card.innerHTML=`

<div style="
display:flex;
justify-content:space-between;
padding:10px;
margin-bottom:8px;
border-radius:10px;
background:${isMe?"#ffb400":"#1d1d1d"};
color:${isMe?"#000":"#fff"};
">

<span>

#${index+1}

</span>

<span>

${player.score}

</span>

</div>

`;

leaderboardList.appendChild(card);

});

});

// ----------------------------
// Rank Refresh
// ----------------------------

async function refreshRank(){

const rank=await getRank();

if(rank){

rankText.innerHTML="#"+rank;

}

}

refreshRank();

setInterval(refreshRank,3000);
