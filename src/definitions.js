import { defineSite } from "@wpmoo/astro/config";
import { page } from "@wpmoo/astro/plugins/page";
import { post } from "@wpmoo/astro/plugins/post";
import { defineTaxonomy } from "@wpmoo/astro/taxonomies";
import { mainLanguage, categoryPrefixes } from "./config.js";
import { projectDefaults } from "./preferences.js";
import { getMessages } from "./messages.js";
import { fileURLToPath } from "node:url";

export const site = defineSite({
  brand: "Moo Starter",
  organization: { name: "Example Studio", names: { de: "Example Studio" } },
  defaults: { ...projectDefaults, lang: mainLanguage },
  locales: Object.fromEntries(
    ["en", "de"].map((locale) => {
      const copy = getMessages(locale);
      return [
        locale,
        {
          lang: locale,
          parts: {
            header: {
              toggleLabel: copy.toggle,
              navigationLabel: copy.navigation,
              breadcrumbLabel: copy.breadcrumb,
              skipLabel: copy.skip,
            },
            loop: { emptyText: copy.empty, dateStyle: "long" },
          },
        },
      ];
    }),
  ),
});
export const taxonomies = [
  defineTaxonomy({
    id: "category",
    label: "Categories",
    source: new URL("./data/category.json", import.meta.url),
    archive: { basePath: categoryPrefixes.en },
    locales: { de: { label: "Kategorien", basePath: categoryPrefixes.de } },
  }),
  defineTaxonomy({
    id: "tag",
    label: "Tags",
    source: new URL("./data/tag.json", import.meta.url),
    archive: { basePath: "/tag" },
    locales: { de: { label: "Schlagwörter", basePath: "/schlagwort" } },
  }),
  defineTaxonomy({
    id: "sector",
    label: "Sectors",
    source: new URL("./data/sector.json", import.meta.url),
    archive: { basePath: "/" },
    locales: { de: { label: "Bereiche", basePath: "/" } },
  }),
];
const bindings = taxonomies.map((taxonomy) => taxonomy.id);
export const termFilePaths = Object.fromEntries(
  taxonomies.map((taxonomy) => [taxonomy.id, fileURLToPath(taxonomy.source)]),
);
export const pagePlugin = page({
  source: new URL("./content/page/", import.meta.url),
  formats: ["md", "mdx"],
  taxonomies: bindings,
  routes: { single: "host" },
});
export const postPlugin = post({
  label: "Blog",
  basePath: "/blog",
  source: new URL("./content/post/", import.meta.url),
  taxonomies: bindings,
  routes: { single: "host", archive: "host" },
  locales: { de: { label: "Beiträge", basePath: "/beitraege" } },
});
export const integration = {
  site,
  plugins: [pagePlugin, postPlugin],
  taxonomies,
  taxonomyRoutes: { archive: "host" },
  notFound: {
    routeOwner: "host",
    messages: { de: { title: "Diese Seite fehlt" } },
  },
};
