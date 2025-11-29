import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "@/db/drizzle/connection.ts";
import { schema } from "@/db/drizzle/schema/index.ts";
import {
  generateAnswer,
  generateEmbeddings,
  translateContentToEnglish,
} from "../../services/ai-provider.ts";

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

      const questionInEnglish = await translateContentToEnglish(question);

      const questionEmbeddings = await generateEmbeddings(questionInEnglish);
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
            gt(chunkSimilarity, 0.25)
          )
        )
        .orderBy((table) => desc(table.similarity))
        .limit(5);

      let answer: string | null = null;

      if (chunks.length > 0) {
        const contents = chunks.map((chunk) => chunk.content);
        answer = await generateAnswer(questionInEnglish, contents);
      }

      const result = await db
        .insert(schema.chatbotQuestions)
        .values({
          question,
          answer,
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
