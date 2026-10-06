import { defineCollection, reference, type CollectionKey } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import type { CollectionConfig } from "astro/content/config";
import { integration, sourceFilePaths } from "./definitions.js";
import { jsonEntryId, sourceEntryId } from "@wpmoo/astro/content";
import { pageSchema } from "@wpmoo/astro/plugins/page/content";
import { postSchema } from "@wpmoo/astro/plugins/post/content";
import { termSchema } from "@wpmoo/astro/taxonomies/content";

// Add a schema here once when registering a new content collection.
const schemas = {
  page: pageSchema,
  post: postSchema,
};

function withTaxonomies<S extends z.ZodRawShape>(
  schema: z.ZodObject<S>,
  ids: readonly string[],
) {
  return schema.extend({
    taxonomies: z
      .strictObject(
        Object.fromEntries(
          ids.map((id) => [id, z.array(reference(id)).default([])]),
        ),
      )
      .optional(),
  });
}

const entries = integration.plugins.flatMap((plugin) =>
  plugin.contentTypes.map(({ collection, source, taxonomies }) => {
    if (!Object.hasOwn(schemas, collection))
      throw new TypeError(
        `Add a schema for ${collection} in src/content.config.ts`,
      );
    const loader =
      source.kind === "markdown"
        ? glob({
            base: new URL(
              source.base ?? `./content/${collection}/`,
              import.meta.url,
            ),
            pattern:
              source.formats.length === 1
                ? `**/*.${source.formats[0]}`
                : `**/*.{${source.formats.join(",")}}`,
            generateId: sourceEntryId,
            retainBody: true,
          })
        : source.kind === "json"
          ? file(sourceFilePaths[source.file])
          : glob({
              base: new URL(source.base),
              pattern: "*.json",
              generateId: jsonEntryId,
            });
    return [
      collection,
      defineCollection({
        loader,
        schema: withTaxonomies(
          schemas[collection as keyof typeof schemas],
          taxonomies,
        ),
      }),
    ];
  }),
);

const terms = integration.taxonomies.map((taxonomy) => [
  taxonomy.id,
  defineCollection({
    loader:
      taxonomy.sourceKind === "json"
        ? file(sourceFilePaths[taxonomy.source])
        : glob({
            base: new URL(taxonomy.source),
            pattern: "*.json",
            generateId: jsonEntryId,
          }),
    schema: termSchema,
  }),
]);

type EntryCollections = {
  [K in keyof typeof schemas]: CollectionConfig<
    ReturnType<typeof withTaxonomies<(typeof schemas)[K]["shape"]>>
  >;
};
export const collections = Object.fromEntries([
  ...entries,
  ...terms,
]) as EntryCollections &
  Record<
    Exclude<CollectionKey, keyof typeof schemas>,
    CollectionConfig<typeof termSchema>
  >;
