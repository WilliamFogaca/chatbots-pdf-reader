import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { chatbot } from "./chatbot.ts";

export const pdfChunks = pgTable(
  "pdf_chunks",
  {
    id: uuid().primaryKey().defaultRandom(),
    chatbotId: uuid()
      .references(() => chatbot.id)
      .notNull(),
    content: text().notNull(),
    embeddings: vector({ dimensions: 768 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embeddings.op("vector_cosine_ops")
    ),
  ]
);
