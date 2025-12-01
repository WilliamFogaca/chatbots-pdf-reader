import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChatbotQuestionForm } from "./chatbot-question-form";

vi.mock("@/http/use-chatbot");
vi.mock("@/http/use-create-chatbot-question");
vi.mock("./ui/dialog", () => ({
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("./upload-pdf-button", () => ({
  UploadPDFButton: () => <button type="button">Upload PDF</button>,
}));

const { useChatbot } = await import("@/http/use-chatbot");
const { useCreateChatbotQuestion } = await import(
  "@/http/use-create-chatbot-question"
);

describe("ChatbotQuestionForm", () => {
  it("shows empty state when chatbot has no PDF", () => {
    vi.mocked(useChatbot).mockReturnValue({
      data: { chatbot: { id: "1", hasPDF: false, title: "Test" } },
    } as any);
    vi.mocked(useCreateChatbotQuestion).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);

    render(<ChatbotQuestionForm chatbotId="1" />);

    expect(screen.getByText("PDF não encontrado")).toBeInTheDocument();
  });

  it("renders form when chatbot has PDF", () => {
    vi.mocked(useChatbot).mockReturnValue({
      data: { chatbot: { id: "1", hasPDF: true, title: "Test" } },
    } as any);
    vi.mocked(useCreateChatbotQuestion).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);

    render(<ChatbotQuestionForm chatbotId="1" />);

    expect(screen.getByText("Sua Pergunta")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar Pergunta" })
    ).toBeInTheDocument();
  });

  it("submits question successfully", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({});

    vi.mocked(useChatbot).mockReturnValue({
      data: { chatbot: { id: "1", hasPDF: true, title: "Test" } },
    } as any);
    vi.mocked(useCreateChatbotQuestion).mockReturnValue({
      mutateAsync,
    } as any);

    render(<ChatbotQuestionForm chatbotId="1" />);

    const textarea = screen.getByPlaceholderText(
      "O que você gostaria de saber?"
    );
    await user.type(textarea, "O que é React? É muito bom?");
    await user.click(screen.getByRole("button", { name: "Enviar Pergunta" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        chatbotId: "1",
        question: "O que é React? É muito bom?",
      });
    });
  });

  it("shows validation error for short question", async () => {
    const user = userEvent.setup();

    vi.mocked(useChatbot).mockReturnValue({
      data: { chatbot: { id: "1", hasPDF: true, title: "Test" } },
    } as any);
    vi.mocked(useCreateChatbotQuestion).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);

    render(<ChatbotQuestionForm chatbotId="1" />);

    const textarea = screen.getByPlaceholderText(
      "O que você gostaria de saber?"
    );
    await user.type(textarea, "curto");
    await user.click(screen.getByRole("button", { name: "Enviar Pergunta" }));

    await waitFor(() => {
      expect(
        screen.getByText("Pergunta deve ter pelo menos 10 caracteres")
      ).toBeInTheDocument();
    });
  });
});
