import {
  type InfiniteData,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GetChatbotsResponse } from "@/lib/api/types/get-chatbots-response";

export function useChatbots() {
  return useSuspenseInfiniteQuery<
    GetChatbotsResponse,
    Error,
    InfiniteData<GetChatbotsResponse>,
    string[],
    number
  >({
    queryKey: ["get-chatbots"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => api.getChatbots({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
    },
  });
}
