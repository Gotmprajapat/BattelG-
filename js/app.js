let currentUser = null;
let userData = null;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    const doc = await db.collection("users").doc(user.uid).get();
    if (doc.exists) {
      userData = doc.data();
      userData.id = doc.id;
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    if (window.location.pathname.includes("index.html") || 
        window.location.pathname.includes("home.html") ||
        window.location.pathname === "/") {
      // Already on home
    } else if (!window.location.pathname.includes("login.html") && 
               !window.location.pathname.includes("register.html") &&
               !window.location.pathname.includes("admin")) {
      window.location.href = "home.html";
    }
  } else {
    currentUser = null;
    userData = null;
    localStorage.removeItem("userData");
    if (!window.location.pathname.includes("login.html") && 
        !window.location.pathname.includes("register.html") &&
        !window.location.pathname.includes("admin")) {
      window.location.href = "login.html";
    }
  }
});

function getStoredUserData() {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
}

function updateWalletBalance(amount) {
  const stored = getStoredUserData();
  if (stored) {
    stored.wallet = (stored.wallet || 0) + amount;
    localStorage.setItem("userData", JSON.stringify(stored));
  }
}

function formatCurrency(amount) {
  return "₹" + (amount || 0).toLocaleString('en-IN');
}

function generateReferralCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function sendNotification(userId, title, message) {
  await db.collection("notifications").add({
    userId: userId,
    title: title,
    message: message,
    read: false,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function maskName(name) {
  if (!name) return "***";
  if (name.length <= 2) return name[0] + "***";
  return name.substring(0, 3) + "***";
}

function getTodayDateString() {
  const d = new Date();
  return d.getFullYear() + '-' + 
         String(d.getMonth() + 1).padStart(2, '0') + '-' + 
         String(d.getDate()).padStart(2, '0');
    }
