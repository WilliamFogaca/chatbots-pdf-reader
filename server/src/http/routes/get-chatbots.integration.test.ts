import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "@/app.ts";
import { getChatbotRepository } from "@/db/factories/repositories-factory.ts";
import { InMemoryChatbotRepository } from "@/db/in-memory/in-memory-chatbot-repository.ts";

vi.mock("@/db/factories/repositories-factory.ts", () => ({
  getChatbotRepository: vi.fn(),
}));

describe("GET /chatbots", () => {
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

  it("should list chatbots with pagination", async () => {
    await chatbotRepository.create({
      title: "Chatbot 1",
      description: "First chatbot",
    });
    await chatbotRepository.create({
      title: "Chatbot 2",
      description: "Second chatbot",
    });
    await chatbotRepository.create({
      title: "Chatbot 3",
    });

    const response = await app.inject({
      method: "GET",
      url: "/chatbots?page=1",
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbots).toHaveLength(3);
    expect(body.chatbots[0]).toHaveProperty("questionCount", 0);
    expect(body.pagination).toEqual({
      page: 1,
      itemsPerPage: 10,
      totalItems: 3,
      totalPages: 1,
      hasNextPage: false,
    });
  });

  it("should return empty list when no chatbots exist", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/chatbots",
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbots).toHaveLength(0);
    expect(body.pagination).toEqual({
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
    });
  });

  it("should paginate chatbots correctly", async () => {
    for (let i = 1; i <= 15; i++) {
      await chatbotRepository.create({
        title: `Chatbot ${i}`,
      });
    }

    const firstPageResponse = await app.inject({
      method: "GET",
      url: "/chatbots?page=1",
    });

    expect(firstPageResponse.statusCode).toBe(200);

    const firstPageBody = JSON.parse(firstPageResponse.body);
    expect(firstPageBody.chatbots).toHaveLength(10);
    expect(firstPageBody.pagination).toEqual({
      page: 1,
      itemsPerPage: 10,
      totalItems: 15,
      totalPages: 2,
      hasNextPage: true,
    });

    const secondPageResponse = await app.inject({
      method: "GET",
      url: "/chatbots?page=2",
    });

    expect(secondPageResponse.statusCode).toBe(200);

    const secondPageBody = JSON.parse(secondPageResponse.body);
    expect(secondPageBody.chatbots).toHaveLength(5);
    expect(secondPageBody.pagination).toEqual({
      page: 2,
      itemsPerPage: 10,
      totalItems: 15,
      totalPages: 2,
      hasNextPage: false,
    });
  });

  it("should use page 1 as default when page param is not provided", async () => {
    await chatbotRepository.create({
      title: "Test Chatbot",
    });

    const response = await app.inject({
      method: "GET",
      url: "/chatbots",
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.pagination.page).toBe(1);
  });

  it("should return empty array for page beyond total pages", async () => {
    await chatbotRepository.create({
      title: "Only Chatbot",
    });

    const response = await app.inject({
      method: "GET",
      url: "/chatbots?page=10",
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbots).toHaveLength(0);
    expect(body.pagination).toEqual({
      page: 10,
      itemsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
    });
  });

  it("should include questionCount for each chatbot", async () => {
    await chatbotRepository.create({
      title: "Chatbot with Stats",
      description: "Test",
    });

    const response = await app.inject({
      method: "GET",
      url: "/chatbots",
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.chatbots[0]).toHaveProperty("id");
    expect(body.chatbots[0]).toHaveProperty("title", "Chatbot with Stats");
    expect(body.chatbots[0]).toHaveProperty("description", "Test");
    expect(body.chatbots[0]).toHaveProperty("createdAt");
    expect(body.chatbots[0]).toHaveProperty("questionCount", 0);
  });
});
