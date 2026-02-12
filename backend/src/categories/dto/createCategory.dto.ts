import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório",
      invalid_type_error: "O nome deve ser uma string",
    })
    .min(1, "O nome deve ter pelo menos 1 caractere")
    .max(50, "O nome deve ter no máximo 50 caracteres")
    .trim(),
  description: z
    .string({
      invalid_type_error: "A descrição deve ser uma string",
    })
    .max(200, "A descrição deve ter no máximo 200 caracteres")
    .optional()
    .nullable(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
