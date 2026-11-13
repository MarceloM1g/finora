import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome muito longo"),

  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(254, "E-mail muito longo")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
});
