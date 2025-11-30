import {
  type InfiniteData,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GetChatbotQuestionsResponse } from "@/lib/api/types/get-chatbot-questions-response";

export function getChatbotQuestionsQueryKey(chatbotId: string) {
  return ["get-chatbot-questions", chatbotId];
}

export function useChatbotQuestions(chatbotId: string) {
  return useSuspenseInfiniteQuery<
    GetChatbotQuestionsResponse,
    Error,
    InfiniteData<GetChatbotQuestionsResponse>,
    string[],
    number
  >({
    queryKey: getChatbotQuestionsQueryKey(chatbotId),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      api.getChatbotQuestions({ chatbotId, pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
    },
  });
}
