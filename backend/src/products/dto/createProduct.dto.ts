import { z } from "zod";

export const createProductSchema = z
  .object({
    name: z
      .string({
        required_error: "O nome é obrigatório",
        invalid_type_error: "O nome deve ser uma string",
      })
      .min(1, "O nome deve ter pelo menos 1 caractere")
      .max(100, "O nome deve ter no máximo 100 caracteres")
      .trim(),
    description: z
      .string({
        invalid_type_error: "A descrição deve ser uma string",
      })
      .max(500, "A descrição deve ter no máximo 500 caracteres")
      .optional()
      .nullable(),
    price: z
      .number({
        required_error: "O preço é obrigatório",
        invalid_type_error: "O preço deve ser um número",
      })
      .positive("O preço deve ser um valor positivo")
      .finite("O preço deve ser um número válido"),
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
      .url("A URL da imagem deve ser válida")
      .optional()
      .nullable(),
    isAvailable: z
      .boolean({
        invalid_type_error: "A disponibilidade deve ser um booleano",
      })
      .default(true),
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
      .default([]),
    nutritionalInfo: z.record(z.any()).optional().nullable(),
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
    },
  );

export type CreateProductDto = z.infer<typeof createProductSchema>;
