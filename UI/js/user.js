const accordion = document.querySelectorAll(".accordion");
const orderBtnModal = document.querySelectorAll(".order-btn");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close");

for (let i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

orderBtnModal.forEach(item =>
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

window.addEventListener("click", outsideClick);
