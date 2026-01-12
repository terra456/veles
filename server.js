import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const DIST_PATH = path.join(__dirname, "dist");

// Проверяем dist папку
if (!fs.existsSync(DIST_PATH)) {
  console.error("❌ Папка dist не найдена. Сначала выполните: npm run build");
  process.exit(1);
}

// Middleware
app.use(compression());
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));

// Статика с умным кешированием
app.use(
  express.static(DIST_PATH, {
    maxAge: NODE_ENV === "production" ? "1y" : "0",
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath);

      if (ext === ".html") {
        res.setHeader("Cache-Control", "no-cache");
      } else if (ext.match(/\.(css|js|woff2|woff|ttf|eot|svg|png|jpg|jpeg|webp|ico)$/)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// Маршруты для HTML страниц
function setupHtmlRoutes() {
  // Главная страница
  app.get("/", (_req, res) => {
    res.sendFile(path.join(DIST_PATH, "index.html"));
  });

  // Автоматически находим все остальные HTML файлы
  const files = fs.readdirSync(DIST_PATH);

  files.forEach((file) => {
    if (file.endsWith(".html") && file !== "index.html") {
      const _routeName = file.replace(".html", "");

      app.get(`/${file}`, (_req, res) => {
        res.sendFile(path.join(DIST_PATH, file));
      });

      // Опционально: маршрут без .html (если хотите)
      // app.get(`/${routeName}`, (req, res) => {
      //   res.redirect(301, `/${file}`);
      // });
    }
  });

  console.log("📄 HTML страницы доступны с .html расширением");
}

// API для проверки (опционально)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

setupHtmlRoutes();

// 404 для несуществующих маршрутов
app.use((req, res) => {
  const errorPage = path.join(DIST_PATH, "404.html");

  if (fs.existsSync(errorPage)) {
    res.status(404).sendFile(errorPage);
  } else {
    res.status(404).send(`
      <h1>404 Not Found</h1>
      <p>Страница ${req.path} не существует.</p>
      <p><a href="/index.html">На главную</a></p>
    `);
  }
});

// Запуск
app.listen(PORT, () => {
  console.log(`
✅ Сервер запущен
📍 http://localhost:${PORT}
📂 Статика из: ${DIST_PATH}
🚀 ${NODE_ENV === "production" ? "Production mode" : "Development mode"}
  `);

  // Показываем доступные страницы
  console.log("\n📄 Доступные страницы:");
  console.log(`   Главная: http://localhost:${PORT}/index.html`);

  const htmlFiles = fs
    .readdirSync(DIST_PATH)
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => `   ${f.replace(".html", "")}: http://localhost:${PORT}/${f}`);

  htmlFiles.forEach((f) => {
    console.log(f);
  });
});
