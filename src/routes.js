import { getRootPaths, getSiteContext } from "@wpmoo/astro/context";
import { getRouteLocale, getLocaleHref } from "@wpmoo/astro/i18n";
import { getPostPaths } from "@wpmoo/astro/plugins/post/queries";
import { getTaxonomyPaths } from "@wpmoo/astro/taxonomies/queries";

/** @param {string} routePattern */
export function getSiteRootPaths(routePattern) {
  return getRootPaths({ locale: getRouteLocale(routePattern) });
}
/** @param {string} routePattern */
export function getSitePostPaths(routePattern) {
  const locale = getRouteLocale(routePattern);
  const post = getSiteContext().plugins.find((plugin) => plugin.id === "post");
  if (!post) throw new TypeError("Site requires the post descriptor");
  const basePath = post.locales?.[locale]?.basePath ?? post.basePath;
  if (
    routePattern !==
    `${getLocaleHref(basePath, locale).replace(/\/$/, "")}/[...slug]`
  )
    return [];
  return getPostPaths({ locale, lang: locale, basePath });
}
/** @param {string} routePattern */
export function getSiteTaxonomyPaths(routePattern) {
  const locale = getRouteLocale(routePattern);
  const { taxonomies } = getSiteContext();
  const active = taxonomies.filter((taxonomy) => {
    if (!taxonomy.archive) return false;
    const base =
      taxonomy.locales?.[locale]?.basePath ?? taxonomy.archive.basePath;
    return (
      base &&
      base !== "/" &&
      routePattern ===
        `${getLocaleHref(base, locale).replace(/\/$/, "")}/[slug]`
    );
  });
  return active.length
    ? getTaxonomyPaths({
        locale,
        routePattern,
        taxonomies: active.map((taxonomy) => taxonomy.id),
      })
    : [];
}

/** @param {string} type @param {import("astro:content").CollectionEntry<"page" | "post">} entry @returns {import("@wpmoo/astro/config").EntryClassContext} */
export function entryContext(type, entry) {
  return {
    type,
    id: entry.id,
    source: "markdown",
    taxonomies: Object.fromEntries(
      Object.entries(entry.data.taxonomies ?? {}).map(([id, refs]) => [
        id,
        refs.map((ref) => ref.id),
      ]),
    ),
  };
}
