import { auth, db, storage } from "../firebase/firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const profileImage=document.getElementById("profileImage");
const profilePhoto=document.getElementById("profilePhoto");
const nameInput=document.getElementById("name");
const upiIdInput=document.getElementById("upiId");
const saveBtn=document.getElementById("saveBtn");
const logoutBtn=document.getElementById("logoutBtn");

let currentUser;
let currentPhoto="";

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="login.html";

return;

}

currentUser=user;

const snap=await getDoc(doc(db,"users",user.uid));

const data=snap.data();

nameInput.value=data.name||"";
upiIdInput.value=data.upiId||"";

currentPhoto=data.photo||"";

if(currentPhoto!=""){

profileImage.src=currentPhoto;

}

});
saveBtn.onclick=async()=>{

try{

saveBtn.disabled=true;

saveBtn.innerText="Saving...";

let imageUrl=currentPhoto;

if(profilePhoto.files.length>0){

const imageRef=ref(

storage,

`profile/${currentUser.uid}`

);

await uploadBytes(

imageRef,

profilePhoto.files[0]

);

imageUrl=await getDownloadURL(imageRef);

}

await updateDoc(

doc(db,"users",currentUser.uid),

{

name:nameInput.value.trim(),

upiId:upiIdInput.value.trim(),

photo:imageUrl

}

);

profileImage.src=imageUrl;

alert("Profile Updated Successfully");

saveBtn.disabled=false;

saveBtn.innerText="Save Changes";

}catch(error){

console.log(error);

alert(error.message);

saveBtn.disabled=false;

saveBtn.innerText="Save Changes";

}

};

logoutBtn.onclick=async()=>{

await signOut(auth);

location.href="login.html";

};
