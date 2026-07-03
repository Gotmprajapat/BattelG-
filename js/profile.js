firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        document.getElementById('profileName').textContent = data.name || 'Player';
        document.getElementById('profileEmail').textContent = data.email || '';
        document.getElementById('profileWallet').textContent = '₹' + (data.wallet || 0);
        document.getElementById('profileRefCode').textContent = data.referralCode || '------';
        document.getElementById('profileUpi').textContent = data.upi || 'Not Set';
        document.getElementById('avatarInitial').textContent = (data.name || 'P').charAt(0).toUpperCase();
    }
});

function editProfile() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const newName = prompt('Enter new name:');
    if (newName) {
        db.collection("users").doc(user.uid).update({ name: newName }).then(() => {
            document.getElementById('profileName').textContent = newName;
            document.getElementById('avatarInitial').textContent = newName.charAt(0).toUpperCase();
        });
    }
    
    const newUpi = prompt('Enter UPI ID:');
    if (newUpi) {
        db.collection("users").doc(user.uid).update({ upi: newUpi }).then(() => {
            document.getElementById('profileUpi').textContent = newUpi;
        });
    }
}

function logout() {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    });
}
