import { ChatbotList } from "@/components/chatbot-list";
import { CreateChatbotForm } from "@/components/create-chatbot-form";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 items-start gap-8">
          <CreateChatbotForm />

          <ChatbotList />
        </div>
      </div>
    </div>
  );
}
