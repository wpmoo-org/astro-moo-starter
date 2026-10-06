import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import moo from "@wpmoo/astro";
import { mainLanguage, locales } from "./src/config.js";
import { integration } from "./src/definitions.js";

export default defineConfig({
  site: "https://starter.example.test",
  i18n: {
    locales,
    defaultLocale: mainLanguage,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), moo(integration)],
});
