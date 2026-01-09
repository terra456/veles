// scripts/create-page.js
import fs from "fs";
import path from "path";

function createPage(pageName, title, description) {
  const template = fs.readFileSync("./src/templates/page.html", "utf8");

  const pageHTML = template
    .replace(/\${pageTitle}/g, title)
    .replace(/\${pageDescription}/g, description)
    .replace(/\${pageName}/g, pageName);

  // Создаем HTML файл
  fs.writeFileSync(`./src/${pageName}.html`, pageHTML);

  // Создаем SCSS файл
  const scssTemplate = `@use "../mixins/typography" as *;
@use "../mixins/utils" as *;
@use "../base/variables" as *;

.${pageName}-page {
  // Стили для страницы ${title}
}`;

  fs.writeFileSync(`./src/styles/pages/${pageName}.scss`, scssTemplate);

  // Создаем JS файл
  const jsTemplate = `// Скрипты для страницы ${title}

document.addEventListener('DOMContentLoaded', () => {
  console.log('${title} page loaded');
});`;

  fs.writeFileSync(`./src/scripts/pages/${pageName}.js`, jsTemplate);

  console.log(`Страница "${title}" создана успешно!`);
}

// Использование: node scripts/create-page.js services "Услуги" "Наши услуги по поддержке 1С"
const [, , pageName, title, description] = process.argv;
if (pageName && title && description) {
  createPage(pageName, title, description);
}
