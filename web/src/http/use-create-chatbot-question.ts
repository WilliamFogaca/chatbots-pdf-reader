import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChatbotQuestion } from "@/types/chatbot-questions";
import type { CreateChatbotQuestionRequest } from "./types/create-chatbot-question-request";
import type { CreateChatbotQuestionResponse } from "./types/create-chatbot-question-response";
import type { GetChatbotQuestionsResponse } from "./types/get-chatbot-questions-response";

export function useCreateChatbotQuestion() {
  const queryClient = useQueryClient();

  const getQueryKey = (chatbotId: string) => [
    "get-chatbot-questions",
    chatbotId,
  ];

  return useMutation({
    mutationFn: async ({
      chatbotId,
      question,
    }: CreateChatbotQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/chatbots/${chatbotId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      const result: CreateChatbotQuestionResponse = await response.json();

      return result;
    },

    async onMutate({ chatbotId, question }) {
      const queryKey = getQueryKey(chatbotId);

      await queryClient.cancelQueries({ queryKey });

      const currentData =
        queryClient.getQueryData<GetChatbotQuestionsResponse>(queryKey);

      const questionsArray = currentData?.questions ?? [];

      const newQuestion: ChatbotQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData<GetChatbotQuestionsResponse>(queryKey, {
        questions: [newQuestion, ...questionsArray],
      });

      return { currentData, newQuestion };
    },

    onSuccess(data, { chatbotId }, context) {
      console.log("Dados retornados do servidor:", data);

      queryClient.setQueryData<GetChatbotQuestionsResponse>(
        getQueryKey(chatbotId),
        (oldData) => {
          if (!(oldData && context?.newQuestion)) {
            return oldData;
          }

          return {
            ...oldData,
            questions: oldData.questions.map((question) => {
              if (question.id === context.newQuestion.id) {
                return {
                  ...context.newQuestion,
                  id: data.questionId,
                  answer: data.answer,
                  isGeneratingAnswer: false,
                };
              }

              return question;
            }),
          };
        }
      );

      toast.success("Pergunta criada com sucesso!");
    },

    onError(_, { chatbotId }, context) {
      toast.error(
        "Não foi possível criar a pergunta. Por favor, tente novamente."
      );

      if (context?.currentData) {
        queryClient.setQueryData<GetChatbotQuestionsResponse>(
          getQueryKey(chatbotId),
          context.currentData
        );
      }
    },

    onSettled: (_, __, { chatbotId }) => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey(chatbotId),
      });
    },
  });
}
