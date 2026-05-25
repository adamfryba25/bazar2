import { boolean, numeric, pgEnum, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "Nábytek",
  "Dětské věci",
  "Oblečení",
  "Elektronika",
  "Knihy",
  "Ostatní",
]);

export const statusEnum = pgEnum("status", [
  "available",
  "reserved",
  "sold",
]);

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price"),
  isFree: boolean("is_free").notNull().default(false),
  category: categoryEnum("category").notNull(),
  status: statusEnum("status").notNull().default("available"),
  contact: text("contact").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  locationAddress: text("location_address"),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
});

export type dbListing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
