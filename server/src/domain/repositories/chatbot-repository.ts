import type { Chatbot, ChatbotWithStats } from "@/domain/entities/chatbot.ts";
import type {
  PaginatedResult,
  PaginationParams,
} from "../core/pagination-params.ts";

export type FindManyChatbotsParams = PaginationParams;

export type FindManyChatbotsResult = PaginatedResult<ChatbotWithStats>;

export type FindChatbotByIdParams = {
  chatbotId: string;
};

export type FindChatbotByIdResult = Chatbot | null;

export type CreateChatbotParams = {
  title: string;
  description?: string;
};

export type CreateChatbotResult = Chatbot;

export type ChatbotRepository = {
  findManyWithPagination(
    params: FindManyChatbotsParams
  ): Promise<FindManyChatbotsResult>;

  findById(params: FindChatbotByIdParams): Promise<FindChatbotByIdResult>;

  create(params: CreateChatbotParams): Promise<CreateChatbotResult>;
};
