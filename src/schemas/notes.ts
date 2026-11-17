import { z } from "zod";

export const idParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createNoteBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const updateNoteBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "Informe ao menos title ou content",
  });

export const listNotesQuerySchema = z.object({});
