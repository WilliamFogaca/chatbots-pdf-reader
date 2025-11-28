import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { chatbots } from "./chatbots.ts";

export const chatbotPDFFiles = pgTable("chatbot_pdf_files", {
  id: uuid().primaryKey().defaultRandom(),
  chatbotId: uuid()
    .references(() => chatbots.id, { onDelete: "cascade" })
    .notNull(),
  fileName: text().notNull(),
  mimeType: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});
