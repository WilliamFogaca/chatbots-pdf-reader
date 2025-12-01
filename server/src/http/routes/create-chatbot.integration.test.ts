import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/app.ts";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";
import { InMemoryChatbotRepository } from "@/db/in-memory/in-memory-chatbot-repository.ts";

vi.mock("@/db/factories/repositories-factory.ts", () => ({
  getChatbotRepository: vi.fn(),
}));

describe("POST /chatbots", () => {
  let app: FastifyInstance;
  let chatbotRepository: InMemoryChatbotRepository;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();

    chatbotRepository = new InMemoryChatbotRepository();

    vi.mocked(getChatbotRepository).mockReturnValue(chatbotRepository);
  });

  afterEach(async () => {
    await app.close();

    chatbotRepository.clear();
    vi.restoreAllMocks();
  });

  it("should create a new chatbot successfully", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/chatbots",
      payload: {
        title: "My Chatbot",
        description: "A test chatbot",
      },
    });

    expect(response.statusCode).toBe(201);

    const body = JSON.parse(response.body);
    expect(body).toHaveProperty("chatbotId");
    expect(typeof body.chatbotId).toBe("string");

    const chatbots = chatbotRepository.getAll();
    expect(chatbots).toHaveLength(1);
    expect(chatbots[0].title).toBe("My Chatbot");
    expect(chatbots[0].description).toBe("A test chatbot");
  });

  it("should create a chatbot without description", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/chatbots",
      payload: {
        title: "My Chatbot",
      },
    });

    expect(response.statusCode).toBe(201);

    const chatbots = chatbotRepository.getAll();
    expect(chatbots).toHaveLength(1);
    expect(chatbots[0].title).toBe("My Chatbot");
    expect(chatbots[0].description).toBeNull();
  });

  it("should reject chatbot with title less than 3 characters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/chatbots",
      payload: {
        title: "AB",
      },
    });

    expect(response.statusCode).toBe(400);

    const chatbots = chatbotRepository.getAll();
    expect(chatbots).toHaveLength(0);
  });

  it("should reject request without title", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/chatbots",
      payload: {},
    });

    expect(response.statusCode).toBe(400);

    const chatbots = chatbotRepository.getAll();
    expect(chatbots).toHaveLength(0);
  });
});
