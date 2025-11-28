export abstract class AIService {
  abstract generateEmbeddings(text: string): Promise<number[]>;
  abstract translateContentToEnglish(content: string): Promise<string>;
  abstract generateAnswer(
    question: string,
    contents: string[]
  ): Promise<string>;
}
