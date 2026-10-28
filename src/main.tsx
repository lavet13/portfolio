import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { makeRouter } from "./router.ts";
import "./index.css";

const basepath = import.meta.env.DEV
  ? import.meta.env.BASE_URL // dev server: no <base> tag exists; I checked, this is "/" in dev
  : new URL(document.baseURI).pathname; // build: baseURI = the page's <base href> resolved to absolute, i.e. the site root, wherever it's hosted

// Someone may link to .../bio/index.html (a portal, an old bookmark); the router only knows /bio/.
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

const App = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

const rootElement = document.getElementById("root")!;

// The first load has nothing to animate from: the prerendered page is already on screen.
// Set BEFORE load(): the transition happens during it. One-shot, so later navigations animate.
router.shouldViewTransition = false;

// Dev server: #root is empty (no prerender), so there's nothing to keep on screen: render right away.
const ready = rootElement.hasChildNodes() ? router.load() : Promise.resolve();
// .then, not top-level await: if a lazy route chunk ever imports from this entry chunk,
// a pending top-level await would keep this module "evaluating" and that import would never finish.
void ready.then(() => {
  // [data-prerendered]: the head tags prerender.mjs wrote; <HeadContent /> renders the route's own
  document.querySelectorAll("[data-prerendered]").forEach((el) => el.remove());
  createRoot(rootElement).render(App);
});
