import { randomUUID } from "node:crypto";
import { calculateCosineSimilarity } from "@test/mocks/calculate-cosine-similarity.ts";
import type {
  PDFFileChunk,
  PDFFileChunksWithSimilarity,
} from "@/domain/entities/pdf-file-chunk.ts";
import type {
  CreateManyPDFFileChunksParams,
  CreateManyPDFFileChunksResult,
  FindManyWithSimilarityPDFFileChunksParams,
  FindManyWithSimilarityPDFFileChunksResult,
  PDFFileChunksRepository,
} from "@/domain/repositories/pdf-file-chunks-repostiory.ts";

export class InMemoryPDFFileChunksRepository
  implements PDFFileChunksRepository
{
  private chunks: PDFFileChunk[] = [];

  findManyWithSimilarity(
    params: FindManyWithSimilarityPDFFileChunksParams
  ): Promise<FindManyWithSimilarityPDFFileChunksResult> {
    const { embeddings } = params;

    const chunksWithSimilarity: PDFFileChunksWithSimilarity[] = this.chunks
      .map((chunk) => {
        const similarity = calculateCosineSimilarity(
          embeddings,
          chunk.embeddings
        );

        return {
          id: chunk.id,
          content: chunk.content,
          similarity,
        };
      })
      .filter((chunk) => chunk.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    return Promise.resolve(chunksWithSimilarity);
  }

  createMany<T = unknown>(
    params: CreateManyPDFFileChunksParams,
    _db?: T
  ): Promise<CreateManyPDFFileChunksResult> {
    const chunks: PDFFileChunk[] = params.chunks.map((chunkData) => ({
      id: randomUUID(),
      pdfFileId: chunkData.pdfFileId,
      content: chunkData.content,
      embeddings: chunkData.embeddings,
      createdAt: new Date(),
    }));

    this.chunks.push(...chunks);
    return Promise.resolve(chunks);
  }

  clear(): void {
    this.chunks = [];
  }

  getAll(): PDFFileChunk[] {
    return [...this.chunks];
  }

  findById(id: string): PDFFileChunk | undefined {
    return this.chunks.find((chunk) => chunk.id === id);
  }

  findByPdfFileId(pdfFileId: string): PDFFileChunk[] {
    return this.chunks.filter((chunk) => chunk.pdfFileId === pdfFileId);
  }
}
