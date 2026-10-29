import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import mammoth from "mammoth";

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
  // the page already has its own <h1> ("Реферат"), so the document's levels shift down one
  "p[style-name='Heading 1'] => h2:fresh",
  "p[style-name='Heading 2'] => h3:fresh",
  // consecutive sources share ONE <ol class="sources">; each source is a fresh <li>
  "p[style-name='Bibliography'] => ol.sources > li:fresh",
];

const { value: raw, messages } = await mammoth.convertToHtml(
  { path: input },
  { styleMap },
);

/** Plain text of an HTML fragment: every tag removed. */
function textOf(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/** URL-friendly id: "3.1 Обзор международных источников" -> "3-1-обзор-международных-источников". */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // every run of non-letters/non-digits becomes one "-"
    .replace(/^-|-$/g, ""); // no "-" at the start or end
}

const html = raw
  // headings: plain text (drops the <strong> Word adds) plus an id the page can link to
  .replace(/<(h[23])>(.*?)<\/\1>/g, (_match, tag: string, inner: string) => {
    const text = textOf(inner);
    return `<${tag} id="${slugify(text)}">${text}</${tag}>`;
  })
  // the <ol> numbers the sources itself, so drop the typed "1. ", "2. "…
  .replace(/<li>\d+\.\s*/g, "<li>");

await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`${output}: ${Math.round(html.length / 1024)} KB`);

// mammoth reports what it couldn't map (unknown styles, unsupported elements)
for (const m of messages) console.warn(`${m.type}: ${m.message}`);
