// Импортируем только нужные модули
import {
  CategoryScale,
  Chart,
  Filler, // Добавляем для градиентной заливки
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

// Регистрируем компоненты
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
);

// Создаем и экспортируем функцию для создания графика
export function createSalesChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Создаем градиент
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(25, 86, 205, 0.5)");
  gradient.addColorStop(1, "rgba(133, 167, 235, 0.3)");

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Экономия",
          data: data.values,
          borderColor: "#2e6ce6",
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          //pointBackgroundColor: '#2563eb',
          pointStyle: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}
