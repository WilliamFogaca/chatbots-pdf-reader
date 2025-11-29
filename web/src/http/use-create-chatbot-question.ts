import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChatbotQuestion } from "@/types/chatbot-questions";
import type { CreateChatbotQuestionRequest } from "./types/create-chatbot-question-request";
import type { CreateChatbotQuestionResponse } from "./types/create-chatbot-question-response";
import type { GetChatbotQuestionsResponse } from "./types/get-chatbot-questions-response";
import { getChatbotQuestionsQueryKey } from "./use-chatbot-questions";

export function useCreateChatbotQuestion() {
  const queryClient = useQueryClient();

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
      const queryKey = getChatbotQuestionsQueryKey(chatbotId);

      await queryClient.cancelQueries({ queryKey });

      const currentData =
        queryClient.getQueryData<InfiniteData<GetChatbotQuestionsResponse>>(
          queryKey
        );

      const newQuestion: ChatbotQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData<InfiniteData<GetChatbotQuestionsResponse>>(
        queryKey,
        (oldData) => {
          if (!oldData) {
            return {
              pages: [
                {
                  questions: [newQuestion],
                  pagination: {
                    page: 1,
                    itemsPerPage: 10,
                    totalItems: 1,
                    totalPages: 1,
                    hasNextPage: false,
                  },
                },
              ],
              pageParams: [1],
            };
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  questions: [newQuestion, ...page.questions],
                };
              }
              return page;
            }),
          };
        }
      );

      return { currentData, newQuestion };
    },

    onSuccess(data, { chatbotId }, context) {
      queryClient.setQueryData<InfiniteData<GetChatbotQuestionsResponse>>(
        getChatbotQuestionsQueryKey(chatbotId),
        (oldData) => {
          if (!(oldData && context?.newQuestion)) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              questions: page.questions.map((question) => {
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
            })),
          };
        }
      );

      toast.success("Pergunta criada com sucesso!");
    },

    onError(_error, { chatbotId }, context) {
      toast.error(
        "Não foi possível criar a pergunta. Por favor, tente novamente."
      );

      if (context?.currentData) {
        queryClient.setQueryData<InfiniteData<GetChatbotQuestionsResponse>>(
          getChatbotQuestionsQueryKey(chatbotId),
          context.currentData
        );
      }
    },

    onSettled: (_, __, { chatbotId }) => {
      queryClient.invalidateQueries({
        queryKey: getChatbotQuestionsQueryKey(chatbotId),
      });
    },
  });
}
