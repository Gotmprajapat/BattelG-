// ======================================
// BattleG Anti Cheat System
// File : games/tap-challenge/antiCheat.js
// ======================================

let suspiciousPoints = 0;

let lastTap = 0;

let tapHistory = [];

let multiTouchDetected = false;

let gameFocused = true;

// ----------------------------
// Multi Touch Detection
// ----------------------------

document.addEventListener("touchstart",(e)=>{

if(e.touches.length>1){

multiTouchDetected=true;

addSuspicious(50);

}

});

// ----------------------------
// Background Detection
// ----------------------------

document.addEventListener("visibilitychange",()=>{

if(document.hidden){

gameFocused=false;

addSuspicious(10);

}else{

gameFocused=true;

}

});

// ----------------------------
// Human Tap Speed Check
// ----------------------------

export function validateTap(){

const now=Date.now();

const diff=now-lastTap;

lastTap=now;

tapHistory.push(diff);

if(tapHistory.length>30){

tapHistory.shift();

}

if(diff<18){

addSuspicious(5);

}

}

// ----------------------------
// TPS Check
// ----------------------------

export function checkTPS(tps){

if(tps>18){

addSuspicious(20);

}

}

// ----------------------------
// Pattern Detection
// ----------------------------

setInterval(()=>{

if(tapHistory.length<20) return;

let same=0;

for(let i=1;i<tapHistory.length;i++){

if(Math.abs(

tapHistory[i]-tapHistory[i-1]

)<2){

same++;

}

}

if(same>15){

addSuspicious(40);

}

},5000);

// ----------------------------
// DevTools Detection
// ----------------------------

setInterval(()=>{

const w=window.outerWidth-window.innerWidth;

const h=window.outerHeight-window.innerHeight;

if(w>180||h>180){

addSuspicious(30);

}

},3000);

// ----------------------------
// Suspicious Counter
// ----------------------------

function addSuspicious(points){

suspiciousPoints+=points;

console.log(

"Suspicious :",

suspiciousPoints

);

if(suspiciousPoints>=100){

disqualifyPlayer();

}

}

// ----------------------------
// Disqualify
// ----------------------------

function disqualifyPlayer(){

alert(

"Cheating Detected!\nYou have been disqualified."

);

localStorage.setItem(

"bg_disqualified",

"true"

);

location.href="../../home.html";

}

export function isDisqualified(){

return localStorage.getItem(

"bg_disqualified"

)==="true";

}
