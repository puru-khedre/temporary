let logBox = document.querySelector("#logs div");
let flag = true;
const socket = io();

socket.on("user", (user) => {
  let p = document.createElement("p");
  p.textContent = `${user.name} has ${
    user.connected ? "joined" : "left"
  } the chat.`;
  logBox.prepend(p);

  if (user.connected && !flag) {
    let e = user.onlineUsers.slice(-1)[0];
    setUserDiv(e.username, e.avatar, e.name, null, "online-users");
  }
  if (user.connected && flag) {
    user.onlineUsers.forEach((e) => {
      setUserDiv(e.username, e.avatar, e.name, null, "online-users");
    });
    flag = false;
  }
  if (user.connected && user.username === recipant) {
    document.querySelector("#chater p").textContent = "Online";
  }
  if (!user.connected && user.username === recipant) {
    document.querySelector("#chater p").textContent = "Offline";
  }

  let reciever = document.querySelector("#chater").getAttribute("username");

  if (!user.connected) {
    let div = document.querySelector(`.users-div[username=${user.username}]`);
    div.remove();
  }
});

socket.on("chat-message", (message) => {
  if (recipant === message.sender) {
    setMessageDiv(message.sender, message.message);
  }

  let userInRecent = document.querySelector(
    `.users-div[username=${message.sender}][child-of="recent-chats"]`
  );
  userInRecent.children[1].children[1].innerHTML = message.message;
  if (message.sender !== recipant) {
    let userInOnline = document.querySelector(
      `.users-div[username=${message.sender}][child-of="online-users"]`
    );
    if (userInRecent) {
      +userInRecent.children[2].innerHTML++;
      userInRecent.children[2].style.display = "grid";
      document.querySelector("#recent-chats>div").prepend(userInRecent);
    }
    if (userInOnline) {
      userInOnline.children[2].innerHTML = "";
      userInOnline.children[2].style.display = "grid";
      document.querySelector("#online-users>div").prepend(userInOnline);
    }
  }
});
