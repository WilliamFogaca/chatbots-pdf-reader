import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  getChatbotQuestionsRepository,
  getPDFFileChunksRepository,
} from "@/db/factories/repositories-factory.ts";
import { FailedToCreateResourceError } from "@/domain/errors/failed-to-create-resource-error.ts";
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
        tags: ["questions"],
        description:
          "Criar uma nova pergunta e obter resposta do chatbot baseada nos PDFs",
        params: z.object({
          chatbotId: z.uuid(),
        }),
        body: z.object({
          question: z.string().min(10),
        }),
        response: {
          201: z.object({
            questionId: z.uuid(),
            answer: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { question } = request.body;
      const { chatbotId } = request.params;

      const questionInEnglish = await translateContentToEnglish(question);

      const questionEmbeddings = await generateEmbeddings(questionInEnglish);

      const pdfFileChunks = getPDFFileChunksRepository();

      const chunks = await pdfFileChunks.findManyWithSimilarity({
        chatbotId,
        embeddings: questionEmbeddings,
      });

      let answer: string | null = null;

      if (chunks.length > 0) {
        const contents = chunks.map((chunk) => chunk.content);
        answer = await generateAnswer(questionInEnglish, contents);
      }

      const chatbotQuestionRepository = getChatbotQuestionsRepository();

      const insertedChatbotQuestion = await chatbotQuestionRepository.create({
        chatbotId,
        question,
        answer,
      });

      if (!insertedChatbotQuestion) {
        throw new FailedToCreateResourceError("pergunta do chatbot");
      }

      return reply.status(201).send({
        questionId: insertedChatbotQuestion.id,
        answer,
      });
    }
  );
};
