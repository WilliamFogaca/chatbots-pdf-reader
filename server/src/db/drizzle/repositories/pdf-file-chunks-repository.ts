import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import type {
  CreateManyPDFFileChunksParams,
  CreateManyPDFFileChunksResult,
  FindManyWithSimilarityPDFFileChunksParams,
  FindManyWithSimilarityPDFFileChunksResult,
  PDFFileChunksRepository,
} from "@/domain/repositories/pdf-file-chunks-repostiory.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

type DbOrTransaction =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];

export class DrizzlePDFFileChunksRepository implements PDFFileChunksRepository {
  async findManyWithSimilarity({
    chatbotId,
    embeddings,
  }: FindManyWithSimilarityPDFFileChunksParams): Promise<FindManyWithSimilarityPDFFileChunksResult> {
    const chunkSimilarity = sql<number>`1 - (${cosineDistance(schema.pdfFileChunks.embeddings, embeddings)})`;

    const chunks = await db
      .select({
        id: schema.pdfFileChunks.id,
        content: schema.pdfFileChunks.content,
        similarity: chunkSimilarity,
      })
      .from(schema.pdfFileChunks)
      .innerJoin(
        schema.chatbotPDFFiles,
        eq(schema.chatbotPDFFiles.id, schema.pdfFileChunks.pdfFileId)
      )
      .where(
        and(
          eq(schema.chatbotPDFFiles.chatbotId, chatbotId),
          gt(chunkSimilarity, 0.25)
        )
      )
      .orderBy((table) => desc(table.similarity))
      .limit(5);

    return chunks;
  }

  async createMany<T = DbOrTransaction>(
    { chunks }: CreateManyPDFFileChunksParams,
    tx?: T
  ): Promise<CreateManyPDFFileChunksResult> {
    const transaction = (tx ?? db) as DbOrTransaction;

    const result = await transaction
      .insert(schema.pdfFileChunks)
      .values(chunks)
      .returning();

    return result;
  }
}
