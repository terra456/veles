import "./styles/main.scss";
import "./scripts/header-menu.js";
import "./scripts/slider.js";
import "./scripts/form.js";
import { createSalesChart } from "./scripts/chart-component.js";

console.log("is started");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Опционально: отписаться, если анимация нужна только один раз
        // observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
); // 10% секции должно быть видно

observer.observe(document.querySelector(".about_cards"));

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("chart");
  const btn25 = document.getElementById("chart-25");
  const btn26 = document.getElementById("chart-26");
  const tooltip = document.getElementById("chartTooltip");

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

  if (canvas) {
    chart = createSalesChart("salesChart", {
      labels: isMobile ? labels.slice(6, 12) : labels,
      values: isMobile ? values25.slice(6, 12) : values25,
    });
    console.log("Chart created:", chart);

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
    if (isMobile) {
      canvas.addEventListener("click", () => {
        tooltip.classList.toggle("open");
      });
    }
  } else {
    console.warn("Canvas element #salesChart not found");
  }
});
