"use client";
import { useMemo } from "react";
import { useChatbotQuestions } from "@/http/use-chatbot-questions";
import { ChatbotQuestionItem } from "./chatbot-question-item";
import { EmptyData } from "./empty-data";
import { Button } from "./ui/button";

type QuestionListProps = {
  chatbotId: string;
};

export function ChatbotQuestionList({ chatbotId }: QuestionListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatbotQuestions(chatbotId);
  const questions = useMemo(
    () => data.pages.flatMap((page) => page.questions),
    [data]
  );

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl text-foreground">
            Perguntas & Respostas
          </h2>
        </div>
        <EmptyData
          description="Nenhuma pergunta foi feita para este Chatbot ainda."
          title="Nenhuma pergunta encontrada"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">
          Perguntas & Respostas
        </h2>
      </div>

      {questions.map((question) => (
        <ChatbotQuestionItem key={question.id} question={question} />
      ))}

      {hasNextPage && (
        <Button
          className="mt-3 w-full cursor-pointer"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </Button>
      )}
    </div>
  );
}
