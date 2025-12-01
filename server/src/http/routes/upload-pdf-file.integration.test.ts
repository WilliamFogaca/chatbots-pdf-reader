import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/app.ts";
import {
  getChatbotPDFFilesRepository,
  getChatbotRepository,
} from "@/db/factories/repositories-factory.ts";
import { InMemoryChatbotPDFFilesRepository } from "@/db/in-memory/in-memory-chatbot-pdf-files-repository.ts";
import { InMemoryChatbotRepository } from "@/db/in-memory/in-memory-chatbot-repository.ts";
import { extractPagesFromPDF } from "@/utils/extract-pages-from-pdf.ts";
import { splitTextWithLangChain } from "@/utils/split-text-with-langchain.ts";

vi.mock("@/db/factories/repositories-factory.ts", () => ({
  getChatbotRepository: vi.fn(),
  getChatbotPDFFilesRepository: vi.fn(),
}));

vi.mock("@/utils/extract-pages-from-pdf.ts", () => ({
  extractPagesFromPDF: vi.fn(),
}));

vi.mock("@/utils/split-text-with-langchain.ts", () => ({
  splitTextWithLangChain: vi.fn(),
}));

describe("POST /chatbots/:chatbotId/pdf-files/upload", () => {
  let app: FastifyInstance;
  let chatbotRepository: InMemoryChatbotRepository;
  let chatbotPDFFilesRepository: InMemoryChatbotPDFFilesRepository;

  beforeEach(() => {
    app = buildApp();

    chatbotRepository = new InMemoryChatbotRepository();
    chatbotPDFFilesRepository = new InMemoryChatbotPDFFilesRepository();

    vi.mocked(getChatbotRepository).mockReturnValue(chatbotRepository);
    vi.mocked(getChatbotPDFFilesRepository).mockReturnValue(
      chatbotPDFFilesRepository
    );

    vi.clearAllMocks();

    vi.mocked(extractPagesFromPDF).mockResolvedValue([
      "Page 1 content",
      "Page 2 content",
    ]);

    vi.mocked(splitTextWithLangChain).mockResolvedValue(["chunk 1", "chunk 2"]);
  });

  afterEach(async () => {
    await app.close();

    chatbotRepository.clear();
    chatbotPDFFilesRepository.clear();
    vi.restoreAllMocks();
  });

  it("should reject request without file", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Test Chatbot",
    });

    const response = await app.inject({
      method: "POST",
      url: `/chatbots/${chatbot.id}/pdf-files/upload`,
    });

    expect(response.statusCode).toBe(406);
  });

  it("should reject invalid chatbotId", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/chatbots/invalid-uuid/pdf-files/upload",
    });

    expect(response.statusCode).toBe(400);
  });
});
