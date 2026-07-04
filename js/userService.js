import { auth, db } from "../firebase/firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentUser = null;
let currentData = null;
let listeners = [];

/* Auto User Listener */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);

    onSnapshot(userRef, (snap) => {

        if (!snap.exists()) return;

        currentData = snap.data();

        listeners.forEach(callback => {

            callback(currentData);

        });

    });

});

/* Live User Data */

export function onUserData(callback){

    listeners.push(callback);

    if(currentData){

        callback(currentData);

    }

}

/* Current User */

export function getCurrentUser(){

    return currentUser;

}

/* Wallet */

export function getWallet(){

    return Number(currentData?.wallet || 0);

}

/* Name */

export function getName(){

    return currentData?.name || "Player";

}

/* Email */

export function getEmail(){

    return currentData?.email || "";

}

/* UPI */

export function getUPI(){

    return currentData?.upi || "";

}

/* Referral */

export function getReferral(){

    return currentData?.referralCode || "";

}

/* Full Data */

export function getUserData(){

    return currentData;

}
