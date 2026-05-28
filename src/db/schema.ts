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
  userId: text("user_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price"),
  isFree: boolean("is_free").notNull().default(false),
  category: categoryEnum("category").notNull(),
  status: statusEnum("status").notNull().default("available"),
  contact: text("contact").notNull(),
  imageUrl: text("image_url"),
  color: text("color").default("#ffffff"),           // ← NOVÉ
  createdAt: timestamp("created_at").notNull().defaultNow(),
  locationAddress: text("location_address"),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type dbListing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type dbMessages = typeof messages.$inferSelect;
export type NewMessages = typeof messages.$inferInsert;
