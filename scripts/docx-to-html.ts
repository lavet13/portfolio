import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import mammoth from "mammoth";

/**
 * Converts a .docx into HTML for the /diss/ page.
 * Step 1: a plain conversion, to see what mammoth makes of the document
 * before we teach it the document's own styles.
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

const { value: html, messages } = await mammoth.convertToHtml({ path: input });

await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`${output}: ${Math.round(html.length / 1024)} KB`);

// mammoth reports what it couldn't map (unknown styles, unsupported elements)
for (const m of messages) console.warn(`${m.type}: ${m.message}`);
