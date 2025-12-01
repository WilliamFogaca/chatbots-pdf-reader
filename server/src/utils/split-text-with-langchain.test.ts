import { describe, expect, it } from "vitest";
import { splitTextWithLangChain } from "./split-text-with-langchain.ts";

describe("splitTextWithLangChain", () => {
  it("should split text into chunks", async () => {
    const text = "This is a test. ".repeat(100);

    const result = await splitTextWithLangChain({ text });

    expect(result.length).toBeGreaterThan(1);
    expect(result.every((chunk) => chunk.length <= 500)).toBe(true);
  });

  it("should add prefix to chunks", async () => {
    const text = "Content here. ".repeat(50);

    const result = await splitTextWithLangChain({
      text,
      prefix: "(page 1) ",
    });

    expect(result.every((chunk) => chunk.startsWith("(page 1) "))).toBe(true);
  });

  it("should use custom chunk size", async () => {
    const text = "Word ".repeat(200);

    const result = await splitTextWithLangChain({
      text,
      chunkSize: 100,
    });

    expect(result.every((chunk) => chunk.length <= 100)).toBe(true);
  });

  it("should handle short text without splitting", async () => {
    const text = "Short text";

    const result = await splitTextWithLangChain({ text });

    expect(result).toHaveLength(1);
    expect(result[0]).toBe("Short text");
  });

  it("should split on sentence boundaries", async () => {
    const text = "First sentence. Second sentence. Third sentence.";

    const result = await splitTextWithLangChain({
      text,
      chunkSize: 30,
      chunkOverlap: 5,
    });

    expect(result.length).toBeGreaterThan(1);
  });
});
