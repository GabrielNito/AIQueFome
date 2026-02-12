import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "O e-mail é obrigatório",
      invalid_type_error: "O e-mail deve ser uma string",
    })
    .email("E-mail inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: "A senha é obrigatória",
      invalid_type_error: "A senha deve ser uma string",
    })
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  name: z
    .string({
      invalid_type_error: "O nome deve ser uma string",
    })
    .optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
