import type { ChatbotRepository } from "@/domain/repositories/chatbot-repository.ts";
import { DrizzleChatbotRepository } from "../drizzle/repositories/chatbot-repository.ts";

// Singleton instances
let chatbotRepositoryInstance: ChatbotRepository | null = null;

export function getChatbotRepository(): ChatbotRepository {
  if (!chatbotRepositoryInstance) {
    chatbotRepositoryInstance = new DrizzleChatbotRepository();
  }

  return chatbotRepositoryInstance;
}

export function resetRepositories(): void {
  chatbotRepositoryInstance = null;
}
