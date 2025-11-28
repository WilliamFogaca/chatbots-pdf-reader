"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDismissModal } from "@/hooks/use-dimiss-modal";
import { useUploadPDF } from "@/http/use-upload-pdf";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MIME_TYPES = ["application/pdf"];

const uploadPDFSchema = z.object({
  file: z
    .custom<FileList>(
      (val) => typeof FileList !== "undefined" && val instanceof FileList,
      "O upload do arquivo é obrigatório."
    )
    .refine((files) => files?.length > 0, "O upload do arquivo é obrigatório.")
    .refine(
      (files) => files?.[0] && ACCEPTED_MIME_TYPES.includes(files?.[0]?.type),
      "Apenas arquivos .pdf são aceitos."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "O tamanho máximo é de 5MB."
    ),
});

type UploadPDFFormData = z.infer<typeof uploadPDFSchema>;

type UploadPDFFormProps = {
  chatbotId: string;
};

export function UploadPDFForm({ chatbotId }: UploadPDFFormProps) {
  const { dismissCurrentModal } = useDismissModal();

  const { mutateAsync: uploadPDF } = useUploadPDF();

  const uploadPDFForm = useForm<UploadPDFFormData>({
    resolver: zodResolver(uploadPDFSchema),
  });
  const { isSubmitting } = uploadPDFForm.formState;

  async function handleOnSubmit(data: UploadPDFFormData) {
    try {
      await uploadPDF({ chatbotId, file: data.file[0] });
      uploadPDFForm.reset();
      dismissCurrentModal();
    } catch {
      // Error handling is done in the mutation's onError
    }
  }

  return (
    <Form {...uploadPDFForm}>
      {isSubmitting && (
        <Alert>
          <AlertTitle className="font-medium">Atenção</AlertTitle>
          <AlertDescription>
            Você pode fechar esse diálogo enquanto o upload é processado. Você
            será notificado quando o processo for concluído.
          </AlertDescription>
        </Alert>
      )}

      <form
        className="flex flex-col gap-4"
        onSubmit={uploadPDFForm.handleSubmit(handleOnSubmit)}
      >
        <FormField
          control={uploadPDFForm.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Arquivo PDF</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  accept="application/pdf"
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files);
                  }}
                  type="file"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full cursor-pointer"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Enviando..." : "Enviar PDF"}
        </Button>
      </form>
    </Form>
  );
}
