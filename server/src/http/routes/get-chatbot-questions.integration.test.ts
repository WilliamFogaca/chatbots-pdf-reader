import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/app.ts";
import {
  getChatbotQuestionsRepository,
  getChatbotRepository,
} from "@/db/factories/repositories-factory.ts";
import { InMemoryChatbotQuestionsRepository } from "@/db/in-memory/in-memory-chatbot-questions-repository.ts";
import { InMemoryChatbotRepository } from "@/db/in-memory/in-memory-chatbot-repository.ts";

vi.mock("@/db/factories/repositories-factory.ts", () => ({
  getChatbotRepository: vi.fn(),
  getChatbotQuestionsRepository: vi.fn(),
}));

describe("GET /chatbots/:chatbotId/questions", () => {
  let app: FastifyInstance;
  let chatbotRepository: InMemoryChatbotRepository;
  let chatbotQuestionsRepository: InMemoryChatbotQuestionsRepository;

  beforeEach(() => {
    app = buildApp();

    chatbotRepository = new InMemoryChatbotRepository();
    chatbotQuestionsRepository = new InMemoryChatbotQuestionsRepository();

    vi.mocked(getChatbotRepository).mockReturnValue(chatbotRepository);
    vi.mocked(getChatbotQuestionsRepository).mockReturnValue(
      chatbotQuestionsRepository
    );
  });

  afterEach(async () => {
    await app.close();

    chatbotRepository.clear();
    chatbotQuestionsRepository.clear();
    vi.restoreAllMocks();
  });

  it("should list questions for a chatbot with pagination", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Test Chatbot",
    });

    await chatbotQuestionsRepository.create({
      chatbotId: chatbot.id,
      question: "What is AI?",
      answer: "Artificial Intelligence",
    });
    await chatbotQuestionsRepository.create({
      chatbotId: chatbot.id,
      question: "What is ML?",
      answer: "Machine Learning",
    });
    await chatbotQuestionsRepository.create({
      chatbotId: chatbot.id,
      question: "What is DL?",
      answer: null,
    });

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${chatbot.id}/questions?page=1`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.questions).toHaveLength(3);
    expect(body.questions[0]).toHaveProperty("question");
    expect(body.questions[0]).toHaveProperty("answer");
    expect(body.pagination).toEqual({
      page: 1,
      itemsPerPage: 10,
      totalItems: 3,
      totalPages: 1,
      hasNextPage: false,
    });
  });

  it("should return empty list when chatbot has no questions", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Empty Chatbot",
    });

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${chatbot.id}/questions`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.questions).toHaveLength(0);
    expect(body.pagination).toEqual({
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
    });
  });

  it("should paginate questions correctly", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Chatbot with Many Questions",
    });

    for (let i = 1; i <= 15; i++) {
      await chatbotQuestionsRepository.create({
        chatbotId: chatbot.id,
        question: `Question ${i}?`,
        answer: `Answer ${i}`,
      });
    }

    const firstPageResponse = await app.inject({
      method: "GET",
      url: `/chatbots/${chatbot.id}/questions?page=1`,
    });

    expect(firstPageResponse.statusCode).toBe(200);

    const firstPageBody = JSON.parse(firstPageResponse.body);
    expect(firstPageBody.questions).toHaveLength(10);
    expect(firstPageBody.pagination).toEqual({
      page: 1,
      itemsPerPage: 10,
      totalItems: 15,
      totalPages: 2,
      hasNextPage: true,
    });

    const secondPageResponse = await app.inject({
      method: "GET",
      url: `/chatbots/${chatbot.id}/questions?page=2`,
    });

    expect(secondPageResponse.statusCode).toBe(200);

    const secondPageBody = JSON.parse(secondPageResponse.body);
    expect(secondPageBody.questions).toHaveLength(5);
    expect(secondPageBody.pagination).toEqual({
      page: 2,
      itemsPerPage: 10,
      totalItems: 15,
      totalPages: 2,
      hasNextPage: false,
    });
  });

  it("should only return questions for the specified chatbot", async () => {
    const chatbot1 = await chatbotRepository.create({
      title: "Chatbot 1",
    });
    const chatbot2 = await chatbotRepository.create({
      title: "Chatbot 2",
    });

    await chatbotQuestionsRepository.create({
      chatbotId: chatbot1.id,
      question: "Question for chatbot 1",
      answer: "Answer 1",
    });
    await chatbotQuestionsRepository.create({
      chatbotId: chatbot2.id,
      question: "Question for chatbot 2",
      answer: "Answer 2",
    });

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${chatbot1.id}/questions`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.questions).toHaveLength(1);
    expect(body.questions[0].question).toBe("Question for chatbot 1");
  });

  it("should use page 1 as default when page param is not provided", async () => {
    const chatbot = await chatbotRepository.create({
      title: "Test Chatbot",
    });

    await chatbotQuestionsRepository.create({
      chatbotId: chatbot.id,
      question: "Test question",
      answer: "Test answer",
    });

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${chatbot.id}/questions`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.pagination.page).toBe(1);
  });
});
