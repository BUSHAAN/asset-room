import { z } from "zod";

export const resourceSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  url: z.string().url("Invalid URL"),
  description: z.string().min(5, "Description is too short"),
  tags: z.array(z.string()).optional(),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
