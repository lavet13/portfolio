import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Built pages get a <base href> from prerender.mjs, so relative URLs (./diss/figure-1.webp)
 * resolve from the site root on every page. The dev server serves index.html as it is, so give
 * it the same: <base href="/">. Without it, ./diss/… on the /diss/ page points at /diss/diss/….
 */
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
