import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

// Инициализируем все слайдеры на странице
document.querySelectorAll(".swiper").forEach((swiperEl) => {
  const section = swiperEl.closest("section");
  const sectionId = section?.id;

  // Базовая конфигурация
  const baseConfig = {
    modules: [Navigation, Pagination],
    direction: "horizontal",
    slidesPerView: 1,
    height: "auto",
    pagination: {
      el: section?.querySelector(".swiper-pagination"),
      clickable: true,
    },
    navigation: {
      nextEl: section?.querySelector(".swiper-button-next"),
      prevEl: section?.querySelector(".swiper-button-prev"),
    },
  };

  // Специфичные настройки для разных секций
  if (sectionId === "reviews") {
    Object.assign(baseConfig, {
      spaceBetween: 20,
      breakpoints: {
        1030: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      },
    });
  } else if (sectionId === "solution") {
    Object.assign(baseConfig, {
      spaceBetween: 50,
      speed: 1000,
    });
  }

  new Swiper(swiperEl, baseConfig);
});
