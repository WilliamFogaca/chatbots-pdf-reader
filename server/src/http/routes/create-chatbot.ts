import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "@/db/connection.ts";
import { schema } from "@/db/schema/index.ts";
import { FailedToCreateResourceError } from "./errors/failed-to-create-resource-error.ts";

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

      const result = await db
        .insert(schema.chatbots)
        .values({
          title,
          description,
        })
        .returning();

      const insertedChatbot = result[0];

      if (!insertedChatbot) {
        throw new FailedToCreateResourceError("chatbot");
      }

      return reply.status(201).send({ chatbotId: insertedChatbot.id });
    }
  );
};
