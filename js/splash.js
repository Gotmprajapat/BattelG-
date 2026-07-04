import { auth } from "../firebase/firebase.js";

import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

setTimeout(()=>{

if(user){

window.location.replace("home.html");

}else{

window.location.replace("login.html");

}

},500);

});
