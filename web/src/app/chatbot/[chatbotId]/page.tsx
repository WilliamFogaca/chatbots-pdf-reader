import { Dialog } from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChatbotQuestionForm } from "@/components/chatbot-question-form";
import { ChatbotQuestionList } from "@/components/chatbot-question-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { UploadPDFButton } from "@/components/upload-pdf-button";
import { UploadPDFDrawer } from "@/components/upload-pdf-drawer";

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
    <Dialog>
      <div className="min-h-screen bg-zinc-950">
        <div className="container mx-auto max-w-4xl px-4 pt-8 pb-16">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 size-4" />
                  Voltar ao Início
                </Button>
              </Link>

              <DialogTrigger asChild>
                <UploadPDFButton />
              </DialogTrigger>
            </div>
            <h1 className="mb-2 font-bold text-3xl text-foreground">
              Perguntas sobre o PDF
            </h1>
            <p className="text-muted-foreground">
              Faça perguntas e receba respostas com IA
            </p>
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Fazer uma Pergunta sobre o PDF</CardTitle>
                <CardDescription>
                  Digite sua pergunta abaixo para receber uma resposta gerada
                  por I.A.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotQuestionForm chatbotId={chatbotIdParam} />
              </CardContent>
            </Card>
          </div>

          <ChatbotQuestionList chatbotId={chatbotIdParam} />
        </div>
      </div>

      <UploadPDFDrawer chatbotId={chatbotIdParam} />
    </Dialog>
  );
}
