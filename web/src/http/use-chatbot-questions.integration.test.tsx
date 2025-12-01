import { createQueryWrapper } from "@test/mocks/query-wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useChatbotQuestions } from "./use-chatbot-questions";

vi.mock("@/lib/api");

const { api } = await import("@/lib/api");

describe("useChatbotQuestions", () => {
  it("fetches chatbot questions with pagination", async () => {
    const mockResponse = {
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
      pagination: {
        page: 1,
        itemsPerPage: 10,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
      },
    };

    vi.mocked(api.getChatbotQuestions).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatbotQuestions("chatbot-123"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data.pages).toHaveLength(1);
    });

    expect(result.current.data.pages[0]).toEqual(mockResponse);
    expect(api.getChatbotQuestions).toHaveBeenCalledWith({
      chatbotId: "chatbot-123",
      pageParam: 1,
    });
  });

  it("handles pagination with fetchNextPage", async () => {
    const mockPage1 = {
      questions: [
        {
          id: "1",
          question: "Pergunta 1",
          answer: "Resposta 1",
          createdAt: new Date().toISOString(),
        },
      ],
      pagination: {
        page: 1,
        itemsPerPage: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: true,
      },
    };

    const mockPage2 = {
      questions: [
        {
          id: "2",
          question: "Pergunta 2",
          answer: "Resposta 2",
          createdAt: new Date().toISOString(),
        },
      ],
      pagination: {
        page: 2,
        itemsPerPage: 1,
        totalItems: 2,
        totalPages: 2,
        hasNextPage: false,
      },
    };

    vi.mocked(api.getChatbotQuestions)
      .mockResolvedValueOnce(mockPage1)
      .mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(() => useChatbotQuestions("chatbot-123"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(true);
    });

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data.pages).toHaveLength(2);
    });

    expect(result.current.data.pages[0]).toEqual(mockPage1);
    expect(result.current.data.pages[1]).toEqual(mockPage2);
    expect(result.current.hasNextPage).toBe(false);
  });
});
