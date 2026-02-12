import { z } from "zod";

export const createComboSchema = z
  .object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.number().positive(),
    originalPrice: z.number().optional(),
    categoryId: z.string().optional(),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    activeFrom: z.coerce.date().optional(),
    activeUntil: z.coerce.date().optional(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          quantity: z.number().int().positive().default(1),
        }),
      )
      .min(1, "O combo deve ter pelo menos um produto"),
  })
  .refine(
    (data) => {
      if (data.activeFrom && data.activeUntil) {
        return data.activeUntil > data.activeFrom;
      }
      return true;
    },
    {
      message: "A data de término deve ser posterior à data de início",
      path: ["activeUntil"],
    },
  );

export type CreateComboDto = z.infer<typeof createComboSchema>;
