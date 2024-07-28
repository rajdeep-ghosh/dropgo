DO $$ BEGIN
 CREATE TYPE "public"."upload_status_enum" AS ENUM('UPLOADING', 'UPLOADED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "upload_status" "upload_status_enum" DEFAULT 'UPLOADING' NOT NULL;