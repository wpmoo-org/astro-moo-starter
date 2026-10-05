/**
 * @typedef {{readonly id: string, readonly label: string, readonly href: string}} TaxonomyLink
 * @typedef {{readonly id: string, readonly label: string, readonly links: readonly TaxonomyLink[]}} TaxonomyLinkGroup
 */

/**
 * @param {readonly Pick<import("@wpmoo/astro/taxonomies").Taxonomy, "id" | "label" | "locales">[]} taxonomies
 * @param {readonly import("@wpmoo/astro/taxonomies/queries").TaxonomyPath[]} paths
 * @param {string} locale
 * @returns {TaxonomyLinkGroup[]}
 */
export function groupTaxonomyLinks(taxonomies, paths, locale) {
  return taxonomies
    .map((taxonomy) => ({
      id: taxonomy.id,
      label: taxonomy.locales?.[locale]?.label ?? taxonomy.label,
      links: paths
        .filter((path) => path.props.taxonomy === taxonomy.id)
        .map(({ props }) => ({
          id: props.term.id,
          label: props.term.name,
          href: props.href,
        })),
    }))
    .filter((group) => group.links.length);
}

/**
 * @param {Pick<import("@wpmoo/astro/config").EntryClassContext, "taxonomies">} entry
 * @param {readonly TaxonomyLinkGroup[]} groups
 * @returns {TaxonomyLinkGroup[]}
 */
export function entryTaxonomyGroups(entry, groups) {
  return groups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) =>
        entry.taxonomies?.[group.id]?.includes(link.id),
      ),
    }))
    .filter((group) => group.links.length);
}
