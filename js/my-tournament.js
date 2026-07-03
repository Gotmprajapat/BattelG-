let currentTab = 'upcoming';

firebase.auth().onAuthStateChanged((user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    loadTournaments(user.uid, currentTab);
});

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const user = firebase.auth().currentUser;
    if (user) loadTournaments(user.uid, tab);
}

async function loadTournaments(userId, status) {
    const container = document.getElementById('tournamentsContainer');
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">Loading...</div>';
    
    try {
        const snapshot = await db.collection("user_tournaments")
            .where("userId", "==", userId)
            .where("status", "==", status)
            .orderBy("timestamp", "desc")
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">No ${status} tournaments</div>`;
            return;
        }
        
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const t = doc.data();
            const card = document.createElement('div');
            card.className = 'tournament-card';
            card.innerHTML = `
                <h4>${t.game} - ${t.tournamentName || 'Tournament'}</h4>
                <div class="tournament-info-row">
                    <span>Entry: ₹${t.entryFee}</span>
                    <span>Prize: ₹${t.prizePool}</span>
                </div>
                ${t.score ? `<div class="tournament-info-row">
                    <span>Score: ${t.score}</span>
                    <span>Rank: #${t.rank || 'N/A'}</span>
                </div>` : ''}
                <div style="margin-top:10px;">
                    <span class="status-badge status-${status}">${status.toUpperCase()}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">Error loading tournaments</div>';
    }
}
