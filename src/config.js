// Main locale has no public URL prefix. Every language keeps its own content directory.
export const locales = ["en", "de"];
export const mainLanguage = "en";
if (!locales.includes(mainLanguage))
  throw new TypeError("Site main language must belong to configured locales");
export const categoryPrefixes = { en: "/category", de: "/kategorie" };
