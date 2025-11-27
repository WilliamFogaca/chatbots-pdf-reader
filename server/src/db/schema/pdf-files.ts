import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { chatbots } from "./chatbots.ts";

export const pdfFiles = pgTable(
  "pdf_files",
  {
    id: uuid().primaryKey().defaultRandom(),
    chatbotId: uuid()
      .references(() => chatbots.id)
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
