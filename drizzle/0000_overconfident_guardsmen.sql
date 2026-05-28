CREATE TYPE "public"."category" AS ENUM('Nábytek', 'Dětské věci', 'Oblečení', 'Elektronika', 'Knihy', 'Ostatní');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('available', 'reserved', 'sold');--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric,
	"is_free" boolean DEFAULT false NOT NULL,
	"category" "category" NOT NULL,
	"status" "status" DEFAULT 'available' NOT NULL,
	"contact" text NOT NULL,
	"image_url" text,
	"color" text DEFAULT '#ffffff',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"location_address" text,
	"location_lat" real,
	"location_lng" real
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;