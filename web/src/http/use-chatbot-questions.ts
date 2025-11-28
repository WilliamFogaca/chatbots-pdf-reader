import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { GetChatbotQuestionsResponse } from "./types/get-chatbot-questions-response";

type ApiError = {
  message: string;
  statusCode?: number;
};

export function useChatbotQuestions(chatbotId: string) {
  return useInfiniteQuery<
    GetChatbotQuestionsResponse,
    ApiError,
    InfiniteData<GetChatbotQuestionsResponse>,
    QueryKey,
    number
  >({
    queryKey: ["get-chatbot-questions", chatbotId],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ page: String(pageParam) });
      const response = await fetch(
        `http://localhost:3333/chatbots/${chatbotId}/questions?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw errorData;
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
    },
  });
}
