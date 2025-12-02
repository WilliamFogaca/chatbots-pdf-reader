export type Chatbot = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
};

export type ChatbotWithStats = Chatbot & {
  questionCount?: number;
  hasPDF?: boolean;
};
