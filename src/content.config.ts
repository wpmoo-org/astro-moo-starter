import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import { termFilePaths } from "./definitions.js";
import { sourceEntryId } from "@wpmoo/astro/content";
import { pageSchema } from "@wpmoo/astro/plugins/page/content";
import { postSchema } from "@wpmoo/astro/plugins/post/content";
import { termSchema } from "@wpmoo/astro/taxonomies/content";

const relationships = {
  taxonomies: z
    .object({
      category: z.array(reference("category")).default([]),
      tag: z.array(reference("tag")).default([]),
      sector: z.array(reference("sector")).default([]),
    })
    .strict()
    .optional(),
};
export const collections = {
  page: defineCollection({
    loader: glob({
      base: new URL("./content/page/", import.meta.url),
      pattern: "**/*.{md,mdx}",
      generateId: sourceEntryId,
      retainBody: true,
    }),
    schema: pageSchema.extend(relationships),
  }),
  post: defineCollection({
    loader: glob({
      base: new URL("./content/post/", import.meta.url),
      pattern: "**/*.md",
      generateId: sourceEntryId,
      retainBody: true,
    }),
    schema: postSchema.extend(relationships),
  }),
  category: defineCollection({
    loader: file(termFilePaths.category),
    schema: termSchema,
  }),
  tag: defineCollection({
    loader: file(termFilePaths.tag),
    schema: termSchema,
  }),
  sector: defineCollection({
    loader: file(termFilePaths.sector),
    schema: termSchema,
  }),
};
