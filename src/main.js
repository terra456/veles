import "./styles/main.scss";
import "./scripts/header-menu.js";
import "./scripts/form.js";

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

// Ленивая загрузка слайдеров (Swiper) — только когда пользователь доскроллит до секций
let slidersLoaded = false;
const sliderElements = document.querySelectorAll(".swiper");

if (sliderElements.length) {
  const sliderObserver = new IntersectionObserver(
    (entries) => {
      const intersectingEntry = entries.find((entry) => entry.isIntersecting);
      if (intersectingEntry && !slidersLoaded) {
        slidersLoaded = true;
        // Динамически импортируем Swiper-конфигурацию
        import("./scripts/slider.js");
        sliderObserver.disconnect();
      }
    },
    { threshold: 0.2 },
  );

  for (const el of sliderElements) {
    sliderObserver.observe(el);
  }
}

// Ленивая загрузка графика: подтягиваем Chart.js только когда блок виден
const chartSection = document.getElementById("chart");

if (chartSection) {
  const chartObserver = new IntersectionObserver(
    async (entries, obs) => {
      const entry = entries.find((e) => e.isIntersecting);
      if (!entry) return;

      obs.unobserve(entry.target);

      const { createSalesChart } = await import("./scripts/chart-component.js");

      const canvasWrapper = document.getElementById("salesChart");
      const btn25 = document.getElementById("chart-25");
      const btn26 = document.getElementById("chart-26");
      const tooltip = document.getElementById("chartTooltip");
      let chart;

      const labels = [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
      ];
      const values25 = [0, 0, 0, 0, 0, 0, 0, 0, 273040, 241320, 247440, 247440];
      const values26 = [247440, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      const isMobile = window.innerWidth < 768;

      chart = createSalesChart("salesChart", {
        labels: isMobile ? labels.slice(6, 12) : labels,
        values: isMobile ? values25.slice(6, 12) : values25,
      });

      if (btn25 && btn26) {
        btn25.addEventListener("click", () => {
          btn26.classList.remove("active");
          btn25.classList.add("active");
          chart.destroy();
          chart = createSalesChart("salesChart", {
            labels: isMobile ? labels.slice(6, 12) : labels,
            values: isMobile ? values25.slice(6, 12) : values25,
          });
        });
        btn26.addEventListener("click", () => {
          btn25.classList.remove("active");
          btn26.classList.add("active");
          chart.destroy();
          chart = createSalesChart("salesChart", {
            labels: isMobile ? labels.slice(0, 6) : labels,
            values: isMobile ? values26.slice(0, 6) : values26,
          });
        });
      }

      if (isMobile && canvasWrapper && tooltip) {
        canvasWrapper.addEventListener("click", () => {
          tooltip.classList.toggle("open");
        });
      }
    },
    { threshold: 0.2 },
  );

  chartObserver.observe(chartSection);
}
