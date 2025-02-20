import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import requireTransform from "vite-plugin-require-transform";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [vue(), requireTransform({}), basicSsl()],
  resolve: { alias: { "@/": new URL("./src/", import.meta.url).pathname } },
  css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
});
