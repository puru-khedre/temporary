let selectedAvatar = null;
function setImgInput(elem) {
  let val = elem.name;
  document.getElementById("avatar-input").value = val;

  if (selectedAvatar) {
    selectedAvatar.style.filter = "brightness(1)";
  }
  selectedAvatar = elem;
  elem.style.filter = "brightness(0.65)";
}
 
