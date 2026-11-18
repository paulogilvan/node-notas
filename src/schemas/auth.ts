import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(4),
});

export const loginBodySchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(4),
});
