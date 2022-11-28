fetch("/getRecentChats")
  .then((res) => res.json())
  .then((chats) => {
    chats.forEach((chat) => {
      if (chat.message.length !== 0) {
        let reciever = chat.pair[0] !== recipant ? chat.pair[0] : chat.pair[1];
        fetch(`/getUserDetails/${reciever}`)
          .then((res) => res.json())
          .then((obj) => {
            let avatar = obj.avatar;
            let name = obj.name;
            let message = chat.message.slice(-1)[0];
            message.sender === sender
              ? setUserDiv(
                  reciever,
                  avatar,
                  name,
                  "<strong>you: </strong>" + message.message,
                  "recent-chats"
                )
              : setUserDiv(
                  reciever,
                  avatar,
                  name,
                  message.message,
                  "recent-chats"
                );
          });
      }
    });
  });

function setUserDiv(username, avatar, name, message, parent) {
  let div = document.createElement("div");
  div.setAttribute("class", "users-div");
  div.setAttribute("username", username);
  div.setAttribute("onclick", "renderRecipant(this)");
  div.setAttribute("child-of", parent);

  let img = document.createElement("img");
  img.src = `/getAvatar/${avatar}`;
  div.append(img);
  div.innerHTML += `<div><h3>${name}</h3>
  ${message ? `<p>${message}</p>` : ``}</div><span class="badge">0</span>`;
  document.querySelector(`#${parent} div`).prepend(div);
  return div;
}
