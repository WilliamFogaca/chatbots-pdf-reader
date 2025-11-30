import type { Chatbot } from "@/types/chatbot";
import type { PaginationParams } from "@/types/pagination";

export type GetChatbotsResponse = {
  chatbots: Chatbot[];
  pagination: PaginationParams;
};
