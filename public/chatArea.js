let svg = `<svg viewBox="0 0 8 13" width="8" height="13" class="">
<path fill="currentColor" d="M1.533 2.568 8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z">
</path>
</svg>`;

function setMessageDiv(from, message) {
  let messageDiv = `<div class="${
    from === recipant ? "recipant" : "sender"
  }-message">
  ${svg}
  <span>${message}</span>
  </div>`;
  messageBox.innerHTML += messageDiv;
}

let setTopBar = (avatar, name, ispath) => {
  let status = document.querySelector(
    `.users-div[username=${recipant}][child-of='online-users']`
  )
    ? "Online"
    : "Offline";
  let chater = `
<img src=${ispath ? avatar : `/getAvatar/${avatar}`} alt="">
<div>
    <h2>${name}</h2>
    <p>${status}</p>
</div>`;
  document.querySelector("#chater").innerHTML = chater;
};

function renderRecipant(elem) {
  recipant = elem.getAttribute("username");
  let imgSrc = elem.childNodes[0].src;
  let name = elem.childNodes[1].children[0].innerText;

  setTopBar(imgSrc, name, true);
  document.querySelector("#chater").setAttribute("username", recipant);
  document.querySelector("#message-box").innerHTML = "<div></div>";

  fetch("/getChat/" + recipant)
    .then((res) => res.json())
    .then(async (chat) => {
      if (chat.length !== 0) {
        await chat.forEach((message) => {
          if (recipant === sender) {
            setMessageDiv(null, message.message);
          }
          setMessageDiv(message.sender, message.message);
        });
      }
      messageBox.scrollTop = messageBox.scrollHeight;
    });
  if (screen.width < 450) {
    document.querySelector("#right-section").style.display = "block";
    document.querySelector("#left-section").style.display = "none";
  }

  let userInRecent = document.querySelector(
    `.users-div[username=${recipant}][child-of="recent-chats"]`
  );
  let userInOnline = document.querySelector(
    `.users-div[username=${recipant}][child-of="online-users"]`
  );

  if (userInRecent) {
    userInRecent.children[2].style.display = "none";
    userInRecent.children[2].innerHTML = "0";
  }
  if (userInOnline) {
    userInOnline.children[2].style.display = "none";
  }
}

function sendMessage() {
  let message = document.querySelector("#message-input input").value;

  if (/\S/.test(message)) {
    socket.emit("chat-message", {
      sender,
      recipant,
      message,
      time: new Date(),
    });

    let div = `
      <div class="sender-message">
        ${svg}
        <span>${message}</span>
      </div>`;

    messageBox.innerHTML += div;
    messageBox.scrollTop = messageBox.scrollHeight;

    document.querySelector(
      `.users-div[username=${recipant}][child-of="recent-chats"]>div>p`
    ).innerHTML = "you: " + message;
  }
  document.querySelector("#message-input input").value = "";
}

function showExtra() {
  if (screen.width < 450) {
    document.querySelector("#right-section").style.display = "none";
    document.querySelector("#left-section").style.display = "flex";
  }
}
function enterEmoji(ele) {
  let input = document.querySelector("#message-input input");
  let emoji = ele.innerHTML;
  input.value += emoji;
}

function showEmojiBox() {
  let box = document.getElementById("emojis");
  let display = box.style.display;
  if (display === "none") {
    box.style.display = "flex";
  } else {
    box.style.display = "none";
  }
}
