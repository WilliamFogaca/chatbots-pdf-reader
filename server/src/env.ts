import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  EMBEDDINGS_MODEL: z.string(),
  TRANSLATION_MODEL: z.string(),
  ANSWER_QUESTION_MODEL: z.string(),
});

export const env = envSchema.parse(process.env);
