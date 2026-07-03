let currentTab = 'today';

firebase.auth().onAuthStateChanged((user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    loadLeaderboard(currentTab);
});

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadLeaderboard(tab);
}

async function loadLeaderboard(period) {
    let dateFilter;
    const now = new Date();
    
    if (period === 'today') {
        dateFilter = getTodayDateString();
    } else if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = weekAgo.toISOString().split('T')[0];
    } else if (period === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = monthAgo.toISOString().split('T')[0];
    }
    
    try {
        let snapshot;
        if (period === 'alltime') {
            snapshot = await db.collection("users")
                .orderBy("totalEarnings", "desc")
                .limit(30)
                .get();
        } else if (period === 'today') {
            snapshot = await db.collection("daily_earnings")
                .where("date", "==", dateFilter)
                .orderBy("amount", "desc")
                .limit(30)
                .get();
        } else {
            snapshot = await db.collection("daily_earnings")
                .where("date", ">=", dateFilter)
                .orderBy("date")
                .orderBy("amount", "desc")
                .limit(30)
                .get();
        }
        
        displayLeaderboard(snapshot, period);
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayLeaderboard(snapshot, period) {
    const topThree = document.getElementById('topThree');
    const list = document.getElementById('leaderboardList');
    
    const data = [];
    snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
    });
    
    // Top 3
    topThree.innerHTML = '';
    if (data.length >= 3) {
        topThree.innerHTML = `
            <div class="top-player rank-2">
                <div class="rank-icon">🥈</div>
                <div class="player-name">${maskName(data[1].name)}</div>
                <div class="player-earnings">₹${data[1].amount || data[1].totalEarnings || 0}</div>
            </div>
            <div class="top-player rank-1">
                <div class="rank-icon">👑</div>
                <div class="player-name">${maskName(data[0].name)}</div>
                <div class="player-earnings">₹${data[0].amount || data[0].totalEarnings || 0}</div>
            </div>
            <div class="top-player rank-3">
                <div class="rank-icon">🥉</div>
                <div class="player-name">${maskName(data[2].name)}</div>
                <div class="player-earnings">₹${data[2].amount || data[2].totalEarnings || 0}</div>
            </div>
        `;
    }
    
    // Full list
    list.innerHTML = '';
    if (data.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:30px;color:#666;">No data available</div>';
        return;
    }
    
    data.forEach((player, index) => {
        const div = document.createElement('div');
        div.className = 'lb-item';
        div.innerHTML = `
            <span class="lb-rank">#${index + 1}</span>
            <span class="lb-name">${maskName(player.name)}</span>
            <span class="lb-amount">₹${player.amount || player.totalEarnings || 0}</span>
        `;
        list.appendChild(div);
    });
    
    // My rank
    const user = firebase.auth().currentUser;
    if (user) {
        const myIndex = data.findIndex(p => p.id === user.uid);
        document.getElementById('myRank').innerHTML = `
            <div>
                <span class="my-rank-label">Your Rank</span>
                <br>
                <span class="my-rank-value">#${myIndex >= 0 ? myIndex + 1 : 'N/A'}</span>
            </div>
            <span class="my-rank-value">${myIndex >= 0 ? '₹' + (data[myIndex].amount || data[myIndex].totalEarnings || 0) : '₹0'}</span>
        `;
    }
}

function getTodayDateString() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function maskName(name) {
    if (!name) return "***";
    if (name.length <= 2) return name[0] + "***";
    return name.substring(0, 3) + "***";
                                           }
