const MENU = document.body.querySelector("#menu");
const TOGGLER = document.body.querySelector("#toggle");

function openMenu() {
  MENU.classList.add("open");
  TOGGLER.classList.add("open");
  MENU.classList.remove("close");
  TOGGLER.classList.remove("close");
  document.body.classList.add("no-scroll");
  document.body.addEventListener("click", closeMenu);
  document.body.addEventListener("touchmove", closeMenu);
}

function closeMenu() {
  MENU.classList.remove("open");
  TOGGLER.classList.remove("open");
  MENU.classList.add("close");
  TOGGLER.classList.add("close");
  document.body.classList.remove("no-scroll");
  document.body.removeEventListener("click", closeMenu);
  document.body.removeEventListener("touchmove", closeMenu);
}

TOGGLER.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (TOGGLER.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});
