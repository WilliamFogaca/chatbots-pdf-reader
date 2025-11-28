export function splitTextIntoChunks({
  text,
  chunkSize = 500,
  prefix = "",
}: {
  text: string;
  chunkSize?: number;
  prefix?: string;
}): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      if (currentChunk.trim().length > 0) {
        chunks.push(prefix + currentChunk.trim());
      }

      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(prefix + currentChunk.trim());
  }

  return chunks;
}
