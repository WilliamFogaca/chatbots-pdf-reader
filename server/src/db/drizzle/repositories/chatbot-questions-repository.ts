import { count, desc, eq } from "drizzle-orm";
import { FailedToCreateResourceError } from "@/domain/errors/failed-to-create-resource-error.ts";
import type {
  ChatbotQuestionsRepository,
  CreateChatbotQuestionParams,
  CreateChatbotQuestionResult,
  FindManyChatbotQuestionsWithPaginationResult,
  GetChatbotQuestionsWithPaginationParams,
} from "@/domain/repositories/chatbot-questions-repository.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

export class DrizzleChatbotQuestionsRepository
  implements ChatbotQuestionsRepository
{
  async findManyWithPagination({
    chatbotId,
    page,
    itemsPerPage,
  }: GetChatbotQuestionsWithPaginationParams): Promise<FindManyChatbotQuestionsWithPaginationResult> {
    const questionsPromise = db
      .select({
        id: schema.chatbotQuestions.id,
        chatbotId: schema.chatbotQuestions.chatbotId,
        question: schema.chatbotQuestions.question,
        answer: schema.chatbotQuestions.answer,
        createdAt: schema.chatbotQuestions.createdAt,
      })
      .from(schema.chatbotQuestions)
      .where(eq(schema.chatbotQuestions.chatbotId, chatbotId))
      .orderBy(desc(schema.chatbotQuestions.createdAt))
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage);

    const countPromise = db
      .select({ count: count() })
      .from(schema.chatbotQuestions)
      .where(eq(schema.chatbotQuestions.chatbotId, chatbotId));

    const [questions, [totalCountResult]] = await Promise.all([
      questionsPromise,
      countPromise,
    ]);

    const totalItems = totalCountResult?.count || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: questions,
      pagination: {
        page,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async create({
    question,
    answer,
    chatbotId,
  }: CreateChatbotQuestionParams): Promise<CreateChatbotQuestionResult> {
    const result = await db
      .insert(schema.chatbotQuestions)
      .values({
        question,
        answer,
        chatbotId,
      })
      .returning();

    const insertedChatbotQuestion = result[0];

    if (!insertedChatbotQuestion) {
      throw new FailedToCreateResourceError("pergunta do chatbot");
    }

    return insertedChatbotQuestion;
  }
}
