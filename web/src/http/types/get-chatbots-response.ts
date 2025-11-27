export type Chatbots = Array<{
  id: string;
  title: string;
  createdAt: string;
  questionCount: number;
}>;

export type GetChatbotsResponse = {
  chatbots: Chatbots;
  pagination: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};
