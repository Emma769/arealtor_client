import { z } from "zod";

export const loginParamSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty({ message: "Cannot be blank" }),
});

export type LoginParam = z.infer<typeof loginParamSchema>;
