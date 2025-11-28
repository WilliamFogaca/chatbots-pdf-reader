CREATE TABLE "chatbot_pdf_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatbot_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pdf_file_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pdf_file_id" uuid NOT NULL,
	"content" text NOT NULL,
	"embeddings" vector(768) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "pdf_files" CASCADE;--> statement-breakpoint
ALTER TABLE "chatbot_pdf_files" ADD CONSTRAINT "chatbot_pdf_files_chatbot_id_chatbots_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_file_chunks" ADD CONSTRAINT "pdf_file_chunks_pdf_file_id_chatbot_pdf_files_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."chatbot_pdf_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "pdf_file_chunks" USING hnsw ("embeddings" vector_cosine_ops);