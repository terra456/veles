import { resolve } from "node:path";
import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
  root: "src", // Корень - папка src
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
