import type { AIService } from "./ai-service.ts";
import { OllamaService } from "./ais/ollama.ts";

let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new OllamaService();
  }

  return aiServiceInstance;
}

export function generateEmbeddings(text: string): Promise<number[]> {
  const service = getAIService();
  return service.generateEmbeddings(text);
}

export function translateContentToEnglish(content: string): Promise<string> {
  const service = getAIService();
  return service.translateContentToEnglish(content);
}

export function generateAnswer(
  question: string,
  contents: string[]
): Promise<string> {
  const service = getAIService();
  return service.generateAnswer(question, contents);
}
