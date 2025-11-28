import { Spinner } from "./ui/spinner";

type LoadingWithTextProps = {
  text?: string;
};

export function LoadingWithText({
  text = "Carregando...",
}: LoadingWithTextProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner className="size-6" />

      <p className="text-foreground">{text}</p>
    </div>
  );
}
