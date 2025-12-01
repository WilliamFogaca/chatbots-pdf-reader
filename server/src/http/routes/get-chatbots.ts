import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";

export const getChatbotsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots",
    {
      schema: {
        tags: ["chatbots"],
        description: "Listar chatbots com paginação",
        querystring: z.object({
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            chatbots: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string().nullable(),
                createdAt: z.date(),
                questionCount: z.number(),
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
