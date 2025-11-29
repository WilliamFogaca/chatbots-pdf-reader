import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotQuestionsRepository } from "@/db/factories/repositories-factory.ts";

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
