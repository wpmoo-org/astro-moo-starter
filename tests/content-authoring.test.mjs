import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const starter = fileURLToPath(new URL("../", import.meta.url));

async function fixture(run) {
  const cache = join(starter, "node_modules/.cache/authoring-tests");
  await mkdir(cache, { recursive: true });
  const root = await mkdtemp(join(cache, "moo-authoring-"));
  const write = async (name, value) => {
    await mkdir(dirname(join(root, name)), { recursive: true });
    await writeFile(join(root, name), value);
  };
  const replace = async (name, before, after) => {
    const source = await readFile(join(root, name), "utf8");
    assert.ok(source.includes(before), `fixture input missing in ${name}`);
    await write(name, source.replace(before, after));
  };
  const build = () => {
    const result = spawnSync(
      process.execPath,
      [
        join(starter, "node_modules/astro/bin/astro.mjs"),
        "build",
        "--root",
        root,
      ],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 60000,
        maxBuffer: 8 * 1024 * 1024,
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
      },
    );
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  };
  const check = () => {
    const result = spawnSync(
      process.execPath,
      [
        join(starter, "node_modules/typescript/bin/tsc"),
        "--noEmit",
        "--pretty",
        "false",
        "--project",
        join(root, "tsconfig.json"),
      ],
      { cwd: root, encoding: "utf8", timeout: 60000 },
    );
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  };
  try {
    for (const name of [
      "src",
      "astro.config.mjs",
      "tsconfig.json",
      "package.json",
    ])
      await cp(join(starter, name), join(root, name), { recursive: true });
    await run({ root, write, replace, build, check });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

for (const sourceKind of ["json", "json-directory"]) {
  test(`a taxonomy definition alone creates native ${sourceKind} references and translated archives`, async () => {
    await fixture(async ({ root, write, replace, build }) => {
      const term = {
        id: "students",
        name: "Students",
        slug: "students",
        locales: { de: { name: "Studierende", slug: "studierende" } },
      };
      const source = sourceKind === "json" ? "audience.json" : "audience/";
      await write(
        `src/data/${sourceKind === "json" ? source : `${source}students.json`}`,
        JSON.stringify(sourceKind === "json" ? [term] : term),
      );
      await replace(
        "src/definitions.js",
        "export const taxonomies = [",
        `export const taxonomies = [
  defineTaxonomy({
    id: "audience", label: "Audience", sourceKind: "${sourceKind}",
    source: new URL("./data/${source}", import.meta.url),
    archive: { basePath: "/audience" },
    locales: { de: { label: "Zielgruppen", basePath: "/zielgruppe" } },
  }),`,
      );
      for (const locale of ["en", "de"])
        await write(
          `src/content/page/${locale}/student-guide.md`,
          `---\ntitle: Student guide\nstatus: publish\nlocale: ${locale}\ntranslationKey: student-guide\ntaxonomies:\n  audience: [students]\n---\nWritten without a route or component.\n`,
        );
      build();
      const page = await readFile(
        join(root, "dist/de/student-guide/index.html"),
        "utf8",
      );
      const assignedLinks = (page.match(/<a\s[^>]+>/gu) ?? []).filter(
        (anchor) => /rel="tag"/u.test(anchor),
      );
      assert.ok(
        assignedLinks.some((anchor) =>
          /href="\/de\/zielgruppe\/studierende"/u.test(anchor),
        ),
      );
      const archive = await readFile(
        join(root, "dist/de/zielgruppe/studierende/index.html"),
        "utf8",
      );
      const content = archive.match(/<main\b[^>]*>([\s\S]*?)<\/main>/u)?.[1];
      assert.ok(content, "taxonomy archive main content missing");
      assert.match(content, /href="\/de\/student-guide"/u);
      assert.doesNotMatch(content, /href="\/de\/kontakt"/u);
    });
  });
}

test("source directory and MDX formats follow the plugin definition without collection edits", async () => {
  await fixture(async ({ root, write, replace, build }) => {
    await rename(
      join(root, "src/content/page"),
      join(root, "src/content/pages"),
    );
    await replace(
      "src/definitions.js",
      'source: new URL("./content/page/", import.meta.url)',
      'source: new URL("./content/pages/", import.meta.url)',
    );
    await replace(
      "src/definitions.js",
      'label: "Blog",',
      'label: "Blog",\n  formats: ["md", "mdx"],',
    );
    for (const locale of ["en", "de"])
      await write(
        `src/content/post/${locale}/mdx-story.mdx`,
        `---\ntitle: MDX story\nstatus: publish\nlocale: ${locale}\ntranslationKey: mdx-story\npublished_at: "2026-10-01T12:00:00Z"\n---\nA **native MDX** post.\n`,
      );
    build();
    const page = await readFile(join(root, "dist/about/index.html"), "utf8");
    assert.match(page, /This authored content belongs to the project/u);
    const post = await readFile(
      join(root, "dist/de/beitraege/mdx-story/index.html"),
      "utf8",
    );
    assert.match(post, /<strong>native MDX<\/strong>/u);
    assert.match(post, /href="\/blog\/mdx-story"/u);
  });
});

test("native collection schema inference preserves authoring fields", async () => {
  await fixture(async ({ write, build, check }) => {
    await write(
      "src/authoring-types.ts",
      `
import type { CollectionEntry } from "astro:content";
import { collections } from "./content.config";
type Assert<T extends true> = T;
type IsAny<T> = 0 extends (1 & T) ? true : false;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Page = CollectionEntry<"page">["data"];
type Post = CollectionEntry<"post">["data"];
type PageFieldsRemainTyped = Assert<Equal<IsAny<Page>, false>>;
type Title = Assert<Equal<Page["title"], string>>;
type Navigation = Assert<Equal<Page["navOrder"], number | undefined>>;
type Publication = Assert<Equal<Post["status"], "publish" | "draft" | "pending" | "future">>;
type Term = CollectionEntry<"category">["data"];
type TermName = Assert<Equal<Term["name"], string>>;
// @ts-expect-error A nonexistent collection must not appear as a valid one.
type UnknownCollection = typeof collections.cateogry;
`,
    );
    build();
    check();
  });
});

test("copying and publishing draft templates requires only content edits", async () => {
  await fixture(async ({ root, write, replace, build }) => {
    const copies = [
      ["page.md", "page/en/copied-page.md", "copied-page/index.html"],
      ["page.mdx", "page/en/copied-mdx.mdx", "copied-mdx/index.html"],
      ["post.md", "post/en/copied-post.md", "blog/copied-post/index.html"],
    ];
    for (const [template, entry] of copies)
      await write(
        `src/content/${entry}`,
        await readFile(join(starter, "templates", template), "utf8"),
      );
    build();
    for (const [, , output] of copies)
      await assert.rejects(readFile(join(root, "dist", output)), {
        code: "ENOENT",
      });
    for (const [, entry] of copies)
      await replace(`src/content/${entry}`, "status: draft", "status: publish");
    await replace(
      "src/content/post/en/copied-post.md",
      "status: publish",
      'status: publish\npublished_at: "2026-10-01T12:00:00Z"',
    );
    build();
    for (const [, , output] of copies)
      assert.match(
        await readFile(join(root, "dist", output), "utf8"),
        /Write your (?:page|post) here/u,
      );
  });
});

for (const kind of ["json", "json-directory"]) {
  test(`a custom ${kind} collection keeps its declared schema and localized route`, async () => {
    await fixture(async ({ root, write, replace, build, check }) => {
      await replace(
        "src/definitions.js",
        "import { defineSite }",
        'import { definePlugin } from "@wpmoo/astro/plugins";\nimport { defineSite }',
      );
      await replace(
        "src/definitions.js",
        "export const integration = {",
        `
const projectPlugin = definePlugin({
  apiVersion: 1, id: "projects", label: "Projects", basePath: "/project",
  locales: { de: { label: "Projekte", basePath: "/projekt" } },
  contentTypes: [{ id: "project", collection: "project", singleRoute: "single",
    source: ${
      kind === "json"
        ? '{ kind: "json", file: new URL("./data/projects.json", import.meta.url) }'
        : '{ kind: "json-directory", base: new URL("./data/projects/", import.meta.url) }'
    },
  }],
  routes: [{ id: "single", pattern: "/[...slug]", prerender: true,
    entrypoint: new URL("./project-route.astro", import.meta.url) }],
});
export const integration = {`,
      );
      await replace(
        "src/definitions.js",
        "plugins: [pagePlugin, postPlugin]",
        "plugins: [pagePlugin, postPlugin, projectPlugin]",
      );
      await replace(
        "src/content.config.ts",
        "import { jsonEntryId, sourceEntryId }",
        'import { entrySchema } from "@wpmoo/astro/content";\nimport { jsonEntryId, sourceEntryId }',
      );
      await replace(
        "src/content.config.ts",
        "const schemas = {",
        "const schemas = {\n  project: entrySchema.extend({ id: z.string(), client: z.string() }),",
      );
      const entries = [
        {
          id: "en-demo",
          title: "Demo project",
          status: "publish",
          locale: "en",
          translationKey: "demo",
          slug: "demo-project",
          client: "Example client",
        },
        {
          id: "de-demo",
          title: "Demoprojekt",
          status: "publish",
          locale: "de",
          translationKey: "demo",
          slug: "demoprojekt",
          client: "Beispielkunde",
        },
      ];
      if (kind === "json")
        await write("src/data/projects.json", JSON.stringify(entries));
      else
        for (const entry of entries)
          await write(
            `src/data/projects/${entry.id}.json`,
            JSON.stringify(entry),
          );
      await write(
        "src/project-route.astro",
        `---
import { getCollection } from "astro:content";
import { getRouteLocale } from "@wpmoo/astro/i18n";
export async function getStaticPaths({ routePattern }) {
  const locale = getRouteLocale(routePattern);
  const entries = await getCollection("project", entry => entry.data.status === "publish" && entry.data.locale === locale);
  return entries.map(entry => ({ params: { slug: entry.data.slug }, props: { entry } }));
}
const { entry } = Astro.props;
---
<h1>{entry.data.title}</h1>
<p>{entry.data.client}</p>
`,
      );
      await write(
        "src/project-types.ts",
        `
import type { CollectionEntry } from "astro:content";
type Assert<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Client = Assert<Equal<CollectionEntry<"project">["data"]["client"], string>>;
`,
      );
      build();
      check();
      const page = await readFile(
        join(root, "dist/de/projekt/demoprojekt/index.html"),
        "utf8",
      );
      assert.match(page, /<h1>Demoprojekt<\/h1>/u);
      assert.match(page, /<p>Beispielkunde<\/p>/u);
    });
  });
}
