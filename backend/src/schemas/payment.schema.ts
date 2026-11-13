import { z } from "zod";

export const CreatePaymentSchema = z.object({
  clientId: z.string().uuid(),
  serviceIds: z.array(z.string().uuid()).min(1),
  price: z.number().positive(),
  date: z.iso.date(),
  time: z
    .union([z.iso.time(), z.literal("")])
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  description: z.string().optional(),
});

export const UpdatePaymentSchema = CreatePaymentSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Informe pelo menos um campo para atualizar",
  },
);
