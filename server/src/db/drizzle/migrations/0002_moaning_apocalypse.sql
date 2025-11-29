ALTER TABLE "pdf_chunks" RENAME TO "pdf_files";--> statement-breakpoint
ALTER TABLE "pdf_files" DROP CONSTRAINT "pdf_chunks_chatbot_id_chatbots_id_fk";
--> statement-breakpoint
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;