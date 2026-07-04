import { auth, db } from "../../firebase/firebase.js";

import{
collection,
doc,
query,
where,
orderBy,
onSnapshot,
getDoc,
setDoc,
updateDoc,
serverTimestamp
}from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import{
removeWallet
}from "./walletService.js";

/* ===========================
LIVE TOURNAMENT
=========================== */

export function liveTournament(callback){

const q=query(
collection(db,"tournaments"),
where("status","==","live"),
orderBy("startTime","asc")
);

onSnapshot(q,(snap)=>{

let list=[];

snap.forEach(d=>{

list.push({
id:d.id,
...d.data()
});

});

callback(list);

});

}

/* ===========================
UPCOMING
=========================== */

export function upcomingTournament(callback){

const q=query(
collection(db,"tournaments"),
where("status","==","upcoming"),
orderBy("startTime","asc")
);

onSnapshot(q,(snap)=>{

let list=[];

snap.forEach(d=>{

list.push({
id:d.id,
...d.data()
});

});

callback(list);

});

}

/* ===========================
JOIN TOURNAMENT
=========================== */

export async function joinTournament(id){

const user=auth.currentUser;

if(!user){

return{
success:false,
message:"Login Required"
};

}

const ref=doc(db,"tournaments",id);

const snap=await getDoc(ref);

if(!snap.exists()){

return{
success:false,
message:"Tournament Not Found"
};

}

const t=snap.data();

if(t.joined>=t.slots){

return{
success:false,
message:"Tournament Full"
};

}

const ok=await removeWallet(
Number(t.entryFee),
"Tournament Join"
);

if(!ok){

return{
success:false,
message:"Insufficient Balance"
};

}

await setDoc(

doc(db,"userTournaments",user.uid+"_"+id),

{

uid:user.uid,

tournamentId:id,

joinedAt:serverTimestamp(),

status:"joined",

score:0,

reward:0

}

);

await updateDoc(ref,{

joined:t.joined+1

});

return{

success:true,
message:"Joined Successfully"

};

  }
