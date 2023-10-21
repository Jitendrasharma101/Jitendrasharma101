var socket = io();
let user;
const userNameNode = document.getElementById("userName");
const submituserNameNode = document.getElementById("submituserName");
const userNickNamelabelNode = document.getElementById("userNickNamelabel");
const searchFriendNode = document.getElementById("searchFriend");
const searchFriendButtonNode = document.getElementById("search");
const friendNickNameLabelNode = document.getElementById("friendNickNamelabel");

//code start for  search friend

searchFriendButtonNode.addEventListener("click", function(){
    const friendName = searchFriendNode.value;
    socket.emit("search friiend", friendName);
});

// socket.on("search friend", friendName);

socket.on("search friend", function (friendData) {
   if (friendData) {
    friendNickNameLabelNode.innerText = friendData.nickName;

    //start chat

    startChat(friendData);
   } else {
    friendNickNameLabelNode.innerHTML = "no user found";
   }
});

function startChat(friendData){
    //create and append a button in chatbox

 const chatBoxNode = document.getElementById("chatBox");   

  chatBoxNode.innerHTML = "";


  const chatButtonNode = document.createElement("button");
  chatButtonNode.innerText = "chat with " + friendData.nickName;
  chatButtonNode.id = "chatButton";

  chatBoxNode.appendChild(chatButtonNode);

  chatButtonNode.addEventListener("click", function () {
    // create a chatbox like hangout and append into body

    const chatNode = document.createElement("div");
    chatNode.style.position = "fixed";
    chatNode.style.bottom = "0px";
    chatNode.style.right = "0px";
    chatNode.style.width = "300px";
    chatNode.style.height = "300px";
    chatNode.style.backgroundColor = "white";
    chatNode.style.border = "1px solid black";
    chatNode.style.display = "flex";
    chatNode.style.flexDirection = "column";

    const chatHeaderNode = document.createElement("div");
    chatHeaderNode.style.height = "50px";
    chatHeaderNode.style.backgroundColor = "grey";
    chatHeaderNode.style.display = "flex";
    chatHeaderNode.style.justifyContent = "space-between";
    chatHeaderNode.style.alignItems = "center";

    const chatHeaderLabelNode = document.createElement("label");
    chatHeaderLabelNode.innerText = friendData.nickName;

    const chatHeaderCloseButtonNode = document.createElement("button");
    chatHeaderCloseButtonNode.innerText = "X";

    chatHeaderNode.appendChild(chatHeaderLabelNode);
    chatHeaderNode.appendChild(chatHeaderCloseButtonNode);

    const chatBodyNode = document.createElement("div");
    chatBodyNode.style.flexGrow = "1";
    chatBodyNode.style.overflowY = "scroll";

    const chatFooterNode = document.createElement("div");
    chatFooterNode.style.height = "50px";
    chatFooterNode.style.backgroundColor = "grey";
    chatFooterNode.style.display = "flex";
    chatFooterNode.style.justifyContent = "space-between";
    chatFooterNode.style.alignItems = "center";

    const chatFooterInputNode = document.createElement("input");
    chatFooterInputNode.style.flexGrow = "1";

    const chatFooterSendButtonNode = document.createElement("button");
    chatFooterSendButtonNode.innerText = "Send";

    chatFooterNode.appendChild(chatFooterInputNode);
    chatFooterNode.appendChild(chatFooterSendButtonNode);

    chatNode.appendChild(chatHeaderNode);
    chatNode.appendChild(chatBodyNode);
    chatNode.appendChild(chatFooterNode);

    document.body.appendChild(chatNode);

    // send message

    chatFooterSendButtonNode.addEventListener("click", function () {
      const msg = chatFooterInputNode.value;

      socket.emit("chat message", {
        msg: msg,
        friendUserName: friendData.userName,
        sentBy: user,
      });

      chatFooterInputNode.value = "";
    });
  });
}


//handle incomming chat

const chatList = {};

