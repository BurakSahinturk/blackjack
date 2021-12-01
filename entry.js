const usernameInputEl = document.getElementById("player-name-input")
const submitButton = document.getElementById("submit-btn")
if (sessionStorage.getItem("username") !== null) {
    usernameInputEl.value = JSON.parse(sessionStorage.getItem("username"))
}

submitButton.addEventListener("click", function() {
    if (usernameInputEl.value === "") { 
        sessionStorage.setItem("username", "Oyuncu");
    }
    else {
        sessionStorage.setItem("username", JSON.stringify(usernameInputEl.value));
    }
    window.open("main.html", "_self");
})


usernameInputEl.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById("submit-btn").click();
  }
});