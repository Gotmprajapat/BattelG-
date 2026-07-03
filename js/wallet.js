firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        document.getElementById('balanceAmount').textContent = '₹' + (data.wallet || 0);
    }
    
    loadTransactions(user.uid);
});

async function loadTransactions(userId) {
    const container = document.getElementById('transactionsList');
    
    try {
        const snapshot = await db.collection("transactions")
            .where("userId", "==", userId)
            .orderBy("timestamp", "desc")
            .limit(50)
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align:center;padding:30px;color:#666;">No transactions yet</div>';
            return;
        }
        
        container.innerHTML = '';
        snapshot.forEach(doc => {
            const t = doc.data();
            const amountClass = t.type === 'deposit' || t.type === 'prize' || t.type === 'referral' || t.type === 'promo' 
                ? 'amount-positive' : 'amount-negative';
            const sign = t.type === 'deposit' || t.type === 'prize' || t.type === 'referral' || t.type === 'promo' ? '+' : '-';
            
            const div = document.createElement('div');
            div.className = 'txn-item';
            div.innerHTML = `
                <div>
                    <span class="txn-type">${t.description || t.type}</span>
                    <br>
                    <span class="txn-date">${formatDate(t.timestamp)}</span>
                </div>
                <span class="txn-amount ${amountClass}">${sign}₹${t.amount}</span>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

async function applyPromoCode() {
    const code = document.getElementById('promoCode').value.trim();
    if (!code) { alert('Enter promo code'); return; }
    
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    try {
        const promosSnapshot = await db.collection("promo_codes")
            .where("code", "==", code)
            .where("enabled", "==", true)
            .get();
        
        if (promosSnapshot.empty) {
            alert('Invalid or expired promo code');
            return;
        }
        
        const promoDoc = promosSnapshot.docs[0];
        const promo = promoDoc.data();
        
        if (promo.usedBy && promo.usedBy.includes(user.uid)) {
            alert('You have already used this promo code');
            return;
        }
        
        if (promo.maxUses && promo.usedCount >= promo.maxUses) {
            alert('Promo code limit reached');
            return;
        }
        
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection("users").doc(user.uid);
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();
            
            transaction.update(userRef, { wallet: (userData.wallet || 0) + promo.reward });
            
            const usedBy = promo.usedBy || [];
            usedBy.push(user.uid);
            transaction.update(promoDoc.ref, { 
                usedBy: usedBy,
                usedCount: (promo.usedCount || 0) + 1
            });
            
            transaction.set(db.collection("transactions").doc(), {
                userId: user.uid,
                type: 'promo',
                amount: promo.reward,
                description: 'Promo Code: ' + code,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        
        alert('Promo code applied! ₹' + promo.reward + ' added to wallet');
        location.reload();
    } catch (error) {
        console.error("Error:", error);
        alert('Error applying promo code');
    }
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
