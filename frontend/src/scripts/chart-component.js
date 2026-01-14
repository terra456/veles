// Импортируем только нужные модули
import {
  CategoryScale,
  Chart,
  Filler, // Для градиентной заливки
  LinearScale,
  LineController,
  LineElement,
  PointElement, // Нужен для line-чарта, даже если точки визуально скрыты
} from "chart.js";

// Регистрируем контроллер линии, шкалы, элементы линии и точки, а также заливку
Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Filler);

// Создаем и экспортируем функцию для создания графика
export function createSalesChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // Устанавливаем фиксированные размеры canvas для мобильных устройств
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Для мобильных: фиксированная высота, ширина 100%
    canvas.style.height = "450px"; // Фиксированная высота
    canvas.style.width = "100%"; // Ширина на всю доступную ширину
    canvas.width = canvas.offsetWidth; // Устанавливаем реальную ширину
    canvas.height = 450; // Фиксированная высота в пикселях
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
        tooltip: { enabled: false }, // Тултипы отключены
        legend: { display: false }, // Легенда отключена
      },
      hover: {
        mode: null, // Полностью отключаем hover-обработку
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
