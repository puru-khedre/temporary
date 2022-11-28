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

function timeFormater(timeStr, time = true) {
  let date = new Date(timeStr);
  if (time)
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  else {
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  }
}
