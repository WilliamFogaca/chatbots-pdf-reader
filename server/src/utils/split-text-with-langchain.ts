import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

type SplitOptions = {
  text: string;
  chunkSize?: number;
  chunkOverlap?: number;
  prefix?: string;
};

export async function splitTextWithLangChain({
  text,
  chunkSize = 500,
  chunkOverlap = 50,
  prefix = "",
}: SplitOptions): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
  });

  const output = await splitter.createDocuments([text]);

  return output.map((doc) => `${prefix}${doc.pageContent}`);
}
