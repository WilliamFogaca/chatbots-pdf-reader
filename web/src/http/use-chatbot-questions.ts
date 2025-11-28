import { useQuery } from "@tanstack/react-query";
import type { GetChatbotQuestionsResponse } from "./types/get-chatbot-questions-response";

export function useChatbotQuestions(chatbotId: string) {
  return useQuery({
    queryKey: ["get-chatbot-questions", chatbotId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/chatbots/${chatbotId}/questions`
      );

      const result: GetChatbotQuestionsResponse = await response.json();

      return result;
    },
  });
}
