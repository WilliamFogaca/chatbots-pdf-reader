import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@test/mocks/mock-next-link";
import { ChatbotQuestionList } from "./chatbot-question-list";

vi.mock("@/http/use-chatbot-questions");
vi.mock("./chatbot-question-item", () => ({
  ChatbotQuestionItem: ({
    question,
  }: {
    question: { id: string; question: string };
  }) => <div data-testid={`question-${question.id}`}>{question.question}</div>,
}));

const { useChatbotQuestions } = await import("@/http/use-chatbot-questions");

describe("ChatbotQuestionList", () => {
  it("renders empty state when no questions", () => {
    vi.mocked(useChatbotQuestions).mockReturnValue({
      data: {
        pages: [
          {
            questions: [],
            pagination: { hasNextPage: false, page: 1, limit: 10, total: 0 },
          },
        ],
        pageParams: [1],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<ChatbotQuestionList chatbotId="123" />);

    expect(screen.getByText("Nenhuma pergunta encontrada")).toBeInTheDocument();
  });

  it("renders question list with data", () => {
    vi.mocked(useChatbotQuestions).mockReturnValue({
      data: {
        pages: [
          {
            questions: [
              {
                id: "1",
                question: "O que é React?",
                answer: "Uma biblioteca JavaScript",
                createdAt: new Date().toISOString(),
              },
              {
                id: "2",
                question: "O que é TypeScript?",
                answer: "Um superset do JavaScript",
                createdAt: new Date().toISOString(),
              },
            ],
            pagination: { hasNextPage: false, page: 1, limit: 10, total: 2 },
          },
        ],
        pageParams: [1],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<ChatbotQuestionList chatbotId="123" />);

    expect(screen.getByText("O que é React?")).toBeInTheDocument();
    expect(screen.getByText("O que é TypeScript?")).toBeInTheDocument();
  });

  it("renders load more button when has next page", () => {
    vi.mocked(useChatbotQuestions).mockReturnValue({
      data: {
        pages: [
          {
            questions: [
              {
                id: "1",
                question: "Pergunta 1",
                answer: "Resposta 1",
                createdAt: new Date().toISOString(),
              },
            ],
            pagination: { hasNextPage: true, page: 1, limit: 10, total: 20 },
          },
        ],
        pageParams: [1],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    render(<ChatbotQuestionList chatbotId="123" />);

    expect(screen.getByText("Carregar mais")).toBeInTheDocument();
  });
});
