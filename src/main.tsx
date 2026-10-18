import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { makeRouter } from "./router.ts";
import "./index.css";

const basepath = import.meta.env.DEV
  ? import.meta.env.BASE_URL // dev server: no <base> tag exists; I checked, this is "/" in dev
  : new URL(document.baseURI).pathname; // build: baseURI = the page's <base href> resolved to absolute, i.e. the site root, wherever it's hosted

if (location.pathname.endsWith("/index.html")) {
  // replaceState - rewrite the URL bar in place: no reload, no new history entry
  // slice(0, -n) - drop the last n characters (the length of "index.html"), keeping the trailing slash
  // search/hash - re-attach ?query and #fragment so neither gets lost
  history.replaceState(
    history.state,
    "",
    location.pathname.slice(0, -"index.html".length) +
      location.search +
      location.hash,
  );
}

const router = makeRouter({ basepath });

await router.load(); // load the matched route's lazy chunk first, so the first render isn't the empty Suspense fallback

const root = document.getElementById("root")!;

const App = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// [data-prerendered] - CSS attribute selector: every element carrying that attribute
document.querySelectorAll("[data-prerendered]").forEach((el) => el.remove());

createRoot(root).render(App);
