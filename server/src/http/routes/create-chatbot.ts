import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";

export const createChatbotRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/chatbots",
    {
      schema: {
        body: z.object({
          title: z.string().min(3),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { title, description } = request.body;

      const chatbotRepository = getChatbotRepository();

      const result = await chatbotRepository.create({ title, description });

      return reply.status(201).send({ chatbotId: result.id });
    }
  );
};
