import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateChatbotRequest } from "./types/create-chatbot-request";
import type { CreateChatbotResponse } from "./types/create-chatbot-response";

export function useCreateChatbot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChatbotRequest) => {
      const response = await fetch("http://localhost:3333/chatbots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create chatbot");
      }

      const result: CreateChatbotResponse = await response.json();

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-chatbots"] });

      toast.success("Chatbot criado com sucesso!");
    },
    onError: () => {
      toast.error(
        "Não foi possível criar o chatbot. Por favor, tente novamente."
      );
    },
  });
}
