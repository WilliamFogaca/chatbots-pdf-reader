import { generateEmbeddings } from "@/services/ai-provider.ts";

type PdfFileChunks = Array<{
  pdfFileId: string;
  content: string;
  embeddings: number[];
}>;

async function generateEmbeddingWithRetry(
  content: string,
  attempt = 1,
  maxAttempts = 3
): Promise<number[]> {
  try {
    return await generateEmbeddings(content);
  } catch (error) {
    if (attempt >= maxAttempts) {
      throw error;
    }

    const delay = 1000 * attempt;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return generateEmbeddingWithRetry(content, attempt + 1, maxAttempts);
  }
}

export async function pdfChunkBuilder(pdfFileId: string, pageTexts: string[]) {
  const pdfFileChunks: PdfFileChunks = [];

  for (const [index, chunkContent] of pageTexts.entries()) {
    if (!chunkContent || chunkContent.trim().length === 0) {
      continue;
    }

    try {
      const embedding = await generateEmbeddingWithRetry(chunkContent);

      pdfFileChunks.push({
        pdfFileId,
        content: chunkContent,
        embeddings: embedding,
      });
    } catch (error) {
      // TODO: substituir por um logger adequado
      console.error(`FALHA CRÍTICA no chunk ${index + 1}. Motivo:`, error);
    }
  }

  return pdfFileChunks;
}
