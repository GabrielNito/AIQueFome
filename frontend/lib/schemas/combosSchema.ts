import z from "zod";

export const createComboSchema = z.object({
  name: z.string().min(1).max(50).trim(),

  description: z.string().max(200).optional().nullable(),

  price: z.number().positive(),

  originalPrice: z.number().positive().optional(),

  categoryId: z.string(),

  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),

  imageUrl: z.string().optional(),

  isAvailable: z.boolean(),
  isFeatured: z.boolean(),

  activeFrom: z.string().optional(),
  activeUntil: z.string().optional(),

  tags: z.array(z.string()),
});

export type CreateComboDto = z.infer<typeof createComboSchema>;

export const updateComboSchema = createComboSchema.partial();
export type UpdateComboDto = z.infer<typeof updateComboSchema>;
