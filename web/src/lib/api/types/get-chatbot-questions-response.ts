import type { ChatbotQuestion } from "@/types/chatbot-questions";
import type { PaginationParams } from "@/types/pagination";

export type GetChatbotQuestionsResponse = {
  questions: ChatbotQuestion[];
  pagination: PaginationParams;
};
