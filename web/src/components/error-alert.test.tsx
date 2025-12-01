import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorAlert } from "./error-alert";

describe("ErrorAlert", () => {
  it("renders with default props", () => {
    render(<ErrorAlert />);

    expect(screen.getByText("Ops, tivemos um problema!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Houve um erro ao carregar as informações. Por favor, tente novamente."
      )
    ).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    render(
      <ErrorAlert description="Erro customizado" title="Título customizado" />
    );

    expect(screen.getByText("Título customizado")).toBeInTheDocument();
    expect(screen.getByText("Erro customizado")).toBeInTheDocument();
  });

  it("calls tryAgain callback when button is clicked", async () => {
    const user = userEvent.setup();
    const tryAgain = vi.fn();

    render(<ErrorAlert tryAgain={tryAgain} />);

    await user.click(screen.getByRole("button", { name: "Tentar Novamente" }));

    expect(tryAgain).toHaveBeenCalledOnce();
  });
});
