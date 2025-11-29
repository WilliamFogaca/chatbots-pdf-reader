import type { Chatbot, ChatbotWithStats } from "@/domain/entities/chatbot.ts";
import type {
  PaginatedResult,
  PaginationParams,
} from "../core/pagination-params.ts";

export type CreateChatbotParams = {
  title: string;
  description?: string;
};

export type ChatbotRepository = {
  findManyWithPagination(
    params: PaginationParams
  ): Promise<PaginatedResult<ChatbotWithStats>>;

  findById(chatbotId: string): Promise<Chatbot | null>;

  create(params: CreateChatbotParams): Promise<Chatbot>;
};
