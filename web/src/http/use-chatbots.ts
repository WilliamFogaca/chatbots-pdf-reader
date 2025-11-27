import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { GetChatbotsResponse } from "./types/get-chatbots-response";

type ApiError = {
  message: string;
  statusCode?: number;
};

export function useChatbots() {
  return useInfiniteQuery<
    GetChatbotsResponse,
    ApiError,
    InfiniteData<GetChatbotsResponse>,
    QueryKey,
    number
  >({
    queryKey: ["get-chatbots"],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ page: String(pageParam) });
      const response = await fetch(
        `http://localhost:3333/chatbots?${params.toString()}`
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
