"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useChatbot } from "@/http/use-chatbot";
import { ErrorAlert } from "./error-alert";
import { LoadingWithText } from "./loading-with-text";
import { DialogTrigger } from "./ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "./ui/empty";
import { UploadPDFButton } from "./upload-pdf-button";

const createQuestionSchema = z.object({
  question: z
    .string()
    .min(1, "Pergunta é obrigatória")
    .min(10, "Pergunta deve ter pelo menos 10 caracteres")
    .max(500, "Pergunta deve ter no máximo 500 caracteres"),
});

type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;

type QuestionFormProps = {
  chatbotId: string;
};

export function ChatbotQuestionForm({ chatbotId }: QuestionFormProps) {
  const { data: chatbot, isLoading, isError, refetch } = useChatbot(chatbotId);

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question: "",
    },
  });
  const { isSubmitting } = form.formState;

  function handleCreateQuestion(data: CreateQuestionFormData) {
    // await createQuestion({
    //   chatbotId,
    //   question: data.question,
    // });

    form.reset();
  }

  if (isLoading) {
    return <LoadingWithText />;
  }

  if (isError || !chatbot) {
    return <ErrorAlert tryAgain={() => refetch()} />;
  }

  if (!chatbot.hasPDF) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>PDF não encontrado</EmptyTitle>
          <EmptyDescription>
            Envie um PDF para começar a fazer perguntas.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <DialogTrigger>
            <UploadPDFButton asChild />
          </DialogTrigger>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua Pergunta</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[100px]"
                  disabled={isSubmitting}
                  placeholder="O que você gostaria de saber?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Enviando..." : "Enviar Pergunta"}
        </Button>
      </form>
    </Form>
  );
}
