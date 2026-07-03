const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('game') || 'Aim Challenge';

const gameData = {
    'Aim Challenge': { icon: '🎯', desc: 'Test your aiming skills. Hit targets to score points.' },
    'Runner': { icon: '🏃', desc: 'Run as far as you can. Avoid obstacles.' },
    'Quiz': { icon: '🧠', desc: 'Answer questions correctly. Fast and accurate wins.' }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gameTitle').textContent = gameName + ' Tournaments';
    document.getElementById('gameIcon').textContent = gameData[gameName]?.icon || '🎮';
    document.getElementById('gameName').textContent = gameName;
    document.getElementById('gameDesc').textContent = gameData[gameName]?.desc || '';
    loadTournaments();
});

async function loadTournaments() {
    const container = document.getElementById('tournamentsList');
    
    try {
        const snapshot = await db.collection("tournaments")
            .where("game", "==", gameName)
            .where("status", "==", "upcoming")
            .orderBy("startTime")
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">No tournaments available right now</div>';
            return;
        }
        
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const t = doc.data();
            const card = document.createElement('div');
            card.className = 'tournament-card';
            card.onclick = () => window.location.href = `tournament-details.html?id=${doc.id}`;
            
            const filledPercent = (t.playersJoined / t.maxPlayers) * 100;
            
            card.innerHTML = `
                <div class="tournament-header">
                    <span class="tournament-entry">₹${t.entryFee} ENTRY</span>
                    <span class="tournament-prize">₹${t.prizePool}</span>
                </div>
                <div class="tournament-info">
                    <span><i class="fas fa-users"></i> ${t.playersJoined}/${t.maxPlayers}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime(t.startTime)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${filledPercent}%"></div>
                </div>
                <button class="join-btn">JOIN NOW</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading tournaments:", error);
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">Error loading tournaments</div>';
    }
}

function formatTime(timestamp) {
    if (!timestamp) return 'TBA';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
