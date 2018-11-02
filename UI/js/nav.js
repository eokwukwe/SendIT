const sideBarIcon = document.querySelector(".sidebar-icon"),
  closeBtn = document.querySelector(".btn-close-sidenav"),
  signUp = document.querySelectorAll(".signup"),
  logout = document.querySelectorAll(".logout"),
  login = document.querySelectorAll(".login"),
  orderBtnModal = document.querySelectorAll(".order-btn"),
  closeModal = document.querySelector(".close"),
  modal = document.querySelector(".modal"),
  sideNavItem = document.querySelectorAll(".side-nav-item");

sideBarIcon.addEventListener("click", openSlideMenu);
closeBtn.addEventListener("click", closeSlideMenu);
window.addEventListener("click", outsideClick);

function openSlideMenu() {
  var x = document.querySelector("#side-menu");
  if (x.style.width == "250px") {
    x.style.width = "0";
  } else {
    x.style.width = "250px";
  }
}

function closeSlideMenu() {
  document.querySelector("#side-menu").style.width = "0";
}

// outsideClick function
function outsideClick(e) {
  const main = document.querySelector("main");
  const html = document.querySelector("html");
  const navBar = document.querySelector(".navbar");
  const body = document.querySelector("body");
  const sideNav = document.querySelector(".side-nav");
  if (e.target == modal) {
    modal.style.display = "none";
  }

  if (e.target === main || e.target === navBar || e.target === html) {
    closeSlideMenu();
  }
}

sideNavItem.forEach(item =>
  item.addEventListener("click", () => {
    closeSlideMenu();
  })
);

signUp.forEach(item =>
  item.addEventListener("click", () => {
    closeSlideMenu();
  })
);

login.forEach(item =>
  item.addEventListener("click", () => {
    modal.style.display = "block";
    closeSlideMenu();
  })
);

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
