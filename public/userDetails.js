let sender, recipant;
let avatar, names;
let messageBox = document.querySelector("#message-box");

fetch("/getUsername")
  .then((res) => res.json())
  .then((user) => {
    sender = user.username;
    recipant = sender;
    fetch("getUserDetails/" + sender)
      .then((res) => res.json())
      .then((details) => {
        setUserDetails(recipant, details.name, details.avatar, details.age);
        avatar = details.avatar;
        names = details.name;
        setTopBar(details.avatar, details.name, false);
      });

    fetch("/getChat/" + recipant)
      .then((res) => res.json())
      .then(async (chat) => {
        await chat.forEach((message) => {
          setMessageDiv(null, message.message);
          setMessageDiv(message.sender, message.message);
        });
        messageBox.scrollTop = messageBox.scrollHeight;
      });
  });

let detailsBox = document.querySelector("#user-details div");

function setUserDetails(username, name, avatar, age) {
  let div = `
    <div>
        <img src="/getAvatar/${avatar}" alt="">
        <h2>${name}</h2>
    </div>
    <p>
        <strong>User name: </strong>${username}
    </p>
    <p>
        <strong>Age: </strong>${age}
    </p>`;

  detailsBox.innerHTML = div;
}
