import ollama from "ollama";

export async function generateEmbeddings(content: string) {
  const response = await ollama.embeddings({
    model: "nomic-embed-text",
    prompt: content,
  });

  return response.embedding;
}
