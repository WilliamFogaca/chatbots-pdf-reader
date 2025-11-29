import type { Chatbot, ChatbotWithStats } from "@/domain/entities/chatbot.ts";
import type {
  PaginatedResult,
  PaginationParams,
} from "../core/pagination-params.ts";

export type ChatbotRepository = {
  findManyWithPagination(
    params: PaginationParams
  ): Promise<PaginatedResult<ChatbotWithStats>>;

  findById(chatbotId: string): Promise<Chatbot | null>;
};
