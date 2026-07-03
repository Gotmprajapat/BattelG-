let selectedAmount = 0;

function selectAmount(amount) {
    selectedAmount = amount;
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    document.getElementById('customAmount').value = '';
    document.getElementById('selectedAmountDisplay').innerHTML = 'Selected: <span>₹' + amount + '</span>';
}

document.getElementById('customAmount').addEventListener('input', function() {
    selectedAmount = parseInt(this.value) || 0;
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('selectedAmountDisplay').innerHTML = 'Selected: <span>₹' + selectedAmount + '</span>';
});

async function submitDeposit() {
    const user = firebase.auth().currentUser;
    if (!user) { alert('Please login first'); return; }
    
    if (selectedAmount < 10) {
        alert('Minimum deposit amount is ₹10');
        return;
    }
    
    const utr = document.getElementById('utrNumber').value.trim();
    if (!utr) {
        alert('Please enter UTR number');
        return;
    }
    
    try {
        await db.collection("deposits").add({
            userId: user.uid,
            userEmail: user.email,
            amount: selectedAmount,
            utr: utr,
            status: 'pending',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('Deposit request submitted successfully! It will be verified shortly.');
        window.location.href = 'wallet.html';
    } catch (error) {
        console.error("Error:", error);
        alert('Error submitting deposit request');
    }
}
