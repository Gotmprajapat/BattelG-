import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
collection,
query,
where,
orderBy,
limit,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const walletBalance=document.getElementById("walletBalance");
const totalWinning=document.getElementById("totalWinning");
const totalWithdraw=document.getElementById("totalWithdraw");
const pendingWithdraw=document.getElementById("pendingWithdraw");
const transactionList=document.getElementById("transactionList");

let currentUser=null;

/* ==========================
LOGIN
========================== */

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";

return;

}

currentUser=user;

loadWallet();

loadTransactions();

});

/* ==========================
WALLET
========================== */

function loadWallet(){

const ref=doc(db,"users",currentUser.uid);

onSnapshot(ref,(snap)=>{

if(!snap.exists()) return;

const data=snap.data();

walletBalance.textContent=data.wallet||0;

totalWinning.textContent="₹"+(data.totalWinning||0);

totalWithdraw.textContent="₹"+(data.totalWithdraw||0);

pendingWithdraw.textContent="₹"+(data.pendingWithdraw||0);

});

}
/* ==========================
TRANSACTIONS
========================== */

function loadTransactions(){

const q=query(

collection(db,"transactions"),

where("uid","==",currentUser.uid),

orderBy("createdAt","desc"),

limit(10)

);

onSnapshot(q,(snapshot)=>{

transactionList.innerHTML="";

if(snapshot.empty){

transactionList.innerHTML=`

<div class="transactionCard">

<h3>No Transactions Found</h3>

<p>Your transaction history will appear here.</p>

</div>

`;

return;

}

snapshot.forEach((docSnap)=>{

const item=docSnap.data();

let color="#ffb400";

if(item.type==="Deposit") color="#00d26a";

if(item.type==="Withdraw") color="#ff5252";

if(item.type==="Tournament Win") color="#00bfff";

transactionList.innerHTML+=`

<div class="transactionCard"
style="border-left:5px solid ${color};">

<h3>${item.type}</h3>

<p>Amount : ₹${item.amount}</p>

<p>Status : ${item.status||"Success"}</p>

<p>Date : ${item.date||"--/--/----"}</p>

</div>

`;

});

});

}

/* ==========================
ERROR HANDLING
========================== */

window.addEventListener("error",(e)=>{

console.log("Wallet Error :",e.error);

});

console.log("BattleG Wallet Loaded Successfully");
