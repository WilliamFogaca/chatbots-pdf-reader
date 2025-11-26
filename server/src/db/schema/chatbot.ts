import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chatbot = pgTable("chatbot", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp().notNull().defaultNow(),
});
