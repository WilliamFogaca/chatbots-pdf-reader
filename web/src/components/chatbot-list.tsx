"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChatbots } from "@/http/use-chatbots";
import { dayjs } from "@/lib/dayjs";
import { EmptyData } from "./empty-data";
import { Button } from "./ui/button";

export function ChatbotList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatbots();
  const chatbots = useMemo(
    () => data.pages.flatMap((page) => page.chatbots),
    [data]
  );

  if (chatbots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chatbots recentes</CardTitle>
          <CardDescription>
            Acesso rápido para os chatbots criados recentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyData
            description="Crie um novo chatbot para começar."
            title="Nenhum chatbot encontrado."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbots recentes</CardTitle>
        <CardDescription>
          Acesso rápido para os chatbots criados recentemente.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
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

        {hasNextPage && (
          <Button
            className="mt-3 w-full cursor-pointer"
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
