import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import moo from "@wpmoo/astro";
import { fileURLToPath } from "node:url";
import { mainLanguage, srcDir } from "./src/config.js";
import { integration } from "./src/definitions.js";

export default defineConfig({
  site: "https://starter.example.test",
  srcDir: fileURLToPath(srcDir),
  i18n: {
    locales: ["en", "de"],
    defaultLocale: mainLanguage,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), moo(integration)],
});
