// ======================================
// BattleG Tournament Result Engine
// File : games/tap-challenge/resultEngine.js
// ======================================

import { db, rtdb } from "../../firebase/firebase.js";

import {
ref,
get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import {
doc,
updateDoc,
increment,
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export async function finishTournament(tournamentId, prizeList = []) {

    const snap = await get(ref(rtdb, `gameScores/${tournamentId}`));

    if (!snap.exists()) return;

    const players = Object.values(snap.val());

    players.sort((a, b) => b.score - a.score);

    for (let i = 0; i < players.length; i++) {

        const player = players[i];

        const prize = prizeList[i] || 0;

        if (prize <= 0) continue;

        await updateDoc(doc(db, "users", player.uid), {

            wallet: increment(prize),

            totalWinning: increment(prize)

        });

        await addDoc(collection(db, "transactions"), {

            uid: player.uid,

            type: "Tournament Win",

            amount: prize,

            tournamentId,

            score: player.score,

            createdAt: new Date()

        });

        await addDoc(collection(db, "notifications"), {

            uid: player.uid,

            title: "🏆 Tournament Won",

            message: `Congratulations! ₹${prize} has been added to your wallet.`,

            read: false,

            createdAt: new Date()

        });

    }

    console.log("Tournament Result Completed");

}
