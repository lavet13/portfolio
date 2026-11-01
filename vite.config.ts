import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

function devBase(): Plugin {
  return {
    name: "dev-base",
    apply: "serve", // the dev server only; for builds, prerender.mjs writes the <base>
    transformIndexHtml: () => [
      { tag: "base", attrs: { href: "/" }, injectTo: "head-prepend" },
    ],
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    devBase(),
    tanstackRouter({ target: "react", autoCodeSplitting: false }),
    react(),
    tailwindcss(),
  ],
});
