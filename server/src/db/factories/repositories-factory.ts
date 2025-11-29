import { DrizzleChatbotRepository } from "@/db/drizzle/repositories/chatbot-repository.ts";
import type { ChatbotPDFFilesRepository } from "@/domain/repositories/chatbot-pdf-files-repository.ts";
import type { ChatbotRepository } from "@/domain/repositories/chatbot-repository.ts";
import { DrizzleChatbotPDFFilesRepository } from "../drizzle/repositories/chatbot-pdf-files-repository.ts";

// Singleton instances
let chatbotRepositoryInstance: ChatbotRepository | null = null;
let chatbotPDFFilesRepositoryInstance: ChatbotPDFFilesRepository | null = null;

// Repositories factory functions
// Chatbot Repository
export function getChatbotRepository(): ChatbotRepository {
  if (!chatbotRepositoryInstance) {
    chatbotRepositoryInstance = new DrizzleChatbotRepository();
  }

  return chatbotRepositoryInstance;
}

// Chatbot PDF Files Repository
export function getChatbotPDFFilesRepository(): ChatbotPDFFilesRepository {
  if (!chatbotPDFFilesRepositoryInstance) {
    chatbotPDFFilesRepositoryInstance = new DrizzleChatbotPDFFilesRepository();
  }

  return chatbotPDFFilesRepositoryInstance;
}

export function resetRepositories(): void {
  chatbotRepositoryInstance = null;
  chatbotPDFFilesRepositoryInstance = null;
}
