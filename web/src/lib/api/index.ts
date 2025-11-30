import type { CreateChatbotQuestionRequest } from "./types/create-chatbot-question-request";
import type { CreateChatbotQuestionResponse } from "./types/create-chatbot-question-response";
import type { CreateChatbotRequest } from "./types/create-chatbot-request";
import type { CreateChatbotResponse } from "./types/create-chatbot-response";
import type { GetChatbotQuestionsResponse } from "./types/get-chatbot-questions-response";
import type { GetChatbotResponse } from "./types/get-chatbot-response";
import type { GetChatbotsResponse } from "./types/get-chatbots-response";
import type { UploadPDFRequest } from "./types/upload-pdf-request";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiError = {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
};

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));
    throw errorData;
  }

  return response.json();
}

export const api = {
  getChatbotQuestions: ({
    chatbotId,
    pageParam,
  }: {
    chatbotId: string;
    pageParam: number;
  }) => {
    const params = new URLSearchParams({ page: String(pageParam) });
    return apiFetch<GetChatbotQuestionsResponse>(
      `/chatbots/${chatbotId}/questions?${params.toString()}`
    );
  },

  getChatbot: ({ chatbotId }: { chatbotId: string }) =>
    apiFetch<GetChatbotResponse>(`/chatbots/${chatbotId}`),

  getChatbots: ({ pageParam }: { pageParam: number }) => {
    const params = new URLSearchParams({ page: String(pageParam) });
    return apiFetch<GetChatbotsResponse>(`/chatbots?${params.toString()}`);
  },

  createChatbotQuestion: ({
    chatbotId,
    question,
  }: CreateChatbotQuestionRequest) =>
    apiFetch<CreateChatbotQuestionResponse>(
      `/chatbots/${chatbotId}/questions`,
      {
        method: "POST",
        body: JSON.stringify({ question }),
      }
    ),

  createChatbot: (data: CreateChatbotRequest) =>
    apiFetch<CreateChatbotResponse>("/chatbots", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadPDF: async ({ chatbotId, file }: UploadPDFRequest) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_BASE_URL}/chatbots/${chatbotId}/pdf-files/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: "An unexpected error occurred",
      }));
      throw errorData;
    }

    return response.json();
  },
};
