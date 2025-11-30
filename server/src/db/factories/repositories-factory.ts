import { DrizzleChatbotRepository } from "@/db/drizzle/repositories/chatbot-repository.ts";
import type { ChatbotPDFFilesRepository } from "@/domain/repositories/chatbot-pdf-files-repository.ts";
import type { ChatbotQuestionsRepository } from "@/domain/repositories/chatbot-questions-repository.ts";
import type { ChatbotRepository } from "@/domain/repositories/chatbot-repository.ts";
import type { PDFFileChunksRepository } from "@/domain/repositories/pdf-file-chunks-repostiory.ts";
import { DrizzleChatbotPDFFilesRepository } from "../drizzle/repositories/chatbot-pdf-files-repository.ts";
import { DrizzleChatbotQuestionsRepository } from "../drizzle/repositories/chatbot-questions-repository.ts";
import { DrizzlePDFFileChunksRepository } from "../drizzle/repositories/pdf-file-chunks-repository.ts";

const repositories = {
  chatbot: DrizzleChatbotRepository,
  chatbotPDFFiles: DrizzleChatbotPDFFilesRepository,
  chatbotQuestions: DrizzleChatbotQuestionsRepository,
  pdfFileChunks: DrizzlePDFFileChunksRepository,
};

// Singleton instances
let chatbotRepositoryInstance: ChatbotRepository | null = null;
let chatbotPDFFilesRepositoryInstance: ChatbotPDFFilesRepository | null = null;
let chatbotQuestionsRepositoryInstance: ChatbotQuestionsRepository | null =
  null;
let pdfFileChunksRepositoryInstance: PDFFileChunksRepository | null = null;

// Repositories factory functions
// Chatbot Repository
export function getChatbotRepository(): ChatbotRepository {
  if (!chatbotRepositoryInstance) {
    chatbotRepositoryInstance = new repositories.chatbot();
  }

  return chatbotRepositoryInstance;
}

// Chatbot Questions Repository
export function getChatbotQuestionsRepository(): ChatbotQuestionsRepository {
  if (!chatbotQuestionsRepositoryInstance) {
    chatbotQuestionsRepositoryInstance = new repositories.chatbotQuestions();
  }

  return chatbotQuestionsRepositoryInstance;
}

// Chatbot PDF Files Repository
export function getChatbotPDFFilesRepository(): ChatbotPDFFilesRepository {
  if (!chatbotPDFFilesRepositoryInstance) {
    chatbotPDFFilesRepositoryInstance = new repositories.chatbotPDFFiles();
  }

  return chatbotPDFFilesRepositoryInstance;
}

// PDF File Chunks Repository
export function getPDFFileChunksRepository(): PDFFileChunksRepository {
  if (!pdfFileChunksRepositoryInstance) {
    pdfFileChunksRepositoryInstance = new repositories.pdfFileChunks();
  }

  return pdfFileChunksRepositoryInstance;
}

export function resetRepositories(): void {
  chatbotRepositoryInstance = null;
  chatbotPDFFilesRepositoryInstance = null;
  chatbotQuestionsRepositoryInstance = null;
  pdfFileChunksRepositoryInstance = null;
}
