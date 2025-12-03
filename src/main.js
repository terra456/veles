import "./styles/main.scss";
import { createSalesChart } from "./scripts/chart-component.js";

console.log("is started");

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("salesChart");

  if (canvas) {
    const chart = createSalesChart("salesChart", {
      labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
      values: [10000, 15000, 12000, 18000, 16000, 20000],
    });
    console.log("Chart created:", chart);
  } else {
    console.warn("Canvas element #salesChart not found");
  }
});
