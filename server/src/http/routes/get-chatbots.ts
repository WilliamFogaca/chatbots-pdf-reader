import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotRepository } from "@/db/factories/chatbot-repository-factory.ts";

export const getChatbotsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().optional().default(1),
        }),
      },
    },
    async (request) => {
      const { page } = request.query;

      const itemsPerPage = 10;

      const chatbotRepository = getChatbotRepository();

      const result = await chatbotRepository.findManyWithPagination({
        page,
        itemsPerPage,
      });

      return {
        chatbots: result.data,
        pagination: result.pagination,
      };
    }
  );
};
