import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
collection,
query,
where,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const transactionList=document.getElementById("transactionList");

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="login.html";

return;

}

loadTransactions(user.uid);

});

/* ===========================
LOAD TRANSACTIONS
=========================== */

function loadTransactions(uid){

const q=query(

collection(db,"transactions"),

where("uid","==",uid),

orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

transactionList.innerHTML="";

if(snapshot.empty){

transactionList.innerHTML=`

<div class="loading">

No Transactions Found

</div>

`;

return;

}

snapshot.forEach((doc)=>{

const data=doc.data();

let amountClass="credit";

if(

data.type==="Withdraw" ||

data.type==="Tournament Join"

){

amountClass="debit";

}

const date=data.createdAt ?

new Date(

data.createdAt.seconds*1000

).toLocaleString()

:

"Just Now";

transactionList.innerHTML+=`

<div class="transactionCard">

<div class="topRow">

<div class="type">

${data.type}

</div>

<div class="amount ${amountClass}">

${amountClass=="credit" ? "+" : "-"}

₹${data.amount}

</div>

</div>

<div>

<span class="status ${data.status.toLowerCase()}">

${data.status}

</span>

</div>

<div class="date">

${date}

</div>

</div>

`;

});

});

}

console.log("BattleG Transactions Loaded");
