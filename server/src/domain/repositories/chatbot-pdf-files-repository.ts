import type { ChatbotPDFFile } from "../entities/chatbot-pdf-file.ts";
import type { PDFFileChunk } from "../entities/pdf-file-chunk.ts";

export type CreateChatbotPDFFileParams = {
  chatbotId: string;
  fileName: string;
  mimeType: string;
};

export type CreateChatbotPDFFileResult = ChatbotPDFFile;

export type CreateWithChunksChatbotPDFFileParams = {
  chatbotId: string;
  fileName: string;
  mimeType: string;
  pageTexts: string[];
};

export type CreateWithChunksChatbotPDFFileResult = PDFFileChunk[];

export type ChatbotPDFFilesRepository = {
  create(
    params: CreateChatbotPDFFileParams
  ): Promise<CreateChatbotPDFFileResult>;

  createWithChunks(
    params: CreateWithChunksChatbotPDFFileParams
  ): Promise<CreateWithChunksChatbotPDFFileResult>;
};
