import { auth, db } from "../firebase/firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {

    // Wallet Data

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

      const data = userSnap.data();

      document.getElementById("walletBalance").textContent =
      Number(data.wallet || 0).toFixed(2);

    }

    // Transaction History

    const historyContainer =
      document.getElementById("historyContainer");

    historyContainer.innerHTML = "";

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    if (snap.empty) {

      historyContainer.innerHTML =
      "<p class='empty'>No Transactions Found</p>";

    } else {

      snap.forEach((docu) => {

        const t = docu.data();

        historyContainer.innerHTML += `

        <div class="transactionItem">

            <div>

                <h4>${t.type}</h4>

                <small>${t.status}</small>

            </div>

            <strong>₹${t.amount}</strong>

        </div>

        `;

      });

    }

  } catch (e) {

    console.log(e);

  }

});

// Promo Code

document.getElementById("applyPromo").onclick = () => {

  const code =
  document.getElementById("promoCode").value.trim();

  if (code === "") {

    alert("Enter Promo Code");

    return;

  }

  // Promo logic baad me add hoga

  alert("Promo Code System Coming Soon");

};
