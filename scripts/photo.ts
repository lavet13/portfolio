import { readdir, rm } from "node:fs/promises";
import sharp from "sharp";

/**
 * Turns the home page photo into the small square WebP the site serves.
 * Source: src/content/photo.jpg / .jpeg / .png / .webp / .avif, any size.
 * Output: public/photo.webp, generated on every build and not committed.
 *
 * Usage: node scripts/photo.ts
 */
const SOURCE_DIR = "src/content";
const OUTPUT = "public/photo.webp";
const SIZE = 480; // px; shown at up to 176 CSS px, so 480 stays sharp on 2x and 3x screens

const source = (await readdir(SOURCE_DIR)).find((name) =>
  /^photo\.(jpe?g|png|webp|avif)$/i.test(name),
);

// The template branch has no photo: remove a stale one from an earlier build, and go on
if (!source) {
  await rm(OUTPUT, { force: true });
  console.log(`no ${SOURCE_DIR}/photo.* found: skipping the photo`);
  process.exit(0);
}

const info = await sharp(`${SOURCE_DIR}/${source}`)
  .rotate() // no angle: turn it upright by its EXIF orientation (phone photos)
  .resize(SIZE, SIZE, { fit: "cover", position: "attention" }) // square crop around the most eye-catching region
  .webp({ quality: 80 })
  .toFile(OUTPUT);
console.log(`${OUTPUT}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
