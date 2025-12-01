import ollama from "ollama";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OllamaService } from "./ollama.ts";

vi.mock("ollama");

describe("OllamaService", () => {
  const mockOllama = vi.mocked(ollama);
  let service: OllamaService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OllamaService();
  });

  describe("generateEmbeddings", () => {
    it("should generate embeddings successfully", async () => {
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4];
      mockOllama.embeddings.mockResolvedValue({
        embedding: mockEmbedding,
      });

      const result = await service.generateEmbeddings("test content");

      expect(result).toEqual(mockEmbedding);
      expect(mockOllama.embeddings).toHaveBeenCalledWith({
        model: "test-embeddings-model",
        prompt: "test content",
      });
    });

    it("should throw error when embeddings generation fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {
          // Ignores
        });

      mockOllama.embeddings.mockRejectedValue(new Error("API error"));

      await expect(service.generateEmbeddings("test")).rejects.toThrow(
        "Não foi possível gerar embeddings pelo Ollama."
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao gerar embeddings com Ollama:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("translateContentToEnglish", () => {
    it("should translate content to English", async () => {
      mockOllama.chat.mockResolvedValue({
        message: {
          role: "assistant",
          content: "What is artificial intelligence?",
        },
      } as any);

      const result = await service.translateContentToEnglish(
        "O que é inteligência artificial?"
      );

      expect(result).toBe("What is artificial intelligence?");
      expect(mockOllama.chat).toHaveBeenCalledWith({
        model: "test-translation-model",
        messages: [
          {
            role: "system",
            content: expect.stringContaining(
              "You are a strict translation engine"
            ),
          },
          {
            role: "user",
            content: expect.stringContaining(
              "O que é inteligência artificial?"
            ),
          },
        ],
        stream: false,
      });
    });

    it("should trim whitespace from translated content", async () => {
      mockOllama.chat.mockResolvedValue({
        message: {
          role: "assistant",
          content: "  Hello world  \n",
        },
      } as any);

      const result = await service.translateContentToEnglish("Olá mundo");

      expect(result).toBe("Hello world");
    });

    it("should throw error when translation fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {
          // Ignores
        });

      mockOllama.chat.mockRejectedValue(new Error("Translation error"));

      await expect(
        service.translateContentToEnglish("test content")
      ).rejects.toThrow("Não foi possível traduzir a pergunta pelo Ollama.");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao traduzir a pergunta com Ollama:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("generateAnswer", () => {
    it("should generate answer based on context", async () => {
      const question = "What is the capital of France?";
      const contents = [
        "France is a country in Europe.",
        "Paris is the capital of France.",
      ];

      mockOllama.chat.mockResolvedValue({
        message: {
          role: "assistant",
          content: "A capital da França é Paris.",
        },
      } as any);

      const result = await service.generateAnswer(question, contents);

      expect(result).toBe("A capital da França é Paris.");
      expect(mockOllama.chat).toHaveBeenCalledWith({
        model: "test-answer-model",
        messages: [
          {
            role: "system",
            content: expect.stringContaining(
              "You are a helpful assistant specialized in answering questions"
            ),
          },
          {
            role: "user",
            content: expect.stringContaining(question),
          },
        ],
        stream: false,
      });
    });

    it("should join multiple contents with double newline", async () => {
      const question = "Test question";
      const contents = ["First content", "Second content", "Third content"];

      mockOllama.chat.mockResolvedValue({
        message: {
          role: "assistant",
          content: "Test answer",
        },
      } as any);

      await service.generateAnswer(question, contents);

      const calls = mockOllama.chat.mock.calls[0];
      const userMessageCall = calls?.[0]?.messages?.[1];
      expect(userMessageCall?.content).toContain(
        "First content\n\nSecond content\n\nThird content"
      );
    });

    it("should throw error when response has no content", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {
          // Ignores
        });

      mockOllama.chat.mockResolvedValue({
        message: {
          role: "assistant",
          content: "",
        },
      } as any);

      await expect(
        service.generateAnswer("question", ["context"])
      ).rejects.toThrow("Não foi possível gerar a resposta pelo Ollama.");

      consoleErrorSpy.mockRestore();
    });

    it("should throw error when answer generation fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {
          // Ignores
        });

      mockOllama.chat.mockRejectedValue(new Error("API error"));

      await expect(
        service.generateAnswer("question", ["context"])
      ).rejects.toThrow("Não foi possível gerar a resposta pelo Ollama.");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao gerar a resposta com Ollama:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should include system prompt with Portuguese output requirement", async () => {
      mockOllama.chat.mockResolvedValue({
        message: {
          role: "assistant",
          content: "Resposta em português",
        },
      } as any);

      await service.generateAnswer("test", ["context"]);

      const calls = mockOllama.chat.mock.calls[0];
      const systemMessage = calls?.[0]?.messages?.[0];
      expect(systemMessage?.content).toContain("Brazilian Portuguese (pt-BR)");
    });
  });
});
