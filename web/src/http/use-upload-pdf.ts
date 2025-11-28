import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UploadPDFRequest } from "./types/upload-pdf-request";

export function useUploadPDF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatbotId, file }: UploadPDFRequest) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:3333/chatbots/${chatbotId}/pdf-files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }

      await response.json();
    },
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
