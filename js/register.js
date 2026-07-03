document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const referralCode = document.getElementById('referralCode').value.trim();
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        const myReferralCode = generateReferralCode();
        
        await db.collection("users").doc(user.uid).set({
            name: name,
            email: email,
            wallet: 0,
            referralCode: myReferralCode,
            referredBy: referralCode || null,
            firstPaidMatch: false,
            upi: "",
            photoURL: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: "active"
        });
        
        if (referralCode) {
            const referrerSnapshot = await db.collection("users")
                .where("referralCode", "==", referralCode)
                .get();
            
            if (!referrerSnapshot.empty) {
                const referrerDoc = referrerSnapshot.docs[0];
                await db.collection("referrals").add({
                    referrerId: referrerDoc.id,
                    referredId: user.uid,
                    referredName: name,
                    referralCode: referralCode,
                    rewardGiven: false,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        }
        
        window.location.href = 'home.html';
    } catch (error) {
        alert(error.message);
    }
});

function generateReferralCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
