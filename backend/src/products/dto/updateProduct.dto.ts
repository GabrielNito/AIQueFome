import { z } from "zod";

export const updateProductSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: "O nome deve ser uma string",
      })
      .min(1, "O nome deve ter pelo menos 1 caractere")
      .max(100, "O nome deve ter no máximo 100 caracteres")
      .trim()
      .optional(),
    description: z
      .string({
        invalid_type_error: "A descrição deve ser uma string",
      })
      .max(500, "A descrição deve ter no máximo 500 caracteres")
      .optional()
      .nullable(),
    price: z
      .number({
        invalid_type_error: "O preço deve ser um número",
      })
      .positive("O preço deve ser um valor positivo")
      .finite("O preço deve ser um número válido")
      .optional(),
    salePrice: z
      .number({
        invalid_type_error: "O preço de desconto deve ser um número",
      })
      .positive("O preço de desconto deve ser um valor positivo")
      .finite("O preço de desconto deve ser um número válido")
      .optional()
      .nullable(),
    categoryId: z
      .string({
        invalid_type_error: "O ID da categoria deve ser uma string",
      })
      .optional()
      .nullable(),
    imageUrl: z
      .string({
        invalid_type_error: "A URL da imagem deve ser uma string",
      })
      .optional()
      .nullable(),
    isAvailable: z
      .boolean({
        invalid_type_error: "A disponibilidade deve ser um booleano",
      })
      .optional(),
    ingredients: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Cada ingrediente deve ter pelo menos 1 caractere"),
      )
      .optional()
      .nullable(),
    serving: z
      .number({
        invalid_type_error: "O número de porções deve ser um número",
      })
      .int("O número de porções deve ser um número inteiro")
      .positive("O número de porções deve ser positivo")
      .optional()
      .nullable(),
    tags: z
      .array(
        z.string().trim().min(1, "Cada tag deve ter pelo menos 1 caractere"),
      )
      .optional(),
    nutritionalInfo: z.record(z.any()).optional().nullable(),
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
    },
  );

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
