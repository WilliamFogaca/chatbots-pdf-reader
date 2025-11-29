import { randomUUID } from "node:crypto";
import { reset, seed } from "drizzle-seed";
import { db, sql } from "./connection.ts";
import { chatbotQuestions } from "./schema/chatbot-questions.ts";
import { chatbots } from "./schema/chatbots.ts";

const seedSchema = {
  chatbots,
  chatbotQuestions,
};

await reset(db, seedSchema);

await seed(db, seedSchema).refine((f) => ({
  chatbots: {
    count: 35,
    columns: {
      id: f.valuesFromArray({ values: [randomUUID()] }),
      title: f.companyName(),
      description: f.loremIpsum(),
      createdAt: f.date({
        minDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
        maxDate: new Date().toISOString(),
      }),
    },
    with: {
      chatbotQuestions: 3,
    },
  },
}));

await sql.end();

console.log("Database seeded successfully.");
