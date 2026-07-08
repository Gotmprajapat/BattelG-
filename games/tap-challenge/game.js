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
