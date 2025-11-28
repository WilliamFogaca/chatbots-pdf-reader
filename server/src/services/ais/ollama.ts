import ollama from "ollama";
import { env } from "@/env.ts";
import { AIService } from "../ai-service.ts";

export class OllamaService extends AIService {
  async generateEmbeddings(content: string) {
    try {
      const response = await ollama.embeddings({
        model: env.EMBEDDINGS_MODEL,
        prompt: content,
      });

      return response.embedding;
    } catch (error) {
      console.error("Erro ao gerar embeddings com Ollama:", error);
      throw new Error("Não foi possível gerar embeddings pelo Ollama.");
    }
  }

  async translateContentToEnglish(content: string) {
    const targetLanguage = "English";

    const systemPrompt = `
      You are a strict translation engine. NOT an assistant.
      Your ONLY goal is to translate the input text to ${targetLanguage}.
      
      Rules:
      1. If the text is already in ${targetLanguage}, return it exactly as is.
      2. If the text is in another language, translate it to ${targetLanguage}.
      3. DO NOT answer questions. DO NOT explain terms. Just translate.
      4. Output ONLY the translated text string.
    `.trim();

    const userPrompt = `
      Translate the following text to ${targetLanguage}:
      ${content}
    `.trim();

    try {
      const response = await ollama.chat({
        model: env.TRANSLATION_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      });

      return response.message.content.trim();
    } catch (error) {
      console.error("Erro ao traduzir a pergunta com Ollama:", error);
      throw new Error("Não foi possível traduzir a pergunta pelo Ollama.");
    }
  }

  async generateAnswer(question: string, contents: string[]) {
    const context = contents.join("\n\n");

    const systemPrompt = `
      You are a helpful assistant specialized in answering questions based on text documents.
      
      GOAL: Answer the user's question based STRICTLY on the provided context.

      GUIDELINES:
      1. Use ONLY the information provided in the "CONTEXT" section below. Do not use outside knowledge or hallucinations.
      2. If the answer cannot be found in the context, return EXACTLY this phrase in Portuguese: "Desculpe, não encontrei nenhuma informação no PDF para responder a essa pergunta."
      3. Be clear, objective, and concise.
      4. Maintain a formal and professional tone.
      5. Cite relevant excerpts from the context to support your answer if appropriate.
      7. When referring to the source text/context, always use the specific term "conteúdo do PDF".
      8. The output must be in Brazilian Portuguese (pt-BR).
      9. If referring to the source text/context and it is in English, translate the excerpt to Brazilian Portuguese (pt-BR) before including it in your answer.
    `.trim();

    const userMessage = `
      CONTEXT:
      ${context}
    
      QUESTION:
      ${question}
    `.trim();

    try {
      const response = await ollama.chat({
        model: env.ANSWER_QUESTION_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: false,
      });

      if (!response.message.content) {
        throw new Error("Não foi possível gerar a resposta pelo Gemini.");
      }

      return response.message.content;
    } catch (error) {
      console.error("Erro ao gerar a resposta com Ollama:", error);
      throw new Error("Não foi possível gerar a resposta pelo Ollama.");
    }
  }
}
