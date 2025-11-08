import { integer, json, pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(10)
});

export const SessionChatTable = pgTable('sessionChatTable', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull().unique(),
  notes: text(),
  selectedLawyer: json(),
  conversation: json(),
  report: json(),
  createdBy: varchar().references(() => usersTable.email),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull()
})