import { ChatbotQuestionItem } from "./chatbot-question-item";

type QuestionListProps = {
  chatbotId: string;
};

const questions = [
  {
    id: "1",
    question: "Qual é o tema principal do documento PDF?",
    answer:
      "O tema principal do documento PDF é a importância da sustentabilidade ambiental.",
    createdAt: "2024-06-01T10:00:00Z",
    isGeneratingAnswer: false,
  },
  {
    id: "2",
    question: "Quais são as principais recomendações feitas no PDF?",
    answer:
      "As principais recomendações incluem a redução do uso de plástico, o aumento da reciclagem e a promoção de energias renováveis.",
    createdAt: "2024-06-01T11:00:00Z",
    isGeneratingAnswer: false,
  },
  {
    id: "3",
    question: "O documento menciona algum estudo de caso específico?",
    answer: null,
    createdAt: "2024-06-01T12:00:00Z",
    isGeneratingAnswer: true,
  },
];

export function ChatbotQuestionList({ chatbotId }: QuestionListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">
          Perguntas & Respostas
        </h2>
      </div>

      {questions.length === 0 && (
        <p className="text-muted-foreground">Nenhuma pergunta feita ainda.</p>
      )}

      {questions.map((question) => (
        <ChatbotQuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
}
