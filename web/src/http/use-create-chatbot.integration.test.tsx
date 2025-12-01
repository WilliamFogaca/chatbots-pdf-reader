import { createQueryWrapper } from "@test/mocks/query-wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { useCreateChatbot } from "./use-create-chatbot";

vi.mock("@/lib/api", () => ({
  api: {
    createChatbot: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useCreateChatbot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates chatbot successfully and invalidates queries", async () => {
    const mockResponse = {
      chatbotId: "chatbot-123",
    };

    vi.mocked(api.createChatbot).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateChatbot(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      title: "Novo Chatbot",
      description: "Descrição do chatbot",
    });

    expect(api.createChatbot).toHaveBeenCalledWith({
      title: "Novo Chatbot",
      description: "Descrição do chatbot",
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Chatbot criado com sucesso!");
    });
  });

  it("shows error toast when mutation fails", async () => {
    vi.mocked(api.createChatbot).mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useCreateChatbot(), {
      wrapper: createQueryWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        title: "Chatbot Inválido",
        description: "Descrição inválida",
      })
    ).rejects.toThrow();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível criar o chatbot. Por favor, tente novamente."
      );
    });
  });
});
