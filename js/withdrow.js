firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        document.getElementById('availBalance').textContent = '₹' + (data.wallet || 0);
    }
});

async function submitWithdraw() {
    const user = firebase.auth().currentUser;
    if (!user) { alert('Please login'); return; }
    
    const upiId = document.getElementById('upiId').value.trim();
    const amount = parseInt(document.getElementById('withdrawAmount').value);
    
    if (!upiId) { alert('Enter UPI ID'); return; }
    if (!amount || amount < 50) { alert('Minimum withdrawal is ₹50'); return; }
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();
    
    if (amount > (userData.wallet || 0)) {
        alert('Insufficient balance');
        return;
    }
    
    try {
        await db.collection("withdrawals").add({
            userId: user.uid,
            userEmail: user.email,
            upiId: upiId,
            amount: amount,
            status: 'pending',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        await db.collection("users").doc(user.uid).update({
            wallet: firebase.firestore.FieldValue.increment(-amount)
        });
        
        await db.collection("transactions").add({
            userId: user.uid,
            type: 'withdrawal',
            amount: amount,
            description: 'Withdrawal to ' + upiId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('Withdrawal request submitted!');
        window.location.href = 'wallet.html';
    } catch (error) {
        console.error("Error:", error);
        alert('Error submitting withdrawal');
    }
}
