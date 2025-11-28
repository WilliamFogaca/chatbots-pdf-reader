import { z } from "zod";

export const envSchema = z.object({
  // HTTP
  PORT: z.coerce.number().default(3333),

  // Database
  DATABASE_URL: z.url().startsWith("postgresql://"),

  // Ollama AI Service
  EMBEDDINGS_MODEL: z.string(),
  TRANSLATION_MODEL: z.string(),
  ANSWER_QUESTION_MODEL: z.string(),
});

export const env = envSchema.parse(process.env);
