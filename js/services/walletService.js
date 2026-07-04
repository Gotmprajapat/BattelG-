import { auth, db } from "../../firebase/firebase.js";

import {
doc,
runTransaction,
onSnapshot,
serverTimestamp,
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ==========================
   LIVE WALLET
========================== */

export function walletListener(callback){

auth.onAuthStateChanged((user)=>{

if(!user) return;

const ref = doc(db,"users",user.uid);

onSnapshot(ref,(snap)=>{

if(!snap.exists()) return;

callback(Number(snap.data().wallet || 0));

});

});

}

/* ==========================
   ADD MONEY
========================== */

export async function addWallet(amount,type="Reward"){

const user = auth.currentUser;

if(!user) return false;

const ref = doc(db,"users",user.uid);

await runTransaction(db,async(transaction)=>{

const snap = await transaction.get(ref);

const wallet = Number(snap.data().wallet || 0);

transaction.update(ref,{

wallet:wallet+Number(amount)

});

});

await addHistory(type,amount,"success");

return true;

}

/* ==========================
   REMOVE MONEY
========================== */

export async function removeWallet(amount,type="Tournament Join"){

const user = auth.currentUser;

if(!user) return false;

const ref = doc(db,"users",user.uid);

let success=false;

await runTransaction(db,async(transaction)=>{

const snap = await transaction.get(ref);

const wallet = Number(snap.data().wallet || 0);

if(wallet<amount){

success=false;

return;

}

transaction.update(ref,{

wallet:wallet-Number(amount)

});

success=true;

});

if(success){

await addHistory(type,-amount,"success");

}

return success;

}

/* ==========================
   HISTORY
========================== */

async function addHistory(type,amount,status){

const user=auth.currentUser;

if(!user) return;

await addDoc(collection(db,"transactions"),{

uid:user.uid,

type:type,

amount:Number(amount),

status:status,

createdAt:serverTimestamp()

});

}
