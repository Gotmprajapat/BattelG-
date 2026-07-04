import { auth, db } from "../../firebase/firebase.js";

import {
collection,
addDoc,
query,
where,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* =========================
   SEND NOTIFICATION
========================= */

export async function sendNotification(

title,
message,
type="system"

){

const user=auth.currentUser;

if(!user) return;

await addDoc(

collection(db,"notifications"),

{

uid:user.uid,

title,

message,

type,

read:false,

createdAt:serverTimestamp()

}

);

}

/* =========================
LIVE NOTIFICATION
========================= */

export function notificationListener(callback){

const user=auth.currentUser;

if(!user) return;

const q=query(

collection(db,"notifications"),

where("uid","==",user.uid),

orderBy("createdAt","desc")

);

onSnapshot(q,(snap)=>{

let list=[];

snap.forEach(doc=>{

list.push({

id:doc.id,

...doc.data()

});

});

callback(list);

});

}

/* =========================
UNREAD COUNT
========================= */

export function unreadNotification(callback){

const user=auth.currentUser;

if(!user) return;

const q=query(

collection(db,"notifications"),

where("uid","==",user.uid),

where("read","==",false)

);

onSnapshot(q,(snap)=>{

callback(snap.size);

});

}
