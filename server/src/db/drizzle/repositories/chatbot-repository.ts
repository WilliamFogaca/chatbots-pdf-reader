import { count, desc, eq, gt } from "drizzle-orm";
import type {
  PaginatedResult,
  PaginationParams,
} from "@/domain/core/pagination-params.ts";
import type { Chatbot, ChatbotWithStats } from "@/domain/entities/chatbot.ts";
import type { ChatbotRepository } from "@/domain/repositories/chatbot-repository.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

export class DrizzleChatbotRepository implements ChatbotRepository {
  async findManyWithPagination(
    params: PaginationParams
  ): Promise<PaginatedResult<ChatbotWithStats>> {
    const { page, itemsPerPage } = params;

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
      data: chatbots,
      pagination: {
        page,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findById(chatbotId: string): Promise<Chatbot | null> {
    const chatbot = await db
      .select({
        id: schema.chatbots.id,
        title: schema.chatbots.title,
        description: schema.chatbots.description,
        createdAt: schema.chatbots.createdAt,
        questionCount: count(schema.chatbotQuestions.id),
        hasPDF: gt(count(schema.chatbotPDFFiles.id), 0),
      })
      .from(schema.chatbots)
      .where(eq(schema.chatbots.id, chatbotId))
      .leftJoin(
        schema.chatbotQuestions,
        eq(schema.chatbots.id, schema.chatbotQuestions.chatbotId)
      )
      .leftJoin(
        schema.chatbotPDFFiles,
        eq(schema.chatbots.id, schema.chatbotPDFFiles.chatbotId)
      )
      .groupBy(schema.chatbots.id)
      .orderBy(desc(schema.chatbots.createdAt));

    return chatbot[0] || null;
  }
}
