const login = document.querySelectorAll(".login");
const loginModal = document.querySelector(".login");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close");

window.addEventListener("click", outsideClick);

login.forEach(item =>
  item.addEventListener("click", () => {
    modal.style.display = "block";
    closeSlideMenu();
  })
);

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}
