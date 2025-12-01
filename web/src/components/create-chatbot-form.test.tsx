import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateChatbotForm } from "./create-chatbot-form";

vi.mock("@/http/use-create-chatbot");

const { useCreateChatbot } = await import("@/http/use-create-chatbot");

describe("CreateChatbotForm", () => {
  it("renders form fields", () => {
    vi.mocked(useCreateChatbot).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);

    render(<CreateChatbotForm />);

    expect(screen.getByLabelText("Nome da chatbot")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição do chatbot")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Criar chatbot" })
    ).toBeInTheDocument();
  });

  it("submits form successfully", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({});

    vi.mocked(useCreateChatbot).mockReturnValue({
      mutateAsync,
    } as any);

    render(<CreateChatbotForm />);

    await user.type(screen.getByLabelText("Nome da chatbot"), "Meu Chatbot");
    await user.type(
      screen.getByLabelText("Descrição do chatbot"),
      "Um chatbot para testes"
    );
    await user.click(screen.getByRole("button", { name: "Criar chatbot" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        title: "Meu Chatbot",
        description: "Um chatbot para testes",
      });
    });
  });

  it("shows validation error for short title", async () => {
    const user = userEvent.setup();

    vi.mocked(useCreateChatbot).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);

    render(<CreateChatbotForm />);

    await user.type(screen.getByLabelText("Nome da chatbot"), "ab");
    await user.click(screen.getByRole("button", { name: "Criar chatbot" }));

    await waitFor(() => {
      expect(
        screen.getByText("Inclua pelo menos 3 caracteres")
      ).toBeInTheDocument();
    });
  });
});
