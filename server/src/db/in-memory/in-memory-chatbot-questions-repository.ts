import { randomUUID } from "node:crypto";
import type { ChatbotQuestion } from "@/domain/entities/chatbot-question.ts";
import type {
  ChatbotQuestionsRepository,
  CreateChatbotQuestionParams,
  CreateChatbotQuestionResult,
  FindManyChatbotQuestionsWithPaginationResult,
  GetChatbotQuestionsWithPaginationParams,
} from "@/domain/repositories/chatbot-questions-repository.ts";

export class InMemoryChatbotQuestionsRepository
  implements ChatbotQuestionsRepository
{
  private questions: ChatbotQuestion[] = [];

  findManyWithPagination(
    params: GetChatbotQuestionsWithPaginationParams
  ): Promise<FindManyChatbotQuestionsWithPaginationResult> {
    const { chatbotId, page, itemsPerPage } = params;

    const filteredQuestions = this.questions.filter(
      (q) => q.chatbotId === chatbotId
    );

    const sortedQuestions = filteredQuestions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedQuestions = sortedQuestions.slice(startIndex, endIndex);

    const totalItems = filteredQuestions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return Promise.resolve({
      data: paginatedQuestions,
      pagination: {
        page,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  }

  create(
    params: CreateChatbotQuestionParams
  ): Promise<CreateChatbotQuestionResult> {
    const question: ChatbotQuestion = {
      id: randomUUID(),
      chatbotId: params.chatbotId,
      question: params.question,
      answer: params.answer,
      createdAt: new Date(),
    };

    this.questions.push(question);
    return Promise.resolve(question);
  }

  clear(): void {
    this.questions = [];
  }

  getAll(): ChatbotQuestion[] {
    return [...this.questions];
  }

  findById(id: string): ChatbotQuestion | undefined {
    return this.questions.find((q) => q.id === id);
  }
}
