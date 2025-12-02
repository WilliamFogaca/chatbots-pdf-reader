import { count, desc, eq } from "drizzle-orm";
import type {
  ChatbotRepository,
  CreateChatbotParams,
  CreateChatbotResult,
  FindChatbotByIdParams,
  FindChatbotByIdResult,
  FindManyChatbotsParams,
  FindManyChatbotsResult,
} from "@/domain/repositories/chatbot-repository.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

export class DrizzleChatbotRepository implements ChatbotRepository {
  async findManyWithPagination(
    params: FindManyChatbotsParams
  ): Promise<FindManyChatbotsResult> {
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

  async findById({
    chatbotId,
  }: FindChatbotByIdParams): Promise<FindChatbotByIdResult> {
    const result = await db
      .select({
        id: schema.chatbots.id,
        title: schema.chatbots.title,
        description: schema.chatbots.description,
        createdAt: schema.chatbots.createdAt,
        pdfCount: count(schema.chatbotPDFFiles.id),
      })
      .from(schema.chatbots)
      .where(eq(schema.chatbots.id, chatbotId))
      .leftJoin(
        schema.chatbotPDFFiles,
        eq(schema.chatbots.id, schema.chatbotPDFFiles.chatbotId)
      )
      .groupBy(schema.chatbots.id)
      .orderBy(desc(schema.chatbots.createdAt));

    const chatbot = result[0];

    if (!chatbot) {
      return null;
    }

    const { pdfCount, ...chatbotData } = chatbot;

    return {
      ...chatbotData,
      hasPDF: pdfCount > 0,
    };
  }

  async create({
    title,
    description,
  }: CreateChatbotParams): Promise<CreateChatbotResult> {
    const result = await db
      .insert(schema.chatbots)
      .values({
        title,
        description,
      })
      .returning();

    return result[0];
  }
}
