export type PDFFileChunk = {
  id: string;
  pdfFileId: string;
  content: string;
  embeddings: number[];
  createdAt: Date;
};

export type PDFFileChunksWithSimilarity = Omit<
  PDFFileChunk,
  "embeddings" | "pdfFileId" | "createdAt"
> & {
  similarity: number;
};

export type PDFFileChunkCreateData = Omit<PDFFileChunk, "id" | "createdAt">;
