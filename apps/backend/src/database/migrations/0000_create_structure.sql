CREATE TYPE "public"."AccountProvider" AS ENUM('GITHUB');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('ADMIN', 'MEMBER', 'BILLING');--> statement-breakpoint
CREATE TYPE "public"."TokenType" AS ENUM('PASSWORD_RECOVER');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"provider" "AccountProvider" NOT NULL,
	"provider_account_id" varchar(100) NOT NULL,
	"user_id" varchar(30),
	CONSTRAINT "account_unique_provider_account_id" UNIQUE("provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"email" varchar(255) NOT NULL,
	"role" "Role" DEFAULT 'MEMBER' NOT NULL,
	"author_id" varchar(30),
	"organization_id" varchar(30),
	CONSTRAINT "invite_unique_email_and_organization_id" UNIQUE("email","organization_id")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"role" "Role" DEFAULT 'MEMBER' NOT NULL,
	"organization_id" varchar(30) NOT NULL,
	"user_id" varchar(30) NOT NULL,
	CONSTRAINT "member_unique_organization_and_user" UNIQUE("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"avatar_url" varchar(255),
	"domain" varchar(100),
	"should_attach_users_by_domain" boolean DEFAULT false NOT NULL,
	"owner_id" varchar(30)
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"avatar_url" varchar(255),
	"is_private" boolean DEFAULT false NOT NULL,
	"organization_id" varchar(30) NOT NULL,
	"owner_id" varchar(30)
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"type" "TokenType" NOT NULL,
	"user_id" varchar(30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"avatar_url" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invite_index_email" ON "invites" USING btree ("email");