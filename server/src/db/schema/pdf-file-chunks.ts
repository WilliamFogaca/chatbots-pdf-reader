import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { chatbotPDFFiles } from "./chatbot-pdf-files.ts";

export const pdfFileChunks = pgTable(
  "pdf_file_chunks",
  {
    id: uuid().primaryKey().defaultRandom(),
    pdfFileId: uuid()
      .references(() => chatbotPDFFiles.id, { onDelete: "cascade" })
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
