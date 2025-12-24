import "./styles/main.scss";
import "./scripts/header-menu.js";
import "./scripts/slider.js";
import { createSalesChart } from "./scripts/chart-component.js";

console.log("is started");

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("chart");
  const btn25 = document.getElementById("chart-25");
  const btn26 = document.getElementById("chart-26");

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
  const values25 = [0, 0, 0, 0, 0, 0, 10000, 15000, 12000, 18000, 16000, 20000];
  const values26 = [10000, 15000, 12000, 18000, 16000, 20000, 0, 0, 0, 0, 0, 0];

  if (canvas) {
    let chart = createSalesChart("salesChart", {
      labels,
      values: values25,
    });
    console.log("Chart created:", chart);

    btn25.addEventListener("click", () => {
      btn26.classList.remove("active");
      btn25.classList.add("active");
      chart.destroy();
      chart = createSalesChart("salesChart", {
        labels,
        values: values25,
      });
    });
    btn26.addEventListener("click", () => {
      btn25.classList.remove("active");
      btn26.classList.add("active");
      chart.destroy();
      chart = createSalesChart("salesChart", {
        labels,
        values: values26,
      });
    });
  } else {
    console.warn("Canvas element #salesChart not found");
  }
});
