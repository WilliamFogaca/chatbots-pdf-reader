import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UploadPDFForm } from "./upload-pdf-form";

vi.mock("@/http/use-upload-pdf");
vi.mock("@/hooks/use-dimiss-modal");

const { useUploadPDF } = await import("@/http/use-upload-pdf");
const { useDismissModal } = await import("@/hooks/use-dimiss-modal");

describe("UploadPDFForm", () => {
  it("renders form fields", () => {
    vi.mocked(useUploadPDF).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);
    vi.mocked(useDismissModal).mockReturnValue({
      dismissCurrentModal: vi.fn(),
    });

    render(<UploadPDFForm chatbotId="123" />);

    expect(screen.getByLabelText("Arquivo PDF")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar PDF" })
    ).toBeInTheDocument();
  });

  it("submits PDF file successfully", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({});
    const dismissCurrentModal = vi.fn();

    vi.mocked(useUploadPDF).mockReturnValue({
      mutateAsync,
    } as any);
    vi.mocked(useDismissModal).mockReturnValue({
      dismissCurrentModal,
    });

    render(<UploadPDFForm chatbotId="123" />);

    const file = new File(["pdf content"], "test.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText("Arquivo PDF");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Enviar PDF" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        chatbotId: "123",
        file,
      });
    });
  });

  it("shows validation error for file too large", async () => {
    const user = userEvent.setup();

    vi.mocked(useUploadPDF).mockReturnValue({
      mutateAsync: vi.fn(),
    } as any);
    vi.mocked(useDismissModal).mockReturnValue({
      dismissCurrentModal: vi.fn(),
    });

    render(<UploadPDFForm chatbotId="123" />);

    const largeContent = new Array(6 * 1024 * 1024).fill("a").join("");
    const file = new File([largeContent], "large.pdf", {
      type: "application/pdf",
    });

    Object.defineProperty(file, "size", { value: 6 * 1024 * 1024 });

    const input = screen.getByLabelText("Arquivo PDF");
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Enviar PDF" }));

    await waitFor(() => {
      expect(
        screen.getByText("O tamanho máximo é de 5MB.")
      ).toBeInTheDocument();
    });
  });
});
