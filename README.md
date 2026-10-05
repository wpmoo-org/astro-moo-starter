# Moo Astro Starter

An Astro project with the built-in Moo UI appearance provided by
[@wpmoo/astro](https://github.com/wpmoo-org/ui-astro). It includes English and
German pages, Markdown/MDX content, a blog and custom taxonomies.

## Start

Use Node.js 22.12 or newer. Once `@wpmoo/astro` is published, install dependencies
with `npm install` and start the site with `npm run dev`.

The current SDK version is unpublished. Local development uses an exact SDK
archive in a separate prepared copy; the [SDK guide](https://github.com/wpmoo-org/ui-astro/blob/main/docs/guide.md)
describes that workflow.

## Make It Yours

- Edit pages and posts under `src/content/` and terms under `src/data/`.
- Set the main language and category paths in `src/config.js`.
- Configure the brand, post paths and taxonomy descriptors in `src/definitions.js`.
- Adjust site preferences and navigation in `src/preferences.js` and `src/navigation.js`.
- Compose public SDK components in `src/layouts/` and `src/views/`.

Translation keys connect entries; each language keeps its own slug. The main
language has no URL prefix. Content can belong to several terms, and each
taxonomy has its own sidebar submenu and linked archives.

These project files belong to your site. Updating the SDK dependency preserves
your content and settings; adopt starter-file revisions deliberately.

## License

MIT. Dependencies retain their own licenses:
[@wpmoo/astro](https://github.com/wpmoo-org/ui-astro/blob/main/packages/astro/LICENSE),
[Astro](https://github.com/withastro/astro/blob/main/LICENSE),
[@astrojs/mdx](https://github.com/withastro/astro/blob/main/LICENSE).
