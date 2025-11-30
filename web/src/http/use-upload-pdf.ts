import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { UploadPDFRequest } from "@/lib/api/types/upload-pdf-request";

export function useUploadPDF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UploadPDFRequest) => api.uploadPDF(request),
    onSuccess: (_, variables) => {
      toast.success("PDF enviado com sucesso!");

      queryClient.invalidateQueries({
        queryKey: ["get-chatbot", variables.chatbotId],
      });
    },
    onError: () => {
      toast.error("Erro ao enviar PDF. Por favor, tente novamente.");
    },
  });
}
