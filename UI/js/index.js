const username = document.querySelector("#loginemail"),
  password = document.querySelector("#loginpwd"),
  loginData = document.forms["login-form"];

const loginSubmit = e => {
  e.preventDefault();

  const uname = username.value,
    psswd = password.value;

  console.log(uname, psswd);
  loginData.reset();
  window.location.href = "user.html";
};

if (document.readyState === "loading" || document.readyState === "complete") {
  logout.forEach(das => (das.style.display = "none"));
  orderBtnModal.forEach(das => (das.style.display = "none"));

  loginData.addEventListener("submit", loginSubmit);
}
