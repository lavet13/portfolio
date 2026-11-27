/**
 * The home page photo, or undefined while there is none (the page then shows a [[Фото]] placeholder).
 * On main: commit the original as src/content/photo.jpg (or .png…); the build turns it into
 * public/photo.webp, and this becomes "./photo.webp". Not an import: an imported asset gets an
 * absolute /assets/… URL in the prerendered page, which breaks under a sub-path (/portfolio/).
 */
export const photo: string | undefined = "./photo.webp";
