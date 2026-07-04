import { db } from "../firebase/firebase.js";

import {
collection,
query,
orderBy,
limit,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const leaderboardList = document.getElementById("leaderboardList");

async function loadLeaderboard() {

leaderboardList.innerHTML = `
<div class="loading">
<i class="fa-solid fa-spinner fa-spin"></i>
<p>Loading Leaderboard...</p>
</div>
`;

try {

const q = query(
collection(db, "users"),
orderBy("totalEarning", "desc"),
limit(30)
);

const snap = await getDocs(q);

leaderboardList.innerHTML = "";

if (snap.empty) {

leaderboardList.innerHTML = `
<div class="loading">
<p>No Players Found</p>
</div>
`;

return;

}

let rank = 1;

snap.forEach((doc) => {

const user = doc.data();

leaderboardList.innerHTML += `

<div class="playerCard">

<div class="playerLeft">

<div class="rank">
${rank}
</div>

<div>

<div class="playerName">
${user.name || "Player"}
</div>

<small>
₹${Number(user.totalEarning || 0).toFixed(2)} Earned
</small>

</div>

</div>

<div class="playerEarn">

₹${Number(user.totalEarning || 0).toFixed(2)}

</div>

</div>

`;

rank++;

});

} catch (error) {

console.log(error);

leaderboardList.innerHTML = `
<div class="loading">
<p>Failed to Load Leaderboard</p>
</div>
`;

}

}

loadLeaderboard();
