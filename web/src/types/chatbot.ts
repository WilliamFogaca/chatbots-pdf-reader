export type Chatbot = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  questionCount: number;
  hasPDF?: boolean;
};
