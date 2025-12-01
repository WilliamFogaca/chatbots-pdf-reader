import { createQueryWrapper } from "@test/mocks/query-wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCreateChatbotQuestion } from "./use-create-chatbot-question";

vi.mock("@/lib/api");
vi.mock("sonner");

const { api } = await import("@/lib/api");
const { toast } = await import("sonner");

describe("useCreateChatbotQuestion", () => {
  it("creates chatbot question successfully", async () => {
    const mockResponse = {
      questionId: "question-123",
      answer: "Resposta gerada pela IA",
    };

    vi.mocked(api.createChatbotQuestion).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateChatbotQuestion(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      chatbotId: "chatbot-123",
      question: "O que é React?",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.createChatbotQuestion).toHaveBeenCalledWith({
      chatbotId: "chatbot-123",
      question: "O que é React?",
    });
    expect(toast.success).toHaveBeenCalledWith("Pergunta criada com sucesso!");
  });

  it("shows error toast when mutation fails", async () => {
    vi.mocked(api.createChatbotQuestion).mockRejectedValue(
      new Error("API Error")
    );

    const { result } = renderHook(() => useCreateChatbotQuestion(), {
      wrapper: createQueryWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        chatbotId: "chatbot-123",
        question: "Pergunta inválida",
      })
    ).rejects.toThrow();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível criar a pergunta. Por favor, tente novamente."
      );
    });
  });
});
