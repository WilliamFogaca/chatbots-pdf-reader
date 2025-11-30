import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useChatbot(chatbotId: string) {
  return useSuspenseQuery({
    queryKey: ["get-chatbot", chatbotId],
    queryFn: async () => api.getChatbot({ chatbotId }),
  });
}
