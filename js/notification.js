firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'login.html'; return; }
    
    const snapshot = await db.collection("notifications")
        .where("userId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();
    
    const container = document.getElementById('notificationsList');
    if (snapshot.empty) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">No notifications</div>';
        return;
    }
    
    container.innerHTML = '';
    snapshot.forEach(doc => {
        const n = doc.data();
        const div = document.createElement('div');
        div.className = 'notif-item' + (n.read ? '' : ' unread');
        div.innerHTML = `
            <div class="notif-title">${n.title}</div>
            <div class="notif-message">${n.message}</div>
            <div class="notif-time">${formatDate(n.timestamp)}</div>
        `;
        container.appendChild(div);
        
        if (!n.read) {
            db.collection("notifications").doc(doc.id).update({ read: true });
        }
    });
});

function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-IN');
}
