import { useQuery } from "@tanstack/react-query";
import type { Chatbot } from "@/types/chatbot";

export function useChatbot(chatbotId: string) {
  return useQuery({
    queryKey: ["get-chatbot", chatbotId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/chatbots/${chatbotId}`
      );

      const result: { chatbot: Chatbot } = await response.json();

      if (!response.ok) {
        throw new Error("Erro ao buscar o chatbot");
      }

      return result.chatbot;
    },
  });
}
