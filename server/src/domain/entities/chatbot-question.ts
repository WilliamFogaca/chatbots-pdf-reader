export type ChatbotQuestion = {
  id: string;
  chatbotId: string;
  question: string;
  answer: string | null;
  createdAt: Date;
};
