import { z } from "zod";

export const updateComboSchema = z
  .object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().optional(),
    categoryId: z.string().optional(),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    activeFrom: z.coerce.date().optional(),
    activeUntil: z.coerce.date().optional(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          quantity: z.number().int().positive().default(1),
        }),
      )
      .optional(),
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
  )
  .refine(
    (data) => {
      if (
        data.originalPrice &&
        data.price &&
        data.price >= data.originalPrice
      ) {
        return false;
      }
      return true;
    },
    {
      message: "O preço do combo deve ser menor que o preço original total",
      path: ["price"],
    },
  );

export type UpdateComboDto = z.infer<typeof updateComboSchema>;
