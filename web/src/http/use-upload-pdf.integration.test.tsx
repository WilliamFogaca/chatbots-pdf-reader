import { createQueryWrapper } from "@test/mocks/query-wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { useUploadPDF } from "./use-upload-pdf";

vi.mock("@/lib/api", () => ({
  api: {
    uploadPDF: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useUploadPDF", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads PDF successfully and invalidates chatbot query", async () => {
    const mockResponse = {
      fileId: "file-123",
    };

    vi.mocked(api.uploadPDF).mockResolvedValue(mockResponse);

    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });

    const { result } = renderHook(() => useUploadPDF(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      chatbotId: "chatbot-123",
      file: mockFile,
    });

    expect(api.uploadPDF).toHaveBeenCalledWith({
      chatbotId: "chatbot-123",
      file: mockFile,
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("PDF enviado com sucesso!");
    });
  });

  it("shows error toast when upload fails", async () => {
    vi.mocked(api.uploadPDF).mockRejectedValue(new Error("Upload failed"));

    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });

    const { result } = renderHook(() => useUploadPDF(), {
      wrapper: createQueryWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        chatbotId: "chatbot-123",
        file: mockFile,
      })
    ).rejects.toThrow();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao enviar PDF. Por favor, tente novamente."
      );
    });
  });
});
