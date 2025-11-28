"use client";
import { useCallback } from "react";
import { useChatbotQuestions } from "@/http/use-chatbot-questions";
import { ChatbotQuestionItem } from "./chatbot-question-item";
import { EmptyData } from "./empty-data";
import { ErrorAlert } from "./error-alert";
import { LoadingWithText } from "./loading-with-text";

type QuestionListProps = {
  chatbotId: string;
};

export function ChatbotQuestionList({ chatbotId }: QuestionListProps) {
  const { data, isLoading, isError, refetch } = useChatbotQuestions(chatbotId);
  const questions = data?.questions ?? [];

  const renderList = useCallback(() => {
    if (isLoading) {
      return <LoadingWithText />;
    }

    if (isError) {
      return <ErrorAlert tryAgain={() => refetch()} />;
    }

    return questions?.length === 0 ? (
      <EmptyData
        description="Nenhuma pergunta foi feita para este Chatbot ainda."
        title="Nenhuma pergunta encontrada"
      />
    ) : (
      questions.map((question) => (
        <ChatbotQuestionItem key={question.id} question={question} />
      ))
    );
  }, [questions, isError, isLoading, refetch]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">
          Perguntas & Respostas
        </h2>
      </div>

      {renderList()}
    </div>
  );
}
