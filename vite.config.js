import { resolve } from "node:path";
import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
  root: "src", // Корень - папка src
  // Базовый путь для сборки — сайт развёрнут в поддиректории /veles/
  base: "/veles/",
  // Публичные файлы (шрифты/картинки) лежат в `src/public` и должны копироваться в dist
  publicDir: resolve(__dirname, "src/public"),
  build: {
    outDir: "../dist", // Результат в папку dist
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        // news: resolve(__dirname, "src/news.html"),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [injectHTML()],
});
