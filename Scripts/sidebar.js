// sidebar.js
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.getElementById('side_btn'); // your button to toggle
  const serverButton = document.getElementById('servers');
  const settingButton = document.getElementById('settings');
  const ThemeButton = document.getElementById("themeUpload");
  let toggle = 0;
  // Or if you want to use the arrow image:
  // const arrowIcon = document.getElementById('side_bar_arrow');

   toggleButton.addEventListener('click', () => {
    if (toggle == 0) {
      toggleButton.textContent = ">"
      toggle = 1
    } else {
      toggleButton.textContent = "<"
      toggle = 0
    }
    sidebar.classList.toggle('show');
    document.body.classList.toggle('sidebar-open');
  });
  serverButton.addEventListener('click', () => {
    window.location.href = "../Pages/server_selection.html"
  });
  settingButton.addEventListener('click', () => {
    alert("work in progress...");
  });
});