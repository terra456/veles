import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import dotenv from "dotenv"; // Не забудьте импортировать dotenv
import express from "express";
import morgan from "morgan";
import nodemailer from "nodemailer";

// Загружаем переменные окружения
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const DIST_PATH = path.join(__dirname, "dist");

// Глобальный обработчик необработанных исключений
process.on("uncaughtException", (error) => {
  console.error("🔥 Необработанное исключение:", error);
  // Не завершаем процесс, продолжаем работу
});

process.on("unhandledRejection", (reason, _promise) => {
  console.error("🔥 Необработанный промис:", reason);
  // Не завершаем процесс, продолжаем работу
});

// Проверяем dist папку
if (!fs.existsSync(DIST_PATH)) {
  console.error("❌ Папка dist не найдена. Сначала выполните: npm run build");
  process.exit(1);
}

// Middleware
app.use(compression());
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());

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

// Настройка nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "465", 10),
    secure: true, // true для порта 465, false для других портов
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Эндпоинт для обработки формы
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Получены данные формы:", req.body);
    const { name, email, phone, text } = req.body;

    // Валидация
    if (!name || !email || !phone || !text) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    // Создаем транспорт
    const transporter = createTransporter();

    // Формируем письмо
    const mailOptions = {
      from: `"Veles Support" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: "Новая заявка с сайта Veles",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Новая заявка</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
              .content { padding: 20px 0; }
              .field { margin-bottom: 15px; }
              .field-label { font-weight: bold; color: #555; }
              .field-value { margin-top: 5px; padding: 10px; background-color: #f8f9fa; border-radius: 3px; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Новая заявка с сайта Veles</h2>
                <p>Время получения: ${new Date().toLocaleString("ru-RU")}</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="field-label">Имя:</div>
                  <div class="field-value">${name}</div>
                </div>
                <div class="field">
                  <div class="field-label">Email:</div>
                  <div class="field-value">${email}</div>
                </div>
                <div class="field">
                  <div class="field-label">Телефон:</div>
                  <div class="field-value">${phone}</div>
                </div>
                <div class="field">
                  <div class="field-label">Сообщение:</div>
                  <div class="field-value">${text.replace(/\n/g, "<br>")}</div>
                </div>
              </div>
              <div class="footer">
                <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Новая заявка с сайта Veles
        Время: ${new Date().toLocaleString("ru-RU")}
        
        Имя: ${name}
        Email: ${email}
        Телефон: ${phone}
        
        Сообщение:
        ${text}
      `,
    };

    // Отправляем письмо
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Заявка успешно отправлена",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      success: false,
      message: "Ошибка при отправке заявки",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

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

// Глобальный обработчик 500 ошибок (должен быть ПОСЛЕ всех маршрутов)
app.use((error, req, res, _next) => {
  console.error("🔥 Серверная ошибка 500:", {
    path: req.path,
    method: req.method,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  const errorPage = path.join(DIST_PATH, "500.html");

  if (fs.existsSync(errorPage)) {
    res.status(500).sendFile(errorPage);
  } else {
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>500 - Ошибка сервера</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #dc3545; }
          p { color: #666; }
          .debug { 
            display: ${NODE_ENV === "development" ? "block" : "none"};
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px auto; 
            max-width: 800px; 
            text-align: left; 
            border-radius: 5px; 
            font-family: monospace; 
            font-size: 12px; 
          }
          a { color: #007bff; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>500 - Внутренняя ошибка сервера</h1>
        <p>Произошла непредвиденная ошибка. Мы уже работаем над ее устранением.</p>
        <div class="debug">
          <strong>Детали (только для разработки):</strong><br>
          <pre>${error.message}\n${error.stack}</pre>
        </div>
        <p>
          <a href="/index.html">На главную</a> | 
          <a href="javascript:location.reload()">Обновить страницу</a> | 
          <a href="/api/health">Проверить сервер</a>
        </p>
      </body>
      </html>
    `);
  }
});

// Запуск сервера с обработкой ошибок
try {
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
} catch (error) {
  console.error("🔥 Критическая ошибка запуска сервера:", error);

  // Попробуем запустить на другом порту
  const fallbackPort = 3001;
  console.log(`🔄 Пробуем порт ${fallbackPort}...`);

  try {
    app.listen(fallbackPort, () => {
      console.log(`✅ Сервер запущен на запасном порту: http://localhost:${fallbackPort}`);
    });
  } catch (fallbackError) {
    console.error("🔥 Не удалось запустить сервер ни на одном порту:", fallbackError);
  }
}
