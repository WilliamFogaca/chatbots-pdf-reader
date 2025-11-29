import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { chatbots } from "./chatbots.ts";

export const chatbotQuestions = pgTable("chatbot_questions", {
  id: uuid().primaryKey().defaultRandom(),
  chatbotId: uuid()
    .references(() => chatbots.id, { onDelete: "cascade" })
    .notNull(),
  question: text().notNull(),
  answer: text(),
  createdAt: timestamp().notNull().defaultNow(),
});
