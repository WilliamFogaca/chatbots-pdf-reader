import { count, desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "@/db/connection.ts";
import { schema } from "@/db/schema/index.ts";

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

      const chatbotsPromise = db
        .select({
          id: schema.chatbots.id,
          title: schema.chatbots.title,
          description: schema.chatbots.description,
          createdAt: schema.chatbots.createdAt,
          questionCount: count(schema.chatbotQuestions.id),
        })
        .from(schema.chatbots)
        .leftJoin(
          schema.chatbotQuestions,
          eq(schema.chatbots.id, schema.chatbotQuestions.chatbotId)
        )
        .groupBy(schema.chatbots.id)
        .limit(itemsPerPage)
        .offset((page - 1) * itemsPerPage)
        .orderBy(desc(schema.chatbots.createdAt));

      const countPromise = db.select({ count: count() }).from(schema.chatbots);

      const [chatbots, [totalCountResult]] = await Promise.all([
        chatbotsPromise,
        countPromise,
      ]);

      const totalItems = totalCountResult?.count || 0;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return {
        chatbots,
        pagination: {
          page,
          itemsPerPage,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
        },
      };
    }
  );
};
