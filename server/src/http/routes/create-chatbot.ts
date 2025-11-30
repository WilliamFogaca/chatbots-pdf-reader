import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";
import { FailedToCreateResourceError } from "@/domain/errors/failed-to-create-resource-error.ts";

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

      const insertedChatbot = await chatbotRepository.create({
        title,
        description,
      });

      if (!insertedChatbot) {
        throw new FailedToCreateResourceError("chatbot");
      }

      return reply.status(201).send({ chatbotId: insertedChatbot.id });
    }
  );
};
