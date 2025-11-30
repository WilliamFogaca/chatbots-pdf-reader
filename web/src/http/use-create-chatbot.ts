import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { CreateChatbotRequest } from "@/lib/api/types/create-chatbot-request";

export function useCreateChatbot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChatbotRequest) => api.createChatbot(data),
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
