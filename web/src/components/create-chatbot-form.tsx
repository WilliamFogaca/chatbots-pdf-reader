"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateChatbot } from "@/http/use-create-chatbot";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const createChatbotSchema = z.object({
  title: z.string().min(3, { message: "Inclua pelo menos 3 caracteres" }),
  description: z.string(),
});

type CreateChatbotFormData = z.infer<typeof createChatbotSchema>;

export function CreateChatbotForm() {
  const { mutateAsync: createChatbot } = useCreateChatbot();

  const createChatbotForm = useForm<CreateChatbotFormData>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function handleCreateChatbot({
    title,
    description,
  }: CreateChatbotFormData) {
    await createChatbot({ title, description });
    createChatbotForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar chatbot</CardTitle>
        <CardDescription>
          Crie um novo chatbot para começar a fazer perguntas e receber
          respostas da I.A.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...createChatbotForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createChatbotForm.handleSubmit(handleCreateChatbot)}
          >
            <FormField
              control={createChatbotForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da chatbot</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createChatbotForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do chatbot</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full cursor-pointer" type="submit">
              Criar chatbot
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
