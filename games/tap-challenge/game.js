// ===============================
// BattleG Tap Challenge Game
// File: games/tap-challenge/game.js
// Part 1
// ===============================

const tapButton = document.getElementById("tapButton");
const scoreText = document.getElementById("score");
const tapCountText = document.getElementById("tapCount");
const tpsText = document.getElementById("tps");
const timeLeftText = document.getElementById("timeLeft");
const rankText = document.getElementById("rank");

let score = 0;
let taps = 0;
let tps = 0;

let tournamentTime = 15 * 60; // 15 Minutes Default

let gameRunning = true;

// -------------------------------
// Restore Previous Game
// -------------------------------

const savedScore = localStorage.getItem("bg_score");
const savedTaps = localStorage.getItem("bg_taps");
const savedTime = localStorage.getItem("bg_time");

if(savedScore){

score = Number(savedScore);

}

if(savedTaps){

taps = Number(savedTaps);

}

if(savedTime){

tournamentTime = Number(savedTime);

}

scoreText.innerHTML = score;
tapCountText.innerHTML = taps;

// -------------------------------
// Tap Button
// -------------------------------

tapButton.addEventListener("click",()=>{

if(!gameRunning) return;

score++;

taps++;

scoreText.innerHTML = score;

tapCountText.innerHTML = taps;

// Save

localStorage.setItem("bg_score",score);

localStorage.setItem("bg_taps",taps);

});

// -------------------------------
// Timer
// -------------------------------

setInterval(()=>{

if(!gameRunning) return;

if(tournamentTime<=0){

gameRunning=false;

tapButton.disabled=true;

tapButton.innerHTML="Finished";

alert("Tournament Finished");

return;

}

tournamentTime--;

localStorage.setItem("bg_time",tournamentTime);

let min=Math.floor(tournamentTime/60);

let sec=tournamentTime%60;

timeLeftText.innerHTML=

`${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;

},1000);
// ===============================
// BattleG Tap Challenge Game
// File: games/tap-challenge/game.js
// Part 2
// ===============================

// ---------- TPS ----------
let lastTapSecond = Math.floor(Date.now() / 1000);
let secondTapCount = 0;

setInterval(() => {

    tps = secondTapCount;

    tpsText.innerHTML = tps;

    secondTapCount = 0;

}, 1000);

// ---------- Combo ----------
let combo = 0;

let comboTimeout = null;

// ---------- Anti Cheat ----------
let lastTapTime = 0;

let suspiciousTap = 0;

// ---------- Tap Effect ----------

tapButton.addEventListener("click", () => {

    if (!gameRunning) return;

    secondTapCount++;

    // Mobile Vibration

    if (navigator.vibrate) {

        navigator.vibrate(8);

    }

    // Button Animation

    tapButton.style.transform = "scale(0.90)";

    setTimeout(() => {

        tapButton.style.transform = "scale(1)";

    }, 70);

    // Combo

    combo++;

    clearTimeout(comboTimeout);

    comboTimeout = setTimeout(() => {

        combo = 0;

    }, 1000);

    // Combo Bonus

    if (combo >= 20) {

        score += 5;

    }

    // ---------- Anti Auto Tap ----------

    const now = Date.now();

    const diff = now - lastTapTime;

    lastTapTime = now;

    if (diff < 20) {

        suspiciousTap++;

    }

    if (suspiciousTap >= 30) {

        gameRunning = false;

        tapButton.disabled = true;

        tapButton.innerHTML = "CHEATER";

        alert("Auto Tap Detected.\nTournament Disqualified.");

        return;

    }

});
// ===============================
// BattleG Tap Challenge Game
// File: games/tap-challenge/game.js
// Part 3 (Firebase Realtime)
// ===============================

import { auth, rtdb } from "../../firebase/firebase.js";

import {
ref,
set,
onValue,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const tournamentId =
new URLSearchParams(location.search).get("id") || "demoTournament";

// -------------------------------
// Save Score
// -------------------------------

async function syncScore(){

const user = auth.currentUser;

if(!user) return;

await set(

ref(

rtdb,

`gameScores/${tournamentId}/${user.uid}`

),

{

uid:user.uid,

score:score,

taps:taps,

updatedAt:Date.now(),

status:"playing"

}

);

}

// -------------------------------
// Sync Every 3 Seconds
// -------------------------------

setInterval(()=>{

if(gameRunning){

syncScore();

}

},3000);

// -------------------------------
// Live Leaderboard
// -------------------------------

const leaderboardRef = ref(

rtdb,

`gameScores/${tournamentId}`

);

onValue(leaderboardRef,(snapshot)=>{

const data=snapshot.val();

if(!data) return;

const players=Object.values(data);

players.sort((a,b)=>b.score-a.score);

const board=document.getElementById("leaderboardList");

board.innerHTML="";

players.forEach((player,index)=>{

board.innerHTML+=`

<p>

#${index+1}

&nbsp;

${player.score}

</p>

`;

const user=auth.currentUser;

if(user && player.uid===user.uid){

rankText.innerHTML="#"+(index+1);

}

});

});

// -------------------------------
// Tournament Finish
// -------------------------------

async function finishTournament(){

gameRunning=false;

tapButton.disabled=true;

tapButton.innerHTML="FINISHED";

await syncScore();

localStorage.removeItem("bg_score");

localStorage.removeItem("bg_taps");

localStorage.removeItem("bg_time");

alert("Tournament Finished");

}

console.log("BattleG Firebase Sync Ready");
