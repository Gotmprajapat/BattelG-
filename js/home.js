let currentBanner = 0;
const totalBanners = 3;
let bannerInterval;

firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        document.getElementById('displayName').textContent = data.name || 'Player';
        document.getElementById('walletBalance').textContent = '₹' + (data.wallet || 0);
        localStorage.setItem("userData", JSON.stringify({...data, id: userDoc.id}));
    }
    
    loadGames();
    loadTopEarners();
    startBannerSlider();
});

function startBannerSlider() {
    bannerInterval = setInterval(() => {
        currentBanner = (currentBanner + 1) % totalBanners;
        showBanner(currentBanner);
    }, 3000);
}

function changeBanner(index) {
    clearInterval(bannerInterval);
    currentBanner = index;
    showBanner(index);
    bannerInterval = setInterval(() => {
        currentBanner = (currentBanner + 1) % totalBanners;
        showBanner(currentBanner);
    }, 3000);
}

function showBanner(index) {
    document.querySelectorAll('.banner').forEach((b, i) => {
        b.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

function loadGames() {
    const games = [
        { name: 'Aim Challenge', icon: '🎯', hasTournament: true },
        { name: 'Runner', icon: '🏃', hasTournament: true },
        { name: 'Quiz', icon: '🧠', hasTournament: true },
        { name: 'Racing', icon: '🏎️', hasTournament: false },
        { name: 'Puzzle', icon: '🧩', hasTournament: false },
        { name: 'Snake', icon: '🐍', hasTournament: false }
    ];
    
    const container = document.getElementById('gamesScroll');
    container.innerHTML = '';
    
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => {
            if (game.hasTournament) {
                window.location.href = `tournament.html?game=${encodeURIComponent(game.name)}`;
            } else {
                alert('Coming Soon!');
            }
        };
        card.innerHTML = `
            <div style="font-size:40px;">${game.icon}</div>
            <span>${game.name}</span>
            ${!game.hasTournament ? '<span class="coming-soon">Coming Soon</span>' : ''}
        `;
        container.appendChild(card);
    });
}

async function loadTopEarners() {
    const today = getTodayDateString();
    const earnersList = document.getElementById('earnersList');
    
    try {
        const snapshot = await db.collection("daily_earnings")
            .where("date", "==", today)
            .orderBy("amount", "desc")
            .limit(30)
            .get();
        
        if (snapshot.empty) {
            earnersList.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">No earnings yet today</div>';
            return;
        }
        
        earnersList.innerHTML = '';
        snapshot.forEach((doc, index) => {
            const data = doc.data();
            const rank = index + 1;
            const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
            
            const div = document.createElement('div');
            div.className = 'earner-item';
            div.innerHTML = `
                <div class="earner-rank ${rankClass}">${rank}</div>
                <span class="earner-name">${maskName(data.name)}</span>
                <span class="earner-amount">₹${data.amount}</span>
            `;
            earnersList.appendChild(div);
        });
    } catch (error) {
        console.error("Error loading earners:", error);
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
