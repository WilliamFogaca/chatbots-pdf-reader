export function calculateCosineSimilarity(
  embeddings1: number[],
  embeddings2: number[]
): number {
  if (embeddings1.length === 0 || embeddings2.length === 0) {
    return 0;
  }

  const minLength = Math.min(embeddings1.length, embeddings2.length);
  let dotProduct = 0;

  for (let i = 0; i < minLength; i++) {
    dotProduct += embeddings1[i] * embeddings2[i];
  }

  const magnitude1 = Math.sqrt(
    embeddings1.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitude2 = Math.sqrt(
    embeddings2.reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}
