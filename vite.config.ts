import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const MODE = process.env.NODE_ENV;

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    cssMinify: MODE === "production",
    target: "es2023",
  },
  plugins: [reactRouter(), tsconfigPaths()],
  server: {
    port: Number(process.env.PORT || 3000),
  },
});
