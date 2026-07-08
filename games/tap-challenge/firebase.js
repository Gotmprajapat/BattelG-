// ====================================
// BattleG Tap Challenge Firebase
// File : games/tap-challenge/firebase.js
// ====================================

import { auth, rtdb } from "../../firebase/firebase.js";

import {
ref,
set,
update,
get,
onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// Tournament ID URL se
export const tournamentId =
new URLSearchParams(window.location.search).get("id");

// ----------------------------
// Save Score
// ----------------------------

export async function saveScore(score,taps){

const user=auth.currentUser;

if(!user) return;

await update(

ref(rtdb,`gameScores/${tournamentId}/${user.uid}`),

{

uid:user.uid,

score:score,

taps:taps,

updatedAt:Date.now(),

status:"playing"

}

);

}

// ----------------------------
// Finish Tournament
// ----------------------------

export async function finishScore(score,taps){

const user=auth.currentUser;

if(!user) return;

await update(

ref(rtdb,`gameScores/${tournamentId}/${user.uid}`),

{

uid:user.uid,

score:score,

taps:taps,

updatedAt:Date.now(),

status:"finished"

}

);

}

// ----------------------------
// Live Leaderboard
// ----------------------------

export function loadLeaderboard(callback){

const leaderboardRef=

ref(rtdb,`gameScores/${tournamentId}`);

onValue(leaderboardRef,(snapshot)=>{

const data=snapshot.val();

if(!data){

callback([]);

return;

}

const players=Object.values(data);

players.sort((a,b)=>b.score-a.score);

callback(players);

});

}

// ----------------------------
// User Rank
// ----------------------------

export async function getRank(){

const user=auth.currentUser;

if(!user) return null;

const snap=await get(

ref(rtdb,`gameScores/${tournamentId}`)

);

if(!snap.exists()) return null;

const players=

Object.values(snap.val());

players.sort((a,b)=>b.score-a.score);

return players.findIndex(

x=>x.uid===user.uid

)+1;

  }
