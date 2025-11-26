import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dayjs } from "@/lib/dayjs";

const chatbots = [
  {
    id: "1",
    title: "Chatbot 1",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    questionCount: 10,
  },
  {
    id: "2",
    title: "Chatbot 2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    questionCount: 5,
  },
  {
    id: "3",
    title: "Chatbot 3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    questionCount: 20,
  },
];

export function ChatbotList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbots recentes</CardTitle>
        <CardDescription>
          Acesso rápido para os chatbots criados recentemente.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* {isLoading && (
          <p className="text-muted-foreground text-small">
            Carregando salas...
          </p>
        )} */}

        {chatbots.map((chatbot) => (
          <Link
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
            href={`/chatbot/${chatbot.id}`}
            key={chatbot.id}
          >
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-medium text-lg">{chatbot.title}</h3>

              <div className="flex items-center gap-2">
                <Badge className="text-xs" variant="secondary">
                  {dayjs(chatbot.createdAt).toNow()}
                </Badge>

                <Badge className="text-xs" variant="secondary">
                  {chatbot.questionCount} pergunta(s)
                </Badge>
              </div>
            </div>

            <span className="flex items-center gap-1 text-small">
              Entrar <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
