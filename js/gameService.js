import { db } from "../firebase/firebase.js";

import {
collection,
query,
where,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export function loadGames(callback){

const q = query(
collection(db,"games"),
where("status","==","active"),
orderBy("order","asc")
);

onSnapshot(q,(snap)=>{

let games=[];

snap.forEach(doc=>{

games.push({
id:doc.id,
...doc.data()
});

});

callback(games);

});

}
