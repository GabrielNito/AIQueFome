import { z } from "zod";

export const RoleEnum = z.enum(["CLIENT", "ADMIN", "STAFF"], {
  invalid_type_error: "O papel (role) deve ser CLIENT, ADMIN ou STAFF",
});

export const updateUserSchema = z.object({
  email: z
    .string({
      invalid_type_error: "O email deve ser uma string",
    })
    .email("O email deve ser um endereço de email válido")
    .optional(),

  password: z
    .string({
      invalid_type_error: "A senha deve ser uma string",
    })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .optional(),

  name: z
    .string({
      invalid_type_error: "O nome deve ser uma string",
    })
    .min(1, "O nome deve ter pelo menos 1 caractere")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .trim()
    .optional()
    .nullable(),

  role: RoleEnum.optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
