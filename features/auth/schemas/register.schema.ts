import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(8, "Name must be at least 8 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
