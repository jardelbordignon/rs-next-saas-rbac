ALTER TABLE "accounts" DROP CONSTRAINT "account_unique_provider_account_id";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider_account_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "account_unique_provider_and_user_id" UNIQUE("provider","user_id");