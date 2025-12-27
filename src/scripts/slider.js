import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

const _swiper = new Swiper(".swiper", {
  modules: [Navigation, Pagination],
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 20,
  height: "auto",
  // loop: true,
  breakpoints: {
    1030: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
  },
  pagination: {
    el: "#swiper-pagination",
  },
  navigation: {
    nextEl: "#swiper-next",
    prevEl: "#swiper-prev",
  },
});

const swiper2 = new Swiper("#swiper2", {
  modules: [Navigation, Pagination],
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 20,
  height: "auto",
  // loop: true,
  speed: 1000,
  pagination: {
    el: "#swiper2-pagination",
  },
  navigation: {
    nextEl: "#swiper2-next",
    prevEl: "#swiper2-prev",
  },
});
