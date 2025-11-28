import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { UploadPDFForm } from "./upload-pdf-form";

type UploadPDFDrawerProps = {
  chatbotId: string;
};

export function UploadPDFDrawer({ chatbotId }: UploadPDFDrawerProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Enviar PDF</DialogTitle>
      </DialogHeader>

      <UploadPDFForm chatbotId={chatbotId} />
    </DialogContent>
  );
}
