"use client";
import { useCallback, useMemo } from "react";
import { useChatbotQuestions } from "@/http/use-chatbot-questions";
import { ChatbotQuestionItem } from "./chatbot-question-item";
import { EmptyData } from "./empty-data";
import { ErrorAlert } from "./error-alert";
import { LoadingWithText } from "./loading-with-text";
import { Button } from "./ui/button";

type QuestionListProps = {
  chatbotId: string;
};

export function ChatbotQuestionList({ chatbotId }: QuestionListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useChatbotQuestions(chatbotId);
  const questions = useMemo(
    () => data?.pages.flatMap((page) => page.questions) ?? [],
    [data]
  );

  const renderList = useCallback(() => {
    if (status === "pending") {
      return <LoadingWithText />;
    }

    if (status === "error") {
      return <ErrorAlert tryAgain={() => refetch()} />;
    }

    if (questions?.length === 0) {
      return (
        <EmptyData
          description="Nenhuma pergunta foi feita para este Chatbot ainda."
          title="Nenhuma pergunta encontrada"
        />
      );
    }

    return (
      <>
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
      </>
    );
  }, [
    status,
    questions,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  ]);

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
