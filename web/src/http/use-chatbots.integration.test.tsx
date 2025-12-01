import { createQueryWrapper } from "@test/mocks/query-wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useChatbots } from "./use-chatbots";

vi.mock("@/lib/api");

const { api } = await import("@/lib/api");

describe("useChatbots", () => {
  it("fetches chatbots with pagination", async () => {
    const mockResponse = {
      chatbots: [
        {
          id: "1",
          title: "Chatbot 1",
          createdAt: new Date().toISOString(),
          questionCount: 3,
        },
        {
          id: "2",
          title: "Chatbot 2",
          createdAt: new Date().toISOString(),
          questionCount: 5,
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

    vi.mocked(api.getChatbots).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChatbots(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data.pages).toHaveLength(1);
    });

    expect(result.current.data.pages[0]).toEqual(mockResponse);
    expect(api.getChatbots).toHaveBeenCalledWith({ pageParam: 1 });
  });

  it("handles pagination with fetchNextPage", async () => {
    const mockPage1 = {
      chatbots: [
        {
          id: "1",
          title: "Chatbot 1",
          createdAt: new Date().toISOString(),
          questionCount: 3,
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
      chatbots: [
        {
          id: "2",
          title: "Chatbot 2",
          createdAt: new Date().toISOString(),
          questionCount: 5,
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

    vi.mocked(api.getChatbots)
      .mockResolvedValueOnce(mockPage1)
      .mockResolvedValueOnce(mockPage2);

    const { result } = renderHook(() => useChatbots(), {
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
