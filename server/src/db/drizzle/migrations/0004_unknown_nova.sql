ALTER TABLE "chatbot_pdf_files" DROP CONSTRAINT "chatbot_pdf_files_chatbot_id_chatbots_id_fk";
--> statement-breakpoint
ALTER TABLE "chatbot_questions" DROP CONSTRAINT "chatbot_questions_chatbot_id_chatbots_id_fk";
--> statement-breakpoint
ALTER TABLE "pdf_file_chunks" DROP CONSTRAINT "pdf_file_chunks_pdf_file_id_chatbot_pdf_files_id_fk";
--> statement-breakpoint
ALTER TABLE "chatbot_pdf_files" ADD CONSTRAINT "chatbot_pdf_files_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chatbot_questions" ADD CONSTRAINT "chatbot_questions_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_file_chunks" ADD CONSTRAINT "pdf_file_chunks_pdf_file_id_chatbot_pdf_files_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."chatbot_pdf_files"("id") ON DELETE cascade ON UPDATE no action;