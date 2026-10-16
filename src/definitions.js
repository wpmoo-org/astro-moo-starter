import { defineSite } from "@wpmoo/astro/config";
import { page } from "@wpmoo/astro/plugins/page";
import { post } from "@wpmoo/astro/plugins/post";
import { defineTaxonomy } from "@wpmoo/astro/taxonomies";
import { mainLanguage, locales, categoryPrefixes } from "./config.js";
import { projectDefaults } from "./preferences.js";
import { getMessages } from "./messages.js";
import { fileURLToPath } from "node:url";

export const site = defineSite({
  brand: "Moo Starter",
  organization: { name: "Example Studio", names: { de: "Example Studio" } },
  defaults: { ...projectDefaults, lang: mainLanguage },
  presentation: {
    brandDescription: "Built with Moo UI",
    navigation: "grouped",
    assignedTaxonomies: true,
    themeToggle: true,
    languageSwitcher: { languageNames: { en: "English", de: "Deutsch" } },
    locales: { de: { brandDescription: "Mit Moo UI erstellt" } },
  },
  links: { home: "/", nativeAction: "/native-action" },
  locales: Object.fromEntries(
    locales.map((locale) => {
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
export const pagePlugin = page({
  source: new URL("./content/page/", import.meta.url),
  formats: ["md", "mdx"],
  taxonomies: bindings,
});
export const postPlugin = post({
  label: "Blog",
  basePath: "/blog",
  source: new URL("./content/post/", import.meta.url),
  taxonomies: bindings,
  locales: { de: { label: "Beiträge", basePath: "/beitraege" } },
});
export const integration = {
  site,
  plugins: [pagePlugin, postPlugin],
  taxonomies,
  blocks: {
    contentNote: { collection: "block", translationKey: "content-note" },
    pageInformation: { collection: "block", translationKey: "page-information" },
  },
  placements: [
    {
      id: "page-information",
      block: "pageInformation",
      at: "aside.content",
      order: 20,
      include: { translationKeys: ["placement-guide"] },
    },
    {
      id: "page-toc",
      block: "toc",
      at: "aside.content",
      include: { views: ["single"], types: ["page", "post"] },
    },
    {
      id: "content-note",
      block: "contentNote",
      at: "entry.after-content",
      include: { translationKeys: ["placement-guide"] },
    },
  ],
  notFound: {
    messages: { de: { title: "Diese Seite fehlt" } },
  },
};

export const sourceFilePaths = Object.fromEntries(
  [
    ...taxonomies
      .filter((taxonomy) => taxonomy.sourceKind === "json")
      .map((taxonomy) => taxonomy.source),
    ...integration.plugins.flatMap((plugin) =>
      plugin.contentTypes.flatMap((type) =>
        type.source.kind === "json" ? [type.source.file] : [],
      ),
    ),
  ].map((source) => [source, fileURLToPath(source)]),
);
