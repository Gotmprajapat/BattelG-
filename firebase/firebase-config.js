const firebaseConfig = {
  apiKey: "AIzaSyDno0YmNMKaWHexZtaOIbs5FWvPUFsMcu0",
  authDomain: "profta-a85a6.firebaseapp.com",
  databaseURL: "https://profta-a85a6-default-rtdb.firebaseio.com",
  projectId: "profta-a85a6",
  storageBucket: "profta-a85a6.firebasestorage.app",
  messagingSenderId: "124370996303",
  appId: "1:124370996303:web:9ece8aaed23b92f7b66e3a",
  measurementId: "G-Q3018BMKK3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const realtimeDb = firebase.database();
const storage = firebase.storage();
