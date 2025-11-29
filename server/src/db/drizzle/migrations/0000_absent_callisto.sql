CREATE TABLE "chatbot_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatbot_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatbot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pdf_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatbot_id" uuid NOT NULL,
	"content" text NOT NULL,
	"embeddings" vector(768) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chatbot_questions" ADD CONSTRAINT "chatbot_questions_chatbot_id_chatbot_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_chunks" ADD CONSTRAINT "pdf_chunks_chatbot_id_chatbot_id_fk" FOREIGN KEY ("chatbot_id") REFERENCES "public"."chatbot"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "pdf_chunks" USING hnsw ("embeddings" vector_cosine_ops);