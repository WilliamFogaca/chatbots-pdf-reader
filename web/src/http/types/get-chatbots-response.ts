import type { Chatbot } from "@/types/chatbot";

export type GetChatbotsResponse = {
  chatbots: Chatbot[];
  pagination: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};
