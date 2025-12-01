import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@test/mocks/mock-next-link";
import { ChatbotList } from "./chatbot-list";

vi.mock("@/http/use-chatbots");

const { useChatbots } = await import("@/http/use-chatbots");

describe("ChatbotList", () => {
  it("renders empty state when no chatbots", () => {
    vi.mocked(useChatbots).mockReturnValue({
      data: {
        pages: [
          {
            chatbots: [],
            pagination: { hasNextPage: false, page: 1, limit: 10, total: 0 },
          },
        ],
        pageParams: [1],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<ChatbotList />);

    expect(screen.getByText("Nenhum chatbot encontrado.")).toBeInTheDocument();
  });

  it("renders chatbot list with data", () => {
    vi.mocked(useChatbots).mockReturnValue({
      data: {
        pages: [
          {
            chatbots: [
              {
                id: "1",
                title: "Chatbot 1",
                createdAt: new Date().toISOString(),
                questionCount: 5,
              },
              {
                id: "2",
                title: "Chatbot 2",
                createdAt: new Date().toISOString(),
                questionCount: 3,
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

    render(<ChatbotList />);

    expect(screen.getByText("Chatbot 1")).toBeInTheDocument();
    expect(screen.getByText("Chatbot 2")).toBeInTheDocument();
    expect(screen.getByText("5 pergunta(s)")).toBeInTheDocument();
  });

  it("renders load more button when has next page", () => {
    vi.mocked(useChatbots).mockReturnValue({
      data: {
        pages: [
          {
            chatbots: [
              {
                id: "1",
                title: "Chatbot 1",
                createdAt: new Date().toISOString(),
                questionCount: 5,
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

    render(<ChatbotList />);

    expect(screen.getByText("Carregar mais")).toBeInTheDocument();
  });
});
