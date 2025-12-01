import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotQuestionsRepository } from "@/db/factories/repositories-factory.ts";

export const getChatbotQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots/:chatbotId/questions",
    {
      schema: {
        tags: ["questions"],
        description: "Listar perguntas de um chatbot com paginação",
        querystring: z.object({
          page: z.coerce.number().optional().default(1),
        }),
        params: z.object({
          chatbotId: z.string(),
        }),
        response: {
          200: z.object({
            questions: z.array(
              z.object({
                id: z.string().uuid(),
                chatbotId: z.string().uuid(),
                question: z.string(),
                answer: z.string().nullable(),
                createdAt: z.date(),
              })
            ),
            pagination: z.object({
              page: z.number(),
              itemsPerPage: z.number(),
              totalItems: z.number(),
              totalPages: z.number(),
              hasNextPage: z.boolean(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { chatbotId } = request.params;
      const { page } = request.query;

      const itemsPerPage = 10;

      const chatbotQuestionsRepository = getChatbotQuestionsRepository();

      const result = await chatbotQuestionsRepository.findManyWithPagination({
        chatbotId,
        page,
        itemsPerPage,
      });

      return {
        questions: result.data,
        pagination: result.pagination,
      };
    }
  );
};
