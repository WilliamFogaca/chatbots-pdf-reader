export type CreateWithChunksParams = {
  chatbotId: string;
  fileName: string;
  mimeType: string;
  pageTexts: string[];
};

export type CreateWithChunksResult = Array<{
  pdfFileChunkId: string;
}>;

export type ChatbotPDFFilesRepository = {
  createWithChunks(
    params: CreateWithChunksParams
  ): Promise<CreateWithChunksResult>;
};
