const mod = document.getElementById("mod_server");
const global = document.getElementById("global_server");


mod.addEventListener("click", function() {
  localStorage.setItem("current_server", "Messages");
  window.location.href = "../Pages/Messenger.html"
})
global.addEventListener("click", function() {
  localStorage.setItem("current_server", "Global server");
  window.location.href = "../Pages/Messenger.html"
})