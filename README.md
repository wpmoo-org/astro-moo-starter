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

- Follow the short [content guide](docs/content.md) and copy a draft from
  [`templates/`](templates/) to add a page or post.
- Edit pages and posts under `src/content/` and terms under `src/data/`.
- Set the main language and category paths in `src/config.js`.
- Configure the brand, post paths and taxonomy descriptors in `src/definitions.js`.
- Adjust page preferences in `src/preferences.js` and site copy in `src/messages.js`.
- Configure the default appearance and header controls through `site.presentation`.

Content headings use title → description → breadcrumb → metadata/actions.
Set `projectDefaults.parts.pageHeader.alignment` in `src/preferences.js` to
`start` (default), `center` or `end`; type/view and entry options can override
the same preference. Breadcrumb translations belong to `parts.pageHeader`,
not the application Header. Logical RTL text alignment remains a known SDK
limitation and is not certified by the current visual candidate.

Translation keys connect entries; each language keeps its own slug. The main
language has no URL prefix. Content can belong to several terms, and each
taxonomy has its own sidebar submenu and linked archives.

Page, Post, taxonomy and 404 routes use the SDK’s default site. Routes are
defined once and projected over the configured languages; no copied Layout,
view or per-language route files are needed. A project can add native Astro
pages later using the public SDK SiteLayout.

These project files belong to your site. Updating the SDK dependency preserves
your content and settings; adopt starter-file revisions deliberately.

## Verification

Run `npm test`, `npm run check` and `npm run build` after installing the
matching SDK. CI runs these checks on pull requests into `main`, pushes to
`dev`/`main` and manual dispatches, using Node.js 22.23.2.

Until the SDK is published, CI packs the SDK from immutable source commit
`7808516c8e46d17d6625ac946ecb873437560ab9` and verifies archive SHA-256
`285c44a2b7f387b19a0b58e2d6a9a581eb826e638cfc2fa40dad479533b3be9e`
before installation. A source or archive mismatch fails verification. The
portable manifest keeps its ordinary SDK version; no local path or generated
lockfile is committed. SDK intake updates must deliberately refresh both
the source commit and archive hash after validation.

## License

MIT. Dependencies retain their own licenses:
[@wpmoo/astro](https://github.com/wpmoo-org/ui-astro/blob/main/packages/astro/LICENSE),
[Astro](https://github.com/withastro/astro/blob/main/LICENSE),
[@astrojs/mdx](https://github.com/withastro/astro/blob/main/LICENSE).
