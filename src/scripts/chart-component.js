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
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // Устанавливаем фиксированные размеры canvas для мобильных устройств
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Для мобильных: фиксированная высота, ширина 100%
    canvas.style.height = "370px"; // Фиксированная высота
    canvas.style.width = "100%"; // Ширина на всю доступную ширину
    canvas.width = canvas.offsetWidth; // Устанавливаем реальную ширину
    canvas.height = 370; // Фиксированная высота в пикселях
  }

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
          pointRadius: 0, // Убираем точки на мобильных
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Важно: отключаем сохранение пропорций
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
            borderDash: isMobile ? [5, 5] : [15, 15], // Пунктирная линия
          },
          ticks: {
            color: "#374151",
            font: {
              size: isMobile ? 12 : 14,
              family: "Inter",
            },
            maxRotation: isMobile ? 45 : 0,
          },
        },
        y: {
          grid: {
            display: true, // Показывать сетку по оси X
            color: "rgba(0, 0, 26, 0.15)", // Светло-серый цвет
            lineWidth: 1, // Толщина линии
            borderDash: isMobile ? [5, 5] : [15, 15], // Пунктирная линия
          },
          ticks: {
            color: "#374151",
            font: {
              size: isMobile ? 12 : 14,
              family: "Inter",
            },
            callback: (value) => {
              // Форматирование для мобильных - сокращаем числа
              if (isMobile && value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M ₽`;
              } else if (isMobile && value >= 1000) {
                return `${(value / 1000).toFixed(0)}K ₽`;
              }
              return `${value} ₽`;
            },
          },
        },
      },
    },
  });
}
