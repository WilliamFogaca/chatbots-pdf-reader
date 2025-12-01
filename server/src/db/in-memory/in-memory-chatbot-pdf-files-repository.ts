import { randomUUID } from "node:crypto";
import type { ChatbotPDFFile } from "@/domain/entities/chatbot-pdf-file.ts";
import type { PDFFileChunk } from "@/domain/entities/pdf-file-chunk.ts";
import type {
  ChatbotPDFFilesRepository,
  CreateChatbotPDFFileParams,
  CreateChatbotPDFFileResult,
  CreateWithChunksChatbotPDFFileParams,
  CreateWithChunksChatbotPDFFileResult,
} from "@/domain/repositories/chatbot-pdf-files-repository.ts";

export class InMemoryChatbotPDFFilesRepository
  implements ChatbotPDFFilesRepository
{
  private pdfFiles: ChatbotPDFFile[] = [];
  private pdfFileChunks: PDFFileChunk[] = [];

  create(
    params: CreateChatbotPDFFileParams
  ): Promise<CreateChatbotPDFFileResult> {
    const pdfFile: ChatbotPDFFile = {
      id: randomUUID(),
      chatbotId: params.chatbotId,
      fileName: params.fileName,
      mimeType: params.mimeType,
      createdAt: new Date(),
    };

    this.pdfFiles.push(pdfFile);
    return Promise.resolve(pdfFile);
  }

  createWithChunks(
    params: CreateWithChunksChatbotPDFFileParams
  ): Promise<CreateWithChunksChatbotPDFFileResult> {
    const pdfFile: ChatbotPDFFile = {
      id: randomUUID(),
      chatbotId: params.chatbotId,
      fileName: params.fileName,
      mimeType: params.mimeType,
      createdAt: new Date(),
    };

    this.pdfFiles.push(pdfFile);

    const chunks: PDFFileChunk[] = params.pageTexts.map((text) => ({
      id: randomUUID(),
      pdfFileId: pdfFile.id,
      content: text,
      embeddings: [],
      createdAt: new Date(),
    }));

    this.pdfFileChunks.push(...chunks);
    return Promise.resolve(chunks);
  }

  clear(): void {
    this.pdfFiles = [];
    this.pdfFileChunks = [];
  }

  getAllPDFFiles(): ChatbotPDFFile[] {
    return [...this.pdfFiles];
  }

  getAllChunks(): PDFFileChunk[] {
    return [...this.pdfFileChunks];
  }

  findPDFFileById(id: string): ChatbotPDFFile | undefined {
    return this.pdfFiles.find((file) => file.id === id);
  }
}
