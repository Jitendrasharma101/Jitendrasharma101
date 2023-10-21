const userNames = {};

function setuserNames(socket, userName) {
    // const userName = user;
    
    userNames[userName] = {
        data:{ userName: userName},
        connection: socket,
    };  //here userName is key and data & connection are values
    return userNames[userName];
}  // this finction saves the user in database.

function getUser(userName) {
    return userNames[userName];
}  // this function fetch the user from database.

function updateUser(userName, userData) {
    const user = getUser(userName);
  
    if (user) {
      user.data.nickName = userData.nickName;
      setuserNames(user.connection, user);
    }
  }

module.exports = {
    setuserNames: setuserNames,
    getUser: getUser,
    updateUser: updateUser,
} //we can use this if keys and values are same

// just example
// const user = {
//     data :{ userNames:"parag", nickName:"par"},
//     connection:"socket",
// }  nhi