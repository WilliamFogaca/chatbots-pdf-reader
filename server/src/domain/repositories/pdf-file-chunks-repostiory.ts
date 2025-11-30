import type {
  PDFFileChunk,
  PDFFileChunkCreateData,
  PDFFileChunksWithSimilarity,
} from "../entities/pdf-file-chunk.ts";

export type FindManyWithSimilarityPDFFileChunksParams = {
  chatbotId: string;
  embeddings: number[];
};

export type FindManyWithSimilarityPDFFileChunksResult =
  PDFFileChunksWithSimilarity[];

export type CreateManyPDFFileChunksParams = {
  chunks: PDFFileChunkCreateData[];
};

export type CreateManyPDFFileChunksResult = PDFFileChunk[];

export type PDFFileChunksRepository = {
  findManyWithSimilarity(
    params: FindManyWithSimilarityPDFFileChunksParams
  ): Promise<FindManyWithSimilarityPDFFileChunksResult>;

  createMany<T = unknown>(
    params: CreateManyPDFFileChunksParams,
    db?: T
  ): Promise<CreateManyPDFFileChunksResult>;
};
