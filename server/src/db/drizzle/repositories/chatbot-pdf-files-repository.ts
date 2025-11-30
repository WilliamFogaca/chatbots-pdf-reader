import { getPDFFileChunksRepository } from "@/db/factories/repositories-factory.ts";
import { FailedToCreateResourceError } from "@/domain/errors/failed-to-create-resource-error.ts";
import { FailedToExtractContentFromPdfFileError } from "@/domain/errors/failed-to-extract-content-from-pdf-file-error.ts";
import type {
  ChatbotPDFFilesRepository,
  CreateChatbotPDFFileParams,
  CreateChatbotPDFFileResult,
  CreateWithChunksChatbotPDFFileParams,
  CreateWithChunksChatbotPDFFileResult,
} from "@/domain/repositories/chatbot-pdf-files-repository.ts";
import { pdfChunkBuilder } from "@/domain/services/pdf-chunk-builder.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

type DbOrTransaction =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];

export class DrizzleChatbotPDFFilesRepository
  implements ChatbotPDFFilesRepository
{
  async create(
    { chatbotId, fileName, mimeType }: CreateChatbotPDFFileParams,
    tx?: DbOrTransaction
  ): Promise<CreateChatbotPDFFileResult> {
    const transaction = tx ?? db;

    const result = await transaction
      .insert(schema.chatbotPDFFiles)
      .values({
        chatbotId,
        fileName,
        mimeType,
      })
      .returning();

    return result[0];
  }

  async createWithChunks({
    chatbotId,
    fileName,
    mimeType,
    pageTexts,
  }: CreateWithChunksChatbotPDFFileParams): Promise<CreateWithChunksChatbotPDFFileResult> {
    const result = await db.transaction(async (tx) => {
      const insertedPDFfile = await this.create(
        { chatbotId, fileName, mimeType },
        tx
      );

      const insertedPDFfileId = insertedPDFfile.id;

      if (!insertedPDFfileId) {
        tx.rollback();
        throw new FailedToCreateResourceError("arquivo PDF");
      }

      const rowsToInsert = await pdfChunkBuilder(insertedPDFfileId, pageTexts);

      if (rowsToInsert.length === 0) {
        tx.rollback();
        throw new FailedToExtractContentFromPdfFileError();
      }

      const PDFFileChunksRepository = getPDFFileChunksRepository();

      const insertedChunks = await PDFFileChunksRepository.createMany<
        typeof tx
      >(
        {
          chunks: rowsToInsert,
        },
        tx
      );

      return insertedChunks;
    });

    return result;
  }
}
