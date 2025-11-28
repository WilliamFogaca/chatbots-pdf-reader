import { Frown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

type ErrorAlertProps = {
  title?: string;
  description?: string;
  tryAgain?: () => void;
};

export function ErrorAlert({
  title = "Ops, tivemos um problema!",
  description = "Houve um erro ao carregar as informações. Por favor, tente novamente.",
  tryAgain,
}: ErrorAlertProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Frown className="size-6" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button className="cursor-pointer" onClick={tryAgain}>
          Tentar Novamente
        </Button>
      </EmptyContent>
    </Empty>
  );
}
