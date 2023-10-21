const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const userBase = require("./userbase/users"); 
const { Socket } = require("dgram");
// const fs = require("fs");

app.get("/", function (request, response) {
  //     fs.readFile("chat.html", "utf8", function(err, data){
  //       if(err) {
  //           response.end(data);
  //       } else {
  //           response.end(data);
  //       }
  //   });

  // another way in express
  response.sendFile(__dirname + "/chat.html");
});

app.get("/script.js", function (request, response) {
  response.sendFile(__dirname + "/script.js");
});

app.get("/about", function (req, res) {
  res.send("this is about-us page");
});

app.get("/contact", function (req, res) {
  res.send("this is contact page");
});

io.on("connection", function (socket) {
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  // socket.on("chat message", function (msg) {
  //   console.log("message:" + msg);

  //   io.emit("le bhai msg aa gya", msg);
  // });

  // socket.on("connect user", function(userName){
  //   console.log("user connected:" + userName);
  // });                                                  //here userName used which is mentioned in html input tag

  socket.on("connect user", updateConnectedUsers(socket));    //high order functioning

  socket.on("update user", function (userData) {
    // console.log("first");
    // console.log("first");
    updateConnectedUsersName(socket, userData);
  });  //if high order function seems difficult then we can also use this, work same as HOF 

  socket.on("search friiend", function(friendName){
    searchFriend(friendName, socket);
  });

  socket.on("chat message", function (chatData) {
    
    handleChatMessage(chatData);
  });

  console.log("somebuddy connected");
});

//HOF
function updateConnectedUsers(socket){
  return function (userName){
    let userData = userBase.getUser(userName);
    // console.log(userData);
    if (!userData){
      // console.log(userData);
      userData = userBase.setuserNames(socket, userName);
     
    }else{
      socket.emit("user updated", userData.data);
    } 
  };
}

function updateConnectedUsersName(socket, userData) {
  // console.log(userData);
  const userName = userData.userName;

  userBase.updateUser(userName, userData);

  userData = userBase.getUser(userName);

  socket.emit("user updated nickname", userData.data);
}

function searchFriend(friendName, socket) {
  const friendData = userBase.getUser(friendName);

  socket.emit("search friend", friendData?.data);
}

function handleChatMessage(chatData){
  const friendData = userBase.getUser(chatData.friendUserName);

  friendData.connection.emit("chat message", chatData);
}
server.listen(3000, () => {
  console.log("server on port: 3000 ");
});
