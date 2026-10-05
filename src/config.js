// Site settings; the selected main locale has no public URL prefix.
export const mainLanguage = "en";
if (!["en", "de"].includes(mainLanguage))
  throw new TypeError("Invalid site main language");
export const categoryPrefixes = { en: "/category", de: "/kategorie" };
export const srcDir = new URL(`../routes/${mainLanguage}/`, import.meta.url);
