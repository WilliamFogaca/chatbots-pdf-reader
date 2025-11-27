ALTER TABLE "chatbot" RENAME TO "chatbots";--> statement-breakpoint
ALTER TABLE "chatbot_questions" DROP CONSTRAINT "chatbot_questions_chatbot_id_chatbot_id_fk";
--> statement-breakpoint
ALTER TABLE "pdf_chunks" DROP CONSTRAINT "pdf_chunks_chatbot_id_chatbot_id_fk";
--> statement-breakpoint
ALTER TABLE "chatbot_questions" ADD CONSTRAINT "chatbot_questions_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_chunks" ADD CONSTRAINT "pdf_chunks_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;