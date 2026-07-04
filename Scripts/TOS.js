const button = document.getElementById("submit_name");

button.addEventListener("click", function() {
  localStorage.setItem("Tos", "agreed")
  window.location.href = "../Pages/SignIn.html";
})