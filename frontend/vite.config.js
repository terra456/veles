import { resolve } from "node:path";
import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
  root: "src", // Корень - папка src
  // Базовый путь для сборки — сайт развёрнут в поддиректории /veles/
  base: "./",
  // Публичные файлы (шрифты/картинки) лежат в `src/public` и должны копироваться в dist
  publicDir: resolve(__dirname, "src/public"),
  build: {
    outDir: "../../dist", // Выходит в корневую папку dist
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        privacy: resolve(__dirname, "src/privacy-policy.html"),
        cookie: resolve(__dirname, "src/cookie-policy.html"),
        terms: resolve(__dirname, "src/data-processing.html"),
        notfound: resolve(__dirname, "src/404.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    // Включаем brotli сжатие для больших файлов
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
  plugins: [injectHTML()],
});
