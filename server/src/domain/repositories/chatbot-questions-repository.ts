import type {
  PaginatedResult,
  PaginationParams,
} from "../core/pagination-params.ts";
import type { ChatbotQuestion } from "../entities/chatbot-question.ts";

export type GetChatbotQuestionsWithPaginationParams = PaginationParams & {
  chatbotId: string;
};

export type FindManyChatbotQuestionsWithPaginationResult =
  PaginatedResult<ChatbotQuestion>;

export type CreateChatbotQuestionParams = {
  question: string;
  answer: string | null;
  chatbotId: string;
};

export type CreateChatbotQuestionResult = ChatbotQuestion;

export type ChatbotQuestionsRepository = {
  findManyWithPagination(
    params: GetChatbotQuestionsWithPaginationParams
  ): Promise<FindManyChatbotQuestionsWithPaginationResult>;

  create(
    params: CreateChatbotQuestionParams
  ): Promise<CreateChatbotQuestionResult>;
};
