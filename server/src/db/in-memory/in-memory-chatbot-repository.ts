import { randomUUID } from "node:crypto";
import type { Chatbot, ChatbotWithStats } from "@/domain/entities/chatbot.ts";
import type {
  ChatbotRepository,
  CreateChatbotParams,
  CreateChatbotResult,
  FindChatbotByIdParams,
  FindChatbotByIdResult,
  FindManyChatbotsParams,
  FindManyChatbotsResult,
} from "@/domain/repositories/chatbot-repository.ts";

export class InMemoryChatbotRepository implements ChatbotRepository {
  private chatbots: Chatbot[] = [];

  findManyWithPagination(
    params: FindManyChatbotsParams
  ): Promise<FindManyChatbotsResult> {
    const { page, itemsPerPage } = params;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedChatbots = this.chatbots.slice(startIndex, endIndex);

    const chatbotsWithStats: ChatbotWithStats[] = paginatedChatbots.map(
      (chatbot) => ({
        ...chatbot,
        questionCount: 0,
      })
    );

    const totalItems = this.chatbots.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return Promise.resolve({
      data: chatbotsWithStats,
      pagination: {
        page,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  }

  findById(params: FindChatbotByIdParams): Promise<FindChatbotByIdResult> {
    const chatbot = this.chatbots.find((c) => c.id === params.chatbotId);
    return Promise.resolve(chatbot ?? null);
  }

  create(params: CreateChatbotParams): Promise<CreateChatbotResult> {
    const chatbot: Chatbot = {
      id: randomUUID(),
      title: params.title,
      description: params.description ?? null,
      createdAt: new Date(),
    };

    this.chatbots.push(chatbot);
    return Promise.resolve(chatbot);
  }

  clear(): void {
    this.chatbots = [];
  }

  getAll(): Chatbot[] {
    return [...this.chatbots];
  }
}
