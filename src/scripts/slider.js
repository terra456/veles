import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

const _reviewsSwiper = new Swiper("#reviews .swiper", {
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
    el: "#reviews .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: "#reviews .swiper-button-next",
    prevEl: "#reviews .swiper-button-prev",
  },
});

const _solutionSwiper = new Swiper("#solution .swiper", {
  modules: [Navigation, Pagination],
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 20,
  height: "auto",
  // loop: true,
  speed: 1000,
  pagination: {
    el: "#solution .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: "#solution .swiper-button-next",
    prevEl: "#solution .swiper-button-prev",
  },
});
