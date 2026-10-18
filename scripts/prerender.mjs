import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { render, paths, SENTINEL } from "../dist-ssr/entry-server.js";

/**
 * Turns the SPA shell into one real HTML file per route, so any static server
 * (or file://) can open any page directly. Links point at explicit index.html
 * files because file:// has no directory index; crossorigin is stripped because
 * file:// pages have origin "null" and crossorigin forces a CORS fetch that fails.
 *
 * SITE_URL (e.g. https://lavet13.github.io/portfolio/) is optional. When set, each
 * page gets a canonical link and the build writes sitemap.xml + robots.txt; both
 * need absolute URLs, so without it the output stays host-agnostic and skips them.
 */
const SITE_URL = process.env.SITE_URL?.replace(/\/?$/, "/"); // normalise to exactly one trailing slash

const shell = (await readFile("dist/index.html", "utf8")).replaceAll(" crossorigin", "");
const written = [];

for (const raw of paths()) {
  // trailingSlash: "always" makes the router redirect /bio -> /bio/, and a redirect renders
  // empty; routesByPath keys have no trailing slash, so normalise before rendering
  const path = raw.endsWith("/") ? raw : raw + "/";
  const depth = path.split("/").filter(Boolean).length;
  const base = depth ? "../".repeat(depth) : "./";

  const body = (await render(path)).replace(
    new RegExp(`href="${SENTINEL}/([^"?#]*)`, "g"),
    'href="./$1index.html',
  );
  const [, headTags, rest] = body.match(/^((?:<(?:title|meta|link)\b[^>]*>(?:[^<]*<\/title>)?)*)([\s\S]*)$/);
  if (!rest.trim()) throw new Error(`prerender: ${path} rendered empty (redirect or missing route?)`);

  const canonical = SITE_URL ? `<link rel="canonical" href="${SITE_URL}${path.slice(1)}">` : "";
  const html = shell
    .replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <base href="${base}">`)
    .replace(/<title>[^<]*<\/title>/, headTags.replace(/<(title|meta|link)\b/g, "<$1 data-prerendered") + canonical)
    .replace('<div id="root"></div>', `<div id="root">${rest}</div>`);

  await mkdir(join("dist", path), { recursive: true });
  await writeFile(join("dist", path, "index.html"), html);
  written.push(path);

  // [[x]] left in <head> text + <Fill> placeholders in the body (rendered with data-todo)
  const todo = (html.match(/\[\[[^\]]+\]\]|data-todo/g) ?? []).length;
  console.log(`prerendered ${path}${todo ? `  (${todo} placeholders left)` : ""}`);
}

if (SITE_URL) {
  const urls = written.map((p) => `  <url><loc>${SITE_URL}${p.slice(1)}</loc></url>`).join("\n");
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`);
  console.log(`sitemap.xml + robots.txt for ${SITE_URL}`);
} else {
  console.log("SITE_URL not set: no canonical links, sitemap.xml or robots.txt");
}
