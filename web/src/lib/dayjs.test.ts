import { describe, expect, it } from "vitest";
import { dayjs } from "./dayjs";

describe("dayjs", () => {
  it("uses pt-br locale", () => {
    const date = dayjs("2024-01-15");
    const formatted = date.format("MMMM");

    expect(formatted).toBe("janeiro");
  });

  it("formats relative time in portuguese", () => {
    const now = dayjs();
    const past = now.subtract(2, "days");

    expect(past.fromNow()).toContain("dias");
  });

  it("has toNow method from relativeTime plugin", () => {
    const future = dayjs().add(1, "hour");
    const result = future.toNow();

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).toContain("hora");
  });
});
