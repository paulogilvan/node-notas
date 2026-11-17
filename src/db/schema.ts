import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
});
