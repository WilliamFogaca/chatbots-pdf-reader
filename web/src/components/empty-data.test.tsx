import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyData } from "./empty-data";

describe("EmptyData", () => {
  it("renders title and description", () => {
    render(<EmptyData description="No data available" title="Empty" />);

    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <EmptyData description="No items" title="Empty">
        <button type="button">Add Item</button>
      </EmptyData>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
