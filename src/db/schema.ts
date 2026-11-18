import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
});

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  token: text(),
});
