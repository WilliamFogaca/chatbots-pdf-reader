import { createQueryWrapper } from "@test/mocks/query-wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useChatbot } from "./use-chatbot";

vi.mock("@/lib/api");

const { api } = await import("@/lib/api");

describe("useChatbot", () => {
  it("fetches chatbot data successfully", async () => {
    const mockChatbot = {
      chatbot: {
        id: "123",
        title: "Test Chatbot",
        hasPDF: true,
        createdAt: new Date().toISOString(),
        questionCount: 5,
      },
    };

    vi.mocked(api.getChatbot).mockResolvedValue(mockChatbot);

    const { result } = renderHook(() => useChatbot("123"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockChatbot);
    });

    expect(api.getChatbot).toHaveBeenCalledWith({ chatbotId: "123" });
  });
});
