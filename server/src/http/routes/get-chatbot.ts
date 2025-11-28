import { count, desc, eq, gt } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "@/db/connection.ts";
import { schema } from "@/db/schema/index.ts";

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

      const chatbot = await db
        .select({
          id: schema.chatbots.id,
          title: schema.chatbots.title,
          description: schema.chatbots.description,
          createdAt: schema.chatbots.createdAt,
          questionCount: count(schema.chatbotQuestions.id),
          hasPDF: gt(count(schema.pdfFiles.id), 0),
        })
        .from(schema.chatbots)
        .where(eq(schema.chatbots.id, chatbotId))
        .leftJoin(
          schema.chatbotQuestions,
          eq(schema.chatbots.id, schema.chatbotQuestions.chatbotId)
        )
        .leftJoin(
          schema.pdfFiles,
          eq(schema.chatbots.id, schema.pdfFiles.chatbotId)
        )
        .groupBy(schema.chatbots.id)
        .orderBy(desc(schema.chatbots.createdAt));

      return {
        chatbot: chatbot[0] || null,
      };
    }
  );
};
