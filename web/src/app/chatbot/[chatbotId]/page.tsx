import { ArrowLeft, File } from "lucide-react";
import Link from "next/link";
import { ChatbotQuestionForm } from "@/components/chatbot-question-form";
import { ChatbotQuestionList } from "@/components/chatbot-question-list";
import { Button } from "@/components/ui/button";

type ChatbotPageProps = {
  chatbotId: string;
};

export default async function ChatbotPage({
  params,
}: {
  params: Promise<ChatbotPageProps>;
}) {
  const { chatbotId: chatbotIdParam } = await params;

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Voltar ao Início
              </Button>
            </Link>
            <Button className="flex items-center gap-2" variant="secondary">
              <File className="size-4" />
              Enviar PDF
            </Button>
          </div>
          <h1 className="mb-2 font-bold text-3xl text-foreground">
            Perguntas sobre o PDF
          </h1>
          <p className="text-muted-foreground">
            Faça perguntas e receba respostas com IA
          </p>
        </div>

        <div className="mb-8">
          <ChatbotQuestionForm chatbotId={chatbotIdParam} />
        </div>

        <ChatbotQuestionList chatbotId={chatbotIdParam} />
      </div>
    </div>
  );
}
