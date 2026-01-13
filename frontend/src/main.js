import "./scripts/header-menu.js";

// Анимация появления блоков "О нас"
const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Если анимация нужна только один раз — отписываемся
        aboutObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
); // 10% секции должно быть видно

const aboutCards = document.querySelector(".about_cards");
if (aboutCards) {
  aboutObserver.observe(aboutCards);
}

//скрытие кнопки наверх
window.onscroll = () => {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    document.getElementById("scrollToTopBtn").classList.add("show");
  } else {
    document.getElementById("scrollToTopBtn").classList.remove("show");
  }
};

const cookieConsent = localStorage.getItem("cookie-consent");

if (cookieConsent !== "true") {
  const cookie = document.getElementById("cookie");
  const cookieBtn = cookie.querySelector("#cookieBtn");
  cookie.classList.add("show");
  const closeCookieHandler = () => {
    cookie.classList.remove("show");
    localStorage.setItem("cookie-consent", true);
    cookieBtn.removeEventListener("click", closeCookieHandler);
  };
  cookieBtn.addEventListener("click", closeCookieHandler);
}
