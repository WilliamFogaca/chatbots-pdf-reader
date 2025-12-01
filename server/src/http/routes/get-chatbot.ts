import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";

export const getChatbotRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots/:chatbotId",
    {
      schema: {
        tags: ["chatbots"],
        description: "Buscar um chatbot por ID",
        params: z.object({
          chatbotId: z.uuid(),
        }),
        response: {
          200: z.object({
            chatbot: z
              .object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string().nullable(),
                createdAt: z.date(),
              })
              .nullable(),
          }),
        },
      },
    },
    async (request) => {
      const { chatbotId } = request.params;

      const chatbotRepository = getChatbotRepository();

      const chatbot = await chatbotRepository.findById({ chatbotId });

      return { chatbot };
    }
  );
};
