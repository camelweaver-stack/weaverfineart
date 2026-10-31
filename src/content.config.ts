import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const dateField = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD form."));

const priceField = z.union([
  z.number().positive(),
  z.literal("Inquire"),
  z.literal("inquire").transform(() => "Inquire" as const),
]);

const works = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        artist: z.string().min(1),
        artistSlug: z.string().min(1),
        year: z.number().int().optional(),
        medium: z.string().min(1),
        region: z.enum(["Indiana", "Texas", "Midwest", "Other"]),
        imageWidthIn: z.number().positive(),
        imageHeightIn: z.number().positive(),
        frameWidthIn: z.number().positive().optional(),
        frameHeightIn: z.number().positive().optional(),
        condition: z.string().min(1),
        signature: z.string().min(1),
        verso: z.string().optional(),
        provenance: z.string().min(1),
        price: priceField,
        ownership: z.enum(["owned", "consigned"]).default("owned"),
        status: z.enum(["available", "hold", "sold"]),
        soldOn: dateField.optional(),
        featured: z.boolean().default(false),
        dateAdded: dateField,
        draft: z.boolean().default(false),
        images: z
          .array(
            z.object({
              file: image(),
              alt: z.string().min(10),
              caption: z.string().optional(),
              placeholder: z.boolean().default(false),
            }),
          )
          .min(1),
      })
      .superRefine((data, ctx) => {
        if (data.status !== "sold" && data.ownership === "owned" && typeof data.price !== "number") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["price"],
            message: "Available and on-hold works the gallery owns must have a dollar price. Only a sold work or a consigned work may leave its price unpublished.",
          });
        }
        const hasWidth = data.frameWidthIn != null;
        const hasHeight = data.frameHeightIn != null;
        if (hasWidth !== hasHeight) {
          ctx.addIssue({
            code: "custom",
            message: "Give both frame width and frame height, or leave both out.",
            path: ["frameWidthIn"],
          });
        }
        if (data.status === "sold" && data.featured) {
          ctx.addIssue({
            code: "custom",
            message: "A sold work should not stay featured on the home page. Set featured to false.",
            path: ["featured"],
          });
        }
      }),
});

const artists = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artists" }),
  schema: z.object({
    name: z.string().min(1),
    sortName: z.string().min(1),
    lifeDates: z.string().min(1),
    birthDate: dateField.optional(),
    deathDate: dateField.optional(),
    birthPlace: z.string().optional(),
    region: z.enum(["Indiana", "Texas", "Midwest", "Other"]),
    epithet: z.string().optional(),
    summary: z.string().min(40),
    sources: z
      .array(
        z.object({
          title: z.string(),
          publisher: z.string().optional(),
          author: z.string().optional(),
          date: z.string().optional(),
          url: z.string().url(),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, artists };
