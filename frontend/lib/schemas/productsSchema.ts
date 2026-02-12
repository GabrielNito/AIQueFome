import { z } from "zod";

export const createProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "O nome deve ter pelo menos 1 caractere")
      .max(100, "O nome deve ter no máximo 100 caracteres")
      .trim(),
    description: z
      .string()
      .max(500, "A descrição deve ter no máximo 500 caracteres")
      .optional()
      .nullable(),
    price: z.number().positive("O preço deve ser um valor positivo"),
    salePrice: z
      .number()
      .positive("O preço de desconto deve ser um valor positivo")
      .optional()
      .nullable(),
    categoryId: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    isAvailable: z.boolean().default(true),
    ingredients: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Cada ingrediente deve ter pelo menos 1 caractere")
      )
      .nullable()
      .optional(),
    serving: z
      .number()
      .int("O número de porções deve ser um número inteiro")
      .positive("O número de porções deve ser positivo")
      .optional()
      .nullable(),
    tags: z.array(z.string()).default([]),
    nutritionalInfo: z.record(z.string(), z.string()).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.salePrice && data.salePrice >= data.price) {
        return false;
      }
      return true;
    },
    {
      message: "O preço de desconto deve ser menor que o preço normal",
      path: ["salePrice"],
    }
  );

export const updateProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "O nome deve ter pelo menos 1 caractere")
      .max(100, "O nome deve ter no máximo 100 caracteres")
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, "A descrição deve ter no máximo 500 caracteres")
      .optional()
      .nullable(),
    price: z
      .number()
      .positive("O preço deve ser um valor positivo")
      .finite("O preço deve ser um número válido")
      .optional(),
    salePrice: z
      .number()
      .positive("O preço de desconto deve ser um valor positivo")
      .finite("O preço de desconto deve ser um número válido")
      .optional()
      .nullable(),
    categoryId: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    isAvailable: z.boolean().optional(),
    ingredients: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Cada ingrediente deve ter pelo menos 1 caractere")
      )
      .optional()
      .nullable(),
    serving: z
      .number()
      .int("O número de porções deve ser um número inteiro")
      .positive("O número de porções deve ser positivo")
      .optional()
      .nullable(),
    tags: z
      .array(
        z.string().trim().min(1, "Cada tag deve ter pelo menos 1 caractere")
      )
      .optional(),
    nutritionalInfo: z.record(z.any(), z.any()).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.salePrice && data.price && data.salePrice >= data.price) {
        return false;
      }
      return true;
    },
    {
      message: "O preço de desconto deve ser menor que o preço normal",
      path: ["salePrice"],
    }
  );

export type UpdateProductDto = z.infer<typeof updateProductSchema>;

export type CreateProductDto = z.input<typeof createProductSchema>;
