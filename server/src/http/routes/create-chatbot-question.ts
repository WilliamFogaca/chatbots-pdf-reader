import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { generateEmbeddings } from "../../services/ollama.ts";

export const createChatbotQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/chatbots/:chatbotId/questions",
    {
      schema: {
        params: z.object({
          chatbotId: z.uuid(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { question } = request.body;
      const { chatbotId } = request.params;

      const questionEmbeddings = await generateEmbeddings(question);
      const chunkSimilarity = sql<number>`1 - (${cosineDistance(schema.pdfFileChunks.embeddings, questionEmbeddings)})`;

      const chunks = await db
        .select({
          id: schema.pdfFileChunks.id,
          content: schema.pdfFileChunks.content,
          similarity: chunkSimilarity,
        })
        .from(schema.pdfFileChunks)
        .innerJoin(
          schema.chatbotPDFFiles,
          eq(schema.chatbotPDFFiles.id, schema.pdfFileChunks.pdfFileId)
        )
        .where(
          and(
            eq(schema.chatbotPDFFiles.chatbotId, chatbotId),
            gt(chunkSimilarity, 0.7)
          )
        )
        .orderBy((table) => desc(table.similarity))
        .limit(3);

      console.log("Similar chunks found:", chunks);

      const result = await db
        .insert(schema.chatbotQuestions)
        .values({
          question,
          answer: null,
          chatbotId,
        })
        .returning();

      const insertedQuestion = result[0];

      if (!insertedQuestion) {
        throw new Error("Erro ao criar a pergunta");
      }

      return reply.status(201).send({
        questionId: insertedQuestion.id,
        answer: null,
      });
    }
  );
};
