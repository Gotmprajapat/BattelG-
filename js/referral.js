firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        document.getElementById('referralCode').textContent = data.referralCode || 'N/A';
    }
    
    loadReferralStats(user.uid);
    loadReferralHistory(user.uid);
});

async function loadReferralStats(userId) {
    try {
        const referralsSnapshot = await db.collection("referrals")
            .where("referrerId", "==", userId)
            .get();
        
        document.getElementById('totalReferrals').textContent = referralsSnapshot.size;
        
        let totalEarnings = 0;
        referralsSnapshot.forEach(doc => {
            if (doc.data().rewardGiven) {
                totalEarnings += 5;
            }
        });
        document.getElementById('referralEarnings').textContent = '₹' + totalEarnings;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function loadReferralHistory(userId) {
    const container = document.getElementById('referralHistory');
    
    try {
        const snapshot = await db.collection("referrals")
            .where("referrerId", "==", userId)
            .orderBy("timestamp", "desc")
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align:center;padding:30px;color:#666;">No referrals yet</div>';
            return;
        }
        
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const r = doc.data();
            const div = document.createElement('div');
            div.className = 'ref-item';
            div.innerHTML = `
                <span class="ref-name">${maskName(r.referredName)}</span>
                <span class="ref-status ${r.rewardGiven ? 'status-paid' : 'status-joined'}">
                    ${r.rewardGiven ? '₹5 Earned' : 'Joined'}
                </span>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

function copyCode() {
    const code = document.getElementById('referralCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Referral code copied!');
    });
}

function shareCode() {
    const code = document.getElementById('referralCode').textContent;
    if (navigator.share) {
        navigator.share({
            title: 'Join BattleG',
            text: `Join BattleG and win real money! Use my referral code: ${code}`,
        });
    } else {
        copyCode();
    }
}

function maskName(name) {
    if (!name) return "***";
    if (name.length <= 2) return name[0] + "***";
    return name.substring(0, 3) + "***";
}
