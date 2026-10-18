import { readFile, writeFile, mkdir } from "node:fs/promises";
// node: prefix - forces Node's built-in module, never a package that happens to share the name
import { render, paths, SENTINEL } from "../dist-ssr/entry-server.js";
// dist-ssr/ - the Node build from step 2 of the build script; prerender only runs after it

/**
 * Turns the SPA shell into one real HTML file per route, so any static server
 * (or file://) can open any page directly. Links point at explicit index.html
 * files because file:// has no directory index; crossorigin is stripped because
 * file:// pages have origin "null" and crossorigin forces a CORS fetch that fails.
 */
const shell = (await readFile("dist/index.html", "utf8")).replaceAll(
  " crossorigin",
  "",
);
// Vite adds crossorigin to its <script>/<link> tags. On http it's a no-op for same-origin files; on file:// it blocks even the CSS

for (const raw of paths()) {
  const path = raw.endsWith("/") ? raw : raw + "/"; // routesByPath keys come without a trailing slash ("/bio"); trailingSlash `always` turns /bio into a redirect that renders empty
  const depth = path.split("/").filter(Boolean).length; // "/bio/" -> 1, "/" -> 0
  const base = depth ? "../".repeat(depth) : "./"; // how many levels up to the site root
  const body = (await render(path)).replace(
    new RegExp(`href="${SENTINEL}/([^"?#]*)`, "g"),
    // ([^"?#]*) - capture group 1: the route path (bio/), stopping at the closing quote or a ?query/#hash so those stay after index.html
    // "g" - global flag: replace every match, not just the first
    'href="./$1index.html',
    // $1 - the captured path; result: ./bio/index.html, and ./index.html for home
  );
  if (!body.trim())
    throw new Error(
      `prerender: ${path} rendered empty (redirect or missing route?)`,
    );
  // .trim() - strip whitespace, so a render that produced only spaces/newlines still counts as empty
  // throw   - ends the node process with exit code 1, so `&&` stops the build script and CI never deploys blank pages
  const html = shell
    .replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <base href="${base}">`,
    ) // after charset; before every relative URL
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  await mkdir("dist" + path, { recursive: true }); // recursive - create parent dirs too; no error if it already exists
  await writeFile("dist" + path + "index.html", html);
  console.log(`prerendered ${path}`);
}
