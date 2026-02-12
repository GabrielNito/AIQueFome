import { z } from "zod";

export const queryProductSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().positive().max(100).default(10)),
  categoryId: z.string().optional(),
  isAvailable: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true"))
    .pipe(z.boolean().optional()),
  search: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(",").map((tag) => tag.trim()) : undefined,
    )
    .pipe(z.array(z.string()).optional()),
  onSale: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val === "true"))
    .pipe(z.boolean().optional()),
});

export type QueryProductDto = z.infer<typeof queryProductSchema>;
