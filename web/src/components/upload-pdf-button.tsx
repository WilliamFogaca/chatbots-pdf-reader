import { File } from "lucide-react";
import { Button } from "./ui/button";

type UploadPDFButtonProps = {
  asChild?: boolean;
};

export function UploadPDFButton({ asChild = false }: UploadPDFButtonProps) {
  return (
    <Button asChild={asChild} className="cursor-pointer" variant="secondary">
      <div className="flex items-center gap-2">
        <File className="size-4" />
        Enviar PDF
      </div>
    </Button>
  );
}
