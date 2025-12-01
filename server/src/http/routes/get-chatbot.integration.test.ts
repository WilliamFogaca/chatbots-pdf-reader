import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/app.ts";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";
import { InMemoryChatbotRepository } from "@/db/in-memory/in-memory-chatbot-repository.ts";

vi.mock("@/db/factories/repositories-factory.ts", () => ({
  getChatbotRepository: vi.fn(),
}));

describe("GET /chatbots/:chatbotId", () => {
  let app: FastifyInstance;
  let chatbotRepository: InMemoryChatbotRepository;

  beforeEach(() => {
    app = buildApp();

    chatbotRepository = new InMemoryChatbotRepository();

    vi.mocked(getChatbotRepository).mockReturnValue(chatbotRepository);
  });

  afterEach(async () => {
    await app.close();

    chatbotRepository.clear();
    vi.restoreAllMocks();
  });

  it("should get a chatbot by id", async () => {
    const createdChatbot = await chatbotRepository.create({
      title: "My Chatbot",
      description: "A test chatbot",
    });

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${createdChatbot.id}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbot).toEqual({
      id: createdChatbot.id,
      title: "My Chatbot",
      description: "A test chatbot",
      createdAt: createdChatbot.createdAt.toISOString(),
    });
  });

  it("should return null when chatbot does not exist", async () => {
    const nonExistentId = "123e4567-e89b-12d3-a456-426614174000";

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${nonExistentId}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbot).toBeNull();
  });

  it("should reject invalid uuid format", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/chatbots/invalid-uuid",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should get chatbot without description", async () => {
    const createdChatbot = await chatbotRepository.create({
      title: "Chatbot Without Description",
    });

    const response = await app.inject({
      method: "GET",
      url: `/chatbots/${createdChatbot.id}`,
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbot).toEqual({
      id: createdChatbot.id,
      title: "Chatbot Without Description",
      description: null,
      createdAt: createdChatbot.createdAt.toISOString(),
    });
  });
});
