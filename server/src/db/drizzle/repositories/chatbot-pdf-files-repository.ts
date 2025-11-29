import { FailedToCreateResourceError } from "@/domain/errors/failed-to-create-resource-error.ts";
import { FailedToExtractContentFromPdfFileError } from "@/domain/errors/failed-to-extract-content-from-pdf-file-error.ts";
import type {
  ChatbotPDFFilesRepository,
  CreateWithChunksParams,
  CreateWithChunksResult,
} from "@/domain/repositories/chatbot-pdf-files-repository.ts";
import { pdfChunkBuilder } from "@/domain/services/pdf-chunk-builder.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

export class DrizzleChatbotPDFFilesRepository
  implements ChatbotPDFFilesRepository
{
  async createWithChunks({
    chatbotId,
    fileName,
    mimeType,
    pageTexts,
  }: CreateWithChunksParams): Promise<CreateWithChunksResult> {
    const result = await db.transaction(async (tx) => {
      const insertedPDFfile = await tx
        .insert(schema.chatbotPDFFiles)
        .values({
          chatbotId,
          fileName,
          mimeType,
        })
        .returning({ id: schema.chatbotPDFFiles.id });

      const insertedPDFfileId = insertedPDFfile[0]?.id;

      if (!insertedPDFfileId) {
        tx.rollback();
        throw new FailedToCreateResourceError("arquivo PDF");
      }

      const rowsToInsert = await pdfChunkBuilder(insertedPDFfileId, pageTexts);

      if (rowsToInsert.length === 0) {
        tx.rollback();
        throw new FailedToExtractContentFromPdfFileError();
      }

      const insertedChunks = await tx
        .insert(schema.pdfFileChunks)
        .values(rowsToInsert)
        .returning({ pdfFileChunkId: schema.pdfFileChunks.id });

      return insertedChunks;
    });

    return result;
  }
}
