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
        tooltip: {
          enabled: false, // Устанавливаем в false для отключения
        },
      },
      scales: {
        x: {
          grid: {
            display: true, // Показывать сетку по оси X
            color: "rgba(0, 0, 26, 0.15)", // Светло-серый цвет
            lineWidth: 1, // Толщина линии
            borderDash: [15, 15], // Пунктирная линия
          },
          ticks: {
            color: "#374151",
            font: {
              size: 14,
              family: "Inter",
            },
          },
        },
        y: {
          grid: {
            display: true, // Показывать сетку по оси X
            color: "rgba(0, 0, 26, 0.15)", // Светло-серый цвет
            lineWidth: 1, // Толщина линии
            borderDash: [15, 15], // Пунктирная линия
          },
          ticks: {
            color: "#374151",
            font: {
              size: 14,
              family: "Inter",
            },
            callback: (value) => {
              return `${value} ₽`;
            },
          },
        },
      },
    },
  });
}
