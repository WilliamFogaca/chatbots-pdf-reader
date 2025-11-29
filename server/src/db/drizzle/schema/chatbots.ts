import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chatbots = pgTable("chatbots", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp().notNull().defaultNow(),
});
