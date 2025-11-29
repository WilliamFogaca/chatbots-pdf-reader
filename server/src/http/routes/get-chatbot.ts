import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";

export const getChatbotRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/chatbots/:chatbotId",
    {
      schema: {
        params: z.object({
          chatbotId: z.uuid(),
        }),
      },
    },
    async (request) => {
      const { chatbotId } = request.params;

      const chatbotRepository = getChatbotRepository();

      const chatbot = await chatbotRepository.findById(chatbotId);

      return { chatbot };
    }
  );
};
