import "./form.js";
import "./slider.js";
import { createSalesChart } from "./chart-component.js";

// Инициализация графика
const chartSection = document.getElementById("chart");
if (chartSection) {
  // Данные для графика
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
  let chart;

  // Создаем начальный график
  chart = createSalesChart("salesChart", {
    labels: isMobile ? labels.slice(6, 12) : labels,
    values: isMobile ? values25.slice(6, 12) : values25,
  });

  // Переключение между годами
  const btn25 = document.getElementById("chart-25");
  const btn26 = document.getElementById("chart-26");
  const tooltip = document.getElementById("chartTooltip");

  if (btn25 && btn26) {
    btn25.addEventListener("click", () => {
      btn26.classList.remove("active");
      btn25.classList.add("active");
      chart.destroy();
      chart = window.createSalesChart("salesChart", {
        labels: isMobile ? labels.slice(6, 12) : labels,
        values: isMobile ? values25.slice(6, 12) : values25,
      });
    });

    btn26.addEventListener("click", () => {
      btn25.classList.remove("active");
      btn26.classList.add("active");
      chart.destroy();
      chart = window.createSalesChart("salesChart", {
        labels: isMobile ? labels.slice(0, 6) : labels,
        values: isMobile ? values26.slice(0, 6) : values26,
      });
    });
  }

  // Мобильная версия: клик по графику открывает тултип
  if (isMobile && document.getElementById("salesChart") && tooltip) {
    const closeBtn = tooltip.querySelector("#closeTooltip");
    document.getElementById("salesChart").addEventListener("click", () => {
      tooltip.classList.toggle("open");
      if (closeBtn) closeBtn.classList.add("show");
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        tooltip.classList.toggle("open");
      });
    }
  }
}
