import { Suspense } from "react";
import { ChatbotList } from "@/components/chatbot-list";
import { CreateChatbotForm } from "@/components/create-chatbot-form";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingWithText } from "@/components/loading-with-text";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <CreateChatbotForm />

          <ErrorBoundary>
            <Suspense
              fallback={<LoadingWithText text="Carregando chatbots..." />}
            >
              <ChatbotList />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
