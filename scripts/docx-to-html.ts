import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import mammoth from "mammoth";
import sharp from "sharp";

/**
 * Converts a .docx into HTML for the /diss/ page.
 *
 * Usage: node scripts/docx-to-html.ts <input.docx> <output.html>
 */
// argv is ["/usr/bin/node", "scripts/docx-to-html.ts", "<input>", "<output>"]
const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error(
    "usage: node scripts/docx-to-html.ts <input.docx> <output.html>",
  );
  process.exit(1);
}

/**
 * How the document's styles become HTML. Left of `=>`: a paragraph's Word style name;
 * right: the HTML to produce. Without :fresh, mammoth merges consecutive paragraphs
 * with the same mapping into one element, e.g. Two headings in a row would become a single <h2>
 * :fresh forces a new element each time.
 */
const styleMap = [
  // the page already has its own <h1> ("Реферат"), so every level shifts down one;
  // HTML stops at <h6>, so Heading 5 and 6 share it
  "p[style-name='Heading'] => h2:fresh",
  "p[style-name='Heading 1'] => h2:fresh",
  "p[style-name='Heading 2'] => h3:fresh",
  "p[style-name='Heading 3'] => h4:fresh",
  "p[style-name='Heading 4'] => h5:fresh",
  "p[style-name='Heading 5'] => h6:fresh",
  "p[style-name='Heading 6'] => h6:fresh",
  // the ВКР template's own heading styles
  "p[style-name='H1'] => h2:fresh",
  "p[style-name='H2'] => h3:fresh",
  // consecutive sources share ONE <ol class="sources">; each source is a fresh <li>
  "p[style-name='Bibliography'] => ol.sources > li:fresh",
  "p[style-name='Bib'] => ol.sources > li:fresh",
  // figure and table captions ("Рисунок 1 — …"), Word's built-in name and the template's
  "p[style-name='Caption'] => p.caption:fresh",
  "p[style-name='Cap'] => p.caption:fresh",
  // no :fresh on purpose: consecutive code lines merge into ONE <pre>, joined by newlines
  "p[style-name='Code'] => pre:separator('\\n')",
  "p[style-name='List Paragraph'] => p:fresh",
];

/**
 * Where the figures go. public/ is copied to the site root on build, and every page's
 * <base> points at the site root, so "./diss/…" works from any page.
 */
const IMAGES_DIR = "public/diss";
/**
 * rm(..., { recursive: true, force: true }) deletes the folder and everything in it.
 * force: true means “no error if it doesn’t exist”. It’s safe only because public/diss is
 * a folder this script generates; never point IMAGES_DIR at anything else.
 * */
await rm(IMAGES_DIR, { recursive: true, force: true }); // generated folder: start clean, no stale figures
await mkdir(IMAGES_DIR, { recursive: true });

let figureCount = 0;
/** Each figure becomes a WebP file instead of base64 inside the HTML. */
const convertImage = mammoth.images.imgElement(async (image) => {
  // figureCount numbers the files in document order: figure-1.webp, figure-2.webp, and so on.
  figureCount += 1;
  const name = `figure-${figureCount}.webp`;
  await sharp(await image.readAsBuffer())
    // scales down to 1600 px wide at most;
    // withoutEnlargement means smaller images stay as they are.
    .resize({ width: 1600, withoutEnlargement: true }) // plenty for a text column on a sharp screen
    .webp({ quality: 80 })
    .toFile(`${IMAGES_DIR}/${name}`);
  return { src: `./diss/${name}` };
});

const { value: raw, messages } = await mammoth.convertToHtml(
  { path: input },
  { styleMap, convertImage },
);

/** Plain text of an HTML fragment: it removes tags only; the text between them stays.
 * Examples:
 * "<strong>3.1 Обзор <a id="x"></a>международных</strong> источников " ->
 * "3.1 Обзор международных источников"
 */
function textOf(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/** URL-friendly id:
 * "3.1 Обзор международных источников" -> "3-1-обзор-международных-источников"
 * "«Цель» — и задачи!"                 -> "цель-и-задачи"
 * "  1) Итог  "                        -> "1-итог"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // every run of non-letters/non-digits becomes one "-"
    .replace(/^-|-$/g, ""); // no "-" at the start or end
}

/**
 * Gives every heading an id the page can link to, with plain text inside (drops the
 * <strong> Word adds). ids must be unique on a page, so a repeat gets "-2", "-3"…
 */
function withHeadingIds(html: string): string {
  const used = new Map<string, number>(); // id → how many headings have produced it so far
  return html.replace(
    /<(h[2-6])>(.*?)<\/\1>/g,
    (_match, tag: string, inner: string) => {
      const text = textOf(inner);
      const base = slugify(text);
      const count = (used.get(base) ?? 0) + 1; // ?? 0: a Map returns undefined for an unseen key
      used.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      return `<${tag} id="${id}">${text}</${tag}>`;
    },
  );
}

/**
 * Everything before the first heading (title block, «СОДЕРЖАНИЕ» with page numbers)
 * belongs to the printed document; the page has its own header and builds its own contents.
 */
function fromFirstHeading(html: string): string {
  const start = html.search(/<h[2-6][ >]/); // index of the first match, or -1 if none
  return start === -1 ? html : html.slice(start); // no heading at all: keep everything
}

/**
 * INPUT: <h2>ВВЕДЕНИЕ</h2><p>Текст</p><h2>ВЫВОДЫ</h2>
 * GREEDY (.*) : group2="ВВЕДЕНИЕ</h2><p>Текст</p><h2>ВЫВОДЫ" <- ONE match, swallowing both headings
 * LAZY   (.*?): group2="ВВЕДЕНИЕ", group2="ВЫВОДЫ"           <- two matches, one per heading
 */
const html = fromFirstHeading(withHeadingIds(raw))
  // an image paragraph followed by its "Рисунок N — …" caption → <figure> + <figcaption>;
  // the caption is also the alt text (the docx's own alt text is the diagram's Graphviz source)
  .replace(
    /<p><img [^>]*src="([^"]+)"[^>]*><\/p><p(?: class="caption")?>(Рисунок[^<]*)<\/p>/g,
    (_match, src: string, caption: string) =>
      `<figure><img src="${src}" alt="${caption}" loading="lazy" /><figcaption>${caption}</figcaption></figure>`,
  )
  // the <ol> numbers the sources itself, so drop the typed "1. ", "2. "…
  .replace(/<li>\d+\.\s*/g, "<li>");

await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`${output}: ${Math.round(html.length / 1024)} KB`);

// mammoth reports what it couldn't map (unknown styles, unsupported elements)
for (const m of messages) console.warn(`${m.type}: ${m.message}`);