let body;
socket.on("chat message", function (chatData) {
  if (!chatList[chatData.sentBy.userName]) {
    chatList[chatData.sentBy.userName] = true;

    // create a chatbox like hangout and append into body

    const chatNode = document.createElement("div");
    chatNode.style.position = "fixed";
    chatNode.style.bottom = "0px";
    chatNode.style.right = "0px";
    chatNode.style.width = "300px";
    chatNode.style.height = "300px";
    chatNode.style.backgroundColor = "white";
    chatNode.style.border = "1px solid black";
    chatNode.style.display = "flex";
    chatNode.style.flexDirection = "column";

    const chatHeaderNode = document.createElement("div");
    chatHeaderNode.style.height = "50px";
    chatHeaderNode.style.backgroundColor = "grey";
    chatHeaderNode.style.display = "flex";
    chatHeaderNode.style.justifyContent = "space-between";
    chatHeaderNode.style.alignItems = "center";

    const chatHeaderLabelNode = document.createElement("label");
    chatHeaderLabelNode.innerText = chatData.sentBy.nickName;

    const chatHeaderCloseButtonNode = document.createElement("button");
    chatHeaderCloseButtonNode.innerText = "X";

    chatHeaderNode.appendChild(chatHeaderLabelNode);
    chatHeaderNode.appendChild(chatHeaderCloseButtonNode);

    const chatBodyNode = document.createElement("div");
    chatBodyNode.style.flexGrow = "1";
    chatBodyNode.style.overflowY = "scroll";

    const chatFooterNode = document.createElement("div");
    chatFooterNode.style.height = "50px";
    chatFooterNode.style.backgroundColor = "grey";
    chatFooterNode.style.display = "flex";
    chatFooterNode.style.justifyContent = "space-between";
    chatFooterNode.style.alignItems = "center";

    const chatFooterInputNode = document.createElement("input");
    chatFooterInputNode.style.flexGrow = "1";

    const chatFooterSendButtonNode = document.createElement("button");
    chatFooterSendButtonNode.innerText = "Send";

    chatFooterNode.appendChild(chatFooterInputNode);
    chatFooterNode.appendChild(chatFooterSendButtonNode);

    chatNode.appendChild(chatHeaderNode);
    chatNode.appendChild(chatBodyNode);
    chatNode.appendChild(chatFooterNode);

    document.body.appendChild(chatNode);

    body = chatBodyNode;
  }
  // create a incoming chat message and appen into chat body

  const chatMessageNode = document.createElement("div");
  chatMessageNode.style.display = "flex";
  chatMessageNode.style.justifyContent = "flex-start";
  chatMessageNode.style.alignItems = "center";
  chatMessageNode.style.margin = "10px";

  const chatMessageLabelNode = document.createElement("label");
  chatMessageLabelNode.innerText = chatData.msg;

  chatMessageNode.appendChild(chatMessageLabelNode);

  body.appendChild(chatMessageNode);
});



//code start for update user

submituserNameNode.addEventListener("click", function(){
    const userName = userNameNode.value;
    // console.log(userName);
    socket.emit("connect user", userName);    //sends userName to server or set userName and event lisner of sockets line 46 or we can say that this line emits the event and this event is lisen by server at line 50 through high order function  
});   //to detect button is clicked or not


    // var form = document.getElementById("form");
    // var input = document.getElementById("input");

    // form.addEventListener("submit", function (e) {
    //   e.preventDefault();
    //   if (input.value) {
    //     socket.emit("chat message", input.value);
    //     input.value = "";

    //     //append messages to our list
    //     var item = document.createElement("li");
    //     item.textContent = input.value;
    //     messages.appendChild(item);
    //     item.style.textAlign = "right"; //this line have bug -- not working need to fix it to look like whatsapp
    //     window.scrollTo(0, document.body.scrollHeight);
    //   }
    // });

    socket.on("chat from parag", function (msg) {
    //   var item = document.createElement("li");
    //   item.textContent = msg;
    //   messages.appendChild(item);
    //   window.scrollTo(0, document.body.scrollHeight);
    console.log("user ne msg kia");
    });

    socket.on("disconnect", function () {
    //   var item = document.createElement("li");
    //   item.textContent = "user disconnected";
    //   messages.appendChild(item);
    //   item.style.textAlign = "left";
    //   window.scrollTo(0, document.body.scrollHeight);
    console.log("response chala gya");
    });

    socket.on("connect", function () {
    //   var item = document.createElement("li");
    //   item.textContent = "user connected";
    //   messages.appendChild(item);
    //   item.style.textAlign = "left";
    //   window.scrollTo(0, document.body.scrollHeight);
    console.log("response aa gya");
    });

    socket.on("user updated", function(userData){
        console.log(userData);
        if(!userData.nickName){     
            const nickName = prompt("Enter your nickName");
            
            if (nickName) {
                socket.emit("update user", {
                    nickName: nickName, 
                    userName: userData.userName,
                });
                //  userNickNamelabelNode.innerText = nickName;
            }
        }else{
        user = userData;
        userNickNamelabelNode.innerText = userData.nickName;

        }
                
    });

    socket.on("user updated nickname", function (userData) {
        user = userData;
        userNickNamelabelNode.innerText = userData.nickName;
    });

