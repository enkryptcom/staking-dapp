import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import requireTransform from "vite-plugin-require-transform";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  define: {
    __PACKAGE_VERSION__: JSON.stringify(version),
    __IS_DEV__: process.env.NODE_ENV === 'development',
  },
  plugins: [vue(), requireTransform({}), basicSsl()],
  resolve: { alias: { "@/": new URL("./src/", import.meta.url).pathname } },
  css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
});
