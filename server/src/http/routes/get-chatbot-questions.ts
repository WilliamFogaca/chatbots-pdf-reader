import { count, desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getChatbotQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots/:chatbotId/questions",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().optional().default(1),
        }),
        params: z.object({
          chatbotId: z.string(),
        }),
      },
    },
    async (request) => {
      const { chatbotId } = request.params;
      const { page } = request.query;

      const itemsPerPage = 10;

      const questionsPromise = db
        .select({
          id: schema.chatbotQuestions.id,
          question: schema.chatbotQuestions.question,
          answer: schema.chatbotQuestions.answer,
          createdAt: schema.chatbotQuestions.createdAt,
        })
        .from(schema.chatbotQuestions)
        .where(eq(schema.chatbotQuestions.chatbotId, chatbotId))
        .orderBy(desc(schema.chatbotQuestions.createdAt))
        .limit(itemsPerPage)
        .offset((page - 1) * itemsPerPage);

      const countPromise = db
        .select({ count: count() })
        .from(schema.chatbotQuestions)
        .where(eq(schema.chatbotQuestions.chatbotId, chatbotId));

      const [questions, [totalCountResult]] = await Promise.all([
        questionsPromise,
        countPromise,
      ]);

      const totalItems = totalCountResult?.count || 0;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return {
        questions,
        pagination: {
          page,
          itemsPerPage,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
        },
      };
    }
  );
};
