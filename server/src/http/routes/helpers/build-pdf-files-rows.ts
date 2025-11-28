import { generateEmbeddings } from "@/services/ollama.ts";

type PdfFileDataBaseRow = Array<{
  chatbotId: string;
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

export async function buildRowsToInsert(
  chatbotId: string,
  pageTexts: string[]
) {
  const rowsToInsert: PdfFileDataBaseRow = [];

  for (const [index, chunkContent] of pageTexts.entries()) {
    if (!chunkContent || chunkContent.trim().length === 0) {
      continue;
    }

    try {
      const embedding = await generateEmbeddingWithRetry(chunkContent);

      rowsToInsert.push({
        chatbotId,
        content: chunkContent,
        embeddings: embedding,
      });
    } catch (error) {
      console.error(`FALHA CRÍTICA no chunk ${index + 1}. Motivo:`, error);
    }
  }

  return rowsToInsert;
}
