import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  id_user: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  token: text(),
});
