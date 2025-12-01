import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatbotQuestionItem } from "./chatbot-question-item";

describe("ChatbotQuestionItem", () => {
  it("renders question", () => {
    const question = {
      id: "1",
      question: "O que é React?",
      answer: "Uma biblioteca JavaScript",
      createdAt: new Date().toISOString(),
    };

    render(<ChatbotQuestionItem question={question} />);

    expect(screen.getByText("O que é React?")).toBeInTheDocument();
  });

  it("renders answer when provided", () => {
    const question = {
      id: "1",
      question: "O que é TypeScript?",
      answer: "Um superset do JavaScript",
      createdAt: new Date().toISOString(),
    };

    render(<ChatbotQuestionItem question={question} />);

    expect(screen.getByText("Um superset do JavaScript")).toBeInTheDocument();
  });

  it("shows loading state when generating answer", () => {
    const question = {
      id: "1",
      question: "O que é Vitest?",
      createdAt: new Date().toISOString(),
      isGeneratingAnswer: true,
    };

    render(<ChatbotQuestionItem question={question} />);

    expect(screen.getByText("Gerando resposta...")).toBeInTheDocument();
  });

  it("does not render answer section when no answer", () => {
    const question = {
      id: "1",
      question: "Pergunta sem resposta",
      createdAt: new Date().toISOString(),
    };

    render(<ChatbotQuestionItem question={question} />);

    expect(screen.queryByText("Resposta da IA")).not.toBeInTheDocument();
  });
});
