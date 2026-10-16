# Write Content

For an existing content type, add or edit a Markdown file. You do not need to
write a route, component, layout or collection configuration for each entry.

## Add a page or post

Copy a file from [`templates/`](../templates/) into the appropriate folder:

```text
src/content/
├── page/
│   ├── en/
│   └── de/
└── post/
    ├── en/
    └── de/
```

Every configured language, including the main language, has its own directory.
Set `locale` to the directory's language. The site's configured main language
determines which URLs have no language prefix; it is not fixed to English.

For example, create `src/content/page/en/summer-workshop.md`:

```md
---
title: "Summer workshop"
status: draft
locale: en
translationKey: summer-workshop
---

Our summer workshop brings students together.
```

The filename supplies the URL slug. With the starter's English main language,
this page will use `/summer-workshop` when published. Set an optional `slug`
to choose a different address. Nested folders can provide nested page paths.
Descriptions, dates, taxonomy assignments and page preferences are optional
for a draft page.

## Translate an entry

Create `src/content/page/de/sommerworkshop.md` with German text, `locale: de`
and the same `translationKey: summer-workshop`. Its filename supplies the
independent German URL `/de/sommerworkshop`. Files and slugs can differ;
the stable key connects translations within the same content type.

Use a new key for a different entry. Keep the key when changing a title or
slug. The same type/key/language combination must be unique. An untranslated
entry is valid; the language selector links only to its published translations.

## Publish deliberately

Templates start with `status: draft`. Draft and pending entries are not public.
Change the status to `publish` when the content is ready.

A published post also needs an explicit publication time, including timezone:

```yaml
status: publish
published_at: "2026-10-01T12:00:00Z"
```

Replace the example date with the actual publication time. A published entry
cannot have a future publication time. To reserve a future entry's URL, use
`status: future` and a future `published_at`. Publishing it later still requires
changing its status and rebuilding; the date does not automatically publish it.

While `npm run dev` is running, valid file saves synchronize through Astro's
native content loader. Production updates require a new build and deployment.

## Assign categories, tags or custom taxonomies

Use stable term IDs from `src/data/`, regardless of the entry's language:

```yaml
taxonomies:
  category: [guides, news]
  tag: [astro]
  sector: [development]
```

Omit the entire field when an entry has no assigned terms. Only taxonomies
bound to that content type are accepted. Assigning several terms leaves the
entry's own URL unchanged. The default site displays localized links to its
assigned terms and shows matching entries in each archive.

Add a term by editing its taxonomy data file. For example, add this object to
the array in `src/data/category.json`:

```json
{
  "id": "workshops",
  "name": "Workshops",
  "slug": "workshops",
  "locales": {
    "de": { "name": "Workshops", "slug": "werkstaetten" }
  }
}
```

Entries in either language assign `category: [workshops]`. Term IDs connect
assignments; localized names and slugs control presentation and archive URLs.
You do not edit the collection schema or add a route for a new term.

## Optional MDX

The Page type already accepts `.mdx`. Start with `templates/page.mdx` and use
ordinary prose first. MDX can also compose trusted public Moo components:

```mdx
import Button from "@wpmoo/astro/components/Button.astro";

<Button element="a" href={props.links.home} label="Back to home" />
```

`site.links` in `src/definitions.js` supplies prepared named links. Ordinary
Markdown content needs no imports. For MDX posts, set `formats: ["md", "mdx"]`
once on `postPlugin` in that file; the native loader follows the definition.

## One-time setup and extension

`src/definitions.js` is the source of truth for content directories, formats,
taxonomy bindings and localized URL prefixes. `src/content.config.ts` derives
native Astro loaders and reference fields from these descriptors. A source
change or a new taxonomy definition does not need a second loader declaration.
The starter supports taxonomy arrays and directories of individual JSON terms.

The supplied Page and Post plugins bind all configured taxonomies. A project
can select an explicit subset for each type. A new taxonomy needs one descriptor
and its data source; it then appears in the default site's grouped navigation
when its archive is enabled.

Adding a new content type is a developer setup step: define its plugin and
route composition once, then register its native schema in the `schemas` object
in `src/content.config.ts`. Custom schemas can extend the SDK's `entrySchema`
with fields such as a project's client or completion date. The collection uses
the plugin's declared Markdown, JSON-file or JSON-directory source. Its shared
route entrypoint can be projected over configured languages; additional entries
then require only content files.

Moo's built-in entry fields remain strict. An unknown frontmatter field is an
error; define a custom field in the relevant schema before authors use it.
For additional native collections outside the active Moo plugins, extend the
exported `collections` object with Astro's normal `defineCollection()` API.

Run `npm run check` for editor/type diagnostics, `npm test` for the starter's
authoring regression checks, and `npm run build` before publishing the site.
