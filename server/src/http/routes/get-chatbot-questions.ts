import { desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getChatbotQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots/:chatbotId/questions",
    {
      schema: {
        params: z.object({
          chatbotId: z.string(),
        }),
      },
    },
    async (request) => {
      const { chatbotId } = request.params;

      const questions = await db
        .select({
          id: schema.chatbotQuestions.id,
          question: schema.chatbotQuestions.question,
          answer: schema.chatbotQuestions.answer,
          createdAt: schema.chatbotQuestions.createdAt,
        })
        .from(schema.chatbotQuestions)
        .where(eq(schema.chatbotQuestions.chatbotId, chatbotId))
        .orderBy(desc(schema.chatbotQuestions.createdAt));

      return { questions };
    }
  );
};
