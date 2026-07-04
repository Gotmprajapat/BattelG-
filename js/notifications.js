import {
notificationListener
} from "./services/notificationService.js";

const container =
document.getElementById("notificationContainer");

notificationListener((list)=>{

container.innerHTML="";

if(list.length===0){

container.innerHTML=`

<div class="empty">

<i class="fa-solid fa-bell"></i>

<h3>No Notifications</h3>

<p>

You'll receive tournament updates,
wallet updates and rewards here.

</p>

</div>

`;

return;

}

list.forEach(item=>{

let icon="fa-bell";

switch(item.type){

case "deposit":
icon="fa-money-bill-wave";
break;

case "withdraw":
icon="fa-wallet";
break;

case "reward":
icon="fa-trophy";
break;

case "tournament":
icon="fa-gamepad";
break;

case "referral":
icon="fa-user-group";
break;

}

const time=item.createdAt?.toDate
?item.createdAt.toDate().toLocaleString()
:"Just Now";

container.innerHTML+=`

<div class="notificationCard">

<div class="notificationIcon">

<i class="fa-solid ${icon}"></i>

</div>

<div class="notificationBody">

<h3>${item.title}</h3>

<p>${item.message}</p>

<span class="notificationTime">

${time}

</span>

</div>

</div>

`;

});

});
