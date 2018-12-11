const logout = document.querySelectorAll(".logout");
const orderBtn = document.querySelectorAll(".order-btn");
const loginemail = document.querySelector("#loginemail");
const loginpassword = document.querySelector("#loginpassword");
const loginSubmit = document.forms["login-form"];

const login = e => {
  e.preventDefault();

  const userEmail = loginemail.value;
  const password = loginpassword.value;
  const loginData = {
    userEmail,
    password
  };
  console.log(loginData);

  loginSubmit.reset();
  // if (uname === "admin@mail.com") {
  //   return (window.location.href = "admin.html");
  // }
  // return (window.location.href = "user.html");
};

if (document.readyState === "loading" || document.readyState === "complete") {
  logout.forEach(das => (das.style.display = "none"));
  orderBtn.forEach(item => (item.style.display = "none"));
  loginSubmit.addEventListener("submit", login);
}
