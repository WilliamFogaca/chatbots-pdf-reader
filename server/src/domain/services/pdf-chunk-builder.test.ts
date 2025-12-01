import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateEmbeddings } from "@/services/ai-provider.ts";
import { pdfChunkBuilder } from "./pdf-chunk-builder.ts";

vi.mock("@/services/ai-provider.ts");

describe("pdfChunkBuilder", () => {
  const mockGenerateEmbeddings = vi.mocked(generateEmbeddings);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate embeddings for all valid page texts", async () => {
    const pdfFileId = "pdf-123";
    const pageTexts = ["First page content", "Second page content"];

    mockGenerateEmbeddings
      .mockResolvedValueOnce([0.1, 0.2, 0.3])
      .mockResolvedValueOnce([0.4, 0.5, 0.6]);

    const result = await pdfChunkBuilder(pdfFileId, pageTexts);

    expect(result).toEqual([
      {
        pdfFileId: "pdf-123",
        content: "First page content",
        embeddings: [0.1, 0.2, 0.3],
      },
      {
        pdfFileId: "pdf-123",
        content: "Second page content",
        embeddings: [0.4, 0.5, 0.6],
      },
    ]);
    expect(mockGenerateEmbeddings).toHaveBeenCalledTimes(2);
    expect(mockGenerateEmbeddings).toHaveBeenCalledWith("First page content");
    expect(mockGenerateEmbeddings).toHaveBeenCalledWith("Second page content");
  });

  it("should skip empty page texts", async () => {
    const pdfFileId = "pdf-123";
    const pageTexts = ["Valid content", "", "   ", "Another valid"];

    mockGenerateEmbeddings
      .mockResolvedValueOnce([0.1, 0.2])
      .mockResolvedValueOnce([0.3, 0.4]);

    const result = await pdfChunkBuilder(pdfFileId, pageTexts);

    expect(result).toHaveLength(2);
    expect(result[0].content).toBe("Valid content");
    expect(result[1].content).toBe("Another valid");
    expect(mockGenerateEmbeddings).toHaveBeenCalledTimes(2);
  });

  it("should retry up to 3 times on failure", async () => {
    vi.useFakeTimers();

    const pdfFileId = "pdf-123";
    const pageTexts = ["Content that fails"];

    mockGenerateEmbeddings
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce([0.1, 0.2, 0.3]);

    const promise = pdfChunkBuilder(pdfFileId, pageTexts);

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    const result = await promise;

    expect(result).toHaveLength(1);
    expect(result[0].embeddings).toEqual([0.1, 0.2, 0.3]);
    expect(mockGenerateEmbeddings).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  it("should skip chunk after 3 failed retry attempts", async () => {
    vi.useFakeTimers();

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        // Ignores
      });

    const pdfFileId = "pdf-123";
    const pageTexts = ["Failing content", "Valid content"];

    mockGenerateEmbeddings
      .mockRejectedValueOnce(new Error("Error 1"))
      .mockRejectedValueOnce(new Error("Error 2"))
      .mockRejectedValueOnce(new Error("Error 3"))
      .mockResolvedValueOnce([0.5, 0.6]);

    const promise = pdfChunkBuilder(pdfFileId, pageTexts);

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    const result = await promise;

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("Valid content");
    expect(mockGenerateEmbeddings).toHaveBeenCalledTimes(4);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "FALHA CRÍTICA no chunk 1. Motivo:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
    vi.useRealTimers();
  });

  it("should return empty array when all pages are empty", async () => {
    const pdfFileId = "pdf-123";
    const pageTexts = ["", "   ", "\n\t"];

    const result = await pdfChunkBuilder(pdfFileId, pageTexts);

    expect(result).toEqual([]);
    expect(mockGenerateEmbeddings).not.toHaveBeenCalled();
  });

  it("should handle single page text", async () => {
    const pdfFileId = "pdf-123";
    const pageTexts = ["Single page"];

    mockGenerateEmbeddings.mockResolvedValueOnce([0.7, 0.8, 0.9]);

    const result = await pdfChunkBuilder(pdfFileId, pageTexts);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      pdfFileId: "pdf-123",
      content: "Single page",
      embeddings: [0.7, 0.8, 0.9],
    });
  });

  it("should wait with exponential backoff between retries", async () => {
    vi.useFakeTimers();

    const pdfFileId = "pdf-123";
    const pageTexts = ["Content"];

    let callCount = 0;
    mockGenerateEmbeddings.mockImplementation(() => {
      callCount += 1;
      if (callCount < 3) {
        throw new Error("Temporary failure");
      }
      return Promise.resolve([0.1, 0.2]);
    });

    const promise = pdfChunkBuilder(pdfFileId, pageTexts);

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    const result = await promise;

    expect(result).toHaveLength(1);
    expect(mockGenerateEmbeddings).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });
});
