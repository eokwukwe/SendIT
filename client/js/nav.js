const sideBarIcon = document.querySelector(".sidebar-icon");
const closeBtn = document.querySelector(".btn-close-sidenav");
const signUp = document.querySelectorAll(".signup");
const sideNavItem = document.querySelectorAll(".side-nav-item");

sideBarIcon.addEventListener("click", openSlideMenu);
closeBtn.addEventListener("click", closeSlideMenu);
window.addEventListener("click", outsideClick);

function openSlideMenu() {
  const sideNav = document.querySelector("#side-menu");
  if (sideNav.style.width == "250px") {
    sideNav.style.width = "0";
  } else {
    sideNav.style.width = "250px";
  }
}

// outsideClick function
function outsideClick(e) {
  const mainBody = document.querySelector("body");
  const navBar = document.querySelector(".navbar");
  if (e.target == mainBody || e.target == navBar) {
    closeSlideMenu();
  }
}

function closeSlideMenu() {
  document.querySelector("#side-menu").style.width = "0";
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
