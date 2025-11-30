"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html className="dark" lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Algo deu errado</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {error.message && (
                <p className="text-muted-foreground text-sm">{error.message}</p>
              )}
              <Button className="cursor-pointer" onClick={() => reset()}>
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
