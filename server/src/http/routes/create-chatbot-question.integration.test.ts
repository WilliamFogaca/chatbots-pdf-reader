import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/app.ts";
import {
  getChatbotQuestionsRepository,
  getChatbotRepository,
  getPDFFileChunksRepository,
} from "@/db/factories/repositories-factory.ts";
import { InMemoryChatbotQuestionsRepository } from "@/db/in-memory/in-memory-chatbot-questions-repository.ts";
import { InMemoryChatbotRepository } from "@/db/in-memory/in-memory-chatbot-repository.ts";
import { InMemoryPDFFileChunksRepository } from "@/db/in-memory/in-memory-pdf-file-chunks-repository.ts";
import {
  generateAnswer,
  generateEmbeddings,
  translateContentToEnglish,
} from "@/services/ai-provider.ts";

vi.mock("@/db/factories/repositories-factory.ts", () => ({
  getChatbotRepository: vi.fn(),
  getChatbotQuestionsRepository: vi.fn(),
  getPDFFileChunksRepository: vi.fn(),
}));

vi.mock("@/services/ai-provider.ts", () => ({
  generateEmbeddings: vi.fn(),
  translateContentToEnglish: vi.fn(),
  generateAnswer: vi.fn(),
}));

describe("POST /chatbots/:chatbotId/questions", () => {
  let app: FastifyInstance;
  let chatbotRepository: InMemoryChatbotRepository;
  let chatbotQuestionsRepository: InMemoryChatbotQuestionsRepository;
  let pdfFileChunksRepository: InMemoryPDFFileChunksRepository;

  beforeEach(() => {
    app = buildApp();

    chatbotRepository = new InMemoryChatbotRepository();
    chatbotQuestionsRepository = new InMemoryChatbotQuestionsRepository();
    pdfFileChunksRepository = new InMemoryPDFFileChunksRepository();

    vi.mocked(getChatbotRepository).mockReturnValue(chatbotRepository);
    vi.mocked(getChatbotQuestionsRepository).mockReturnValue(
      chatbotQuestionsRepository
    );
    vi.mocked(getPDFFileChunksRepository).mockReturnValue(
      pdfFileChunksRepository
    );

    vi.clearAllMocks();

    vi.mocked(translateContentToEnglish).mockResolvedValue(
      "translated question"
    );
    vi.mocked(generateEmbeddings).mockResolvedValue([0.1, 0.2, 0.3, 0.4, 0.5]);
    vi.mocked(generateAnswer).mockResolvedValue(
      "This is the AI generated answer"
    );
  });

  afterEach(async () => {
    await app.close();

    chatbotRepository.clear();
    chatbotQuestionsRepository.clear();
    pdfFileChunksRepository.clear();
    vi.restoreAllMocks();
  });

  it("should create a question with AI generated answer when relevant chunks exist", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Test Chatbot",
    });

    await pdfFileChunksRepository.createMany({
      chunks: [
        {
          pdfFileId: "pdf-1",
          content: "Content about AI",
          embeddings: [0.1, 0.2, 0.3, 0.4, 0.5],
        },
        {
          pdfFileId: "pdf-1",
          content: "More AI content",
          embeddings: [0.2, 0.3, 0.4, 0.5, 0.6],
        },
      ],
    });

    const response = await app.inject({
      method: "POST",
      url: `/chatbots/${chatbot.id}/questions`,
      payload: {
        question: "What is AI?",
      },
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("questionId");
    expect(body.answer).toBe("This is the AI generated answer");

    expect(translateContentToEnglish).toHaveBeenCalledWith("What is AI?");
    expect(generateEmbeddings).toHaveBeenCalledWith("translated question");
    expect(generateAnswer).toHaveBeenCalled();

    const questions = chatbotQuestionsRepository.getAll();
    expect(questions).toHaveLength(1);
    expect(questions[0].question).toBe("What is AI?");
    expect(questions[0].answer).toBe("This is the AI generated answer");
    expect(questions[0].chatbotId).toBe(chatbot.id);
  });

  it("should create a question with null answer when no relevant chunks exist", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Empty Chatbot",
    });

    const response = await app.inject({
      method: "POST",
      url: `/chatbots/${chatbot.id}/questions`,
      payload: {
        question: "What is machine learning?",
      },
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("questionId");
    expect(body.answer).toBeNull();

    expect(translateContentToEnglish).toHaveBeenCalledWith(
      "What is machine learning?"
    );
    expect(generateEmbeddings).toHaveBeenCalled();
    expect(generateAnswer).not.toHaveBeenCalled();

    const questions = chatbotQuestionsRepository.getAll();
    expect(questions).toHaveLength(1);
    expect(questions[0].answer).toBeNull();
  });

  it("should reject invalid uuid for chatbotId", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/chatbots/invalid-uuid/questions",
      payload: {
        question: "Test question",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should reject question with less than 10 characters", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Test Chatbot",
    });

    const response = await app.inject({
      method: "POST",
      url: `/chatbots/${chatbot.id}/questions`,
      payload: {
        question: "Short",
      },
    });

    expect(response.statusCode).toBe(400);

    const questions = chatbotQuestionsRepository.getAll();
    expect(questions).toHaveLength(0);
  });
});
