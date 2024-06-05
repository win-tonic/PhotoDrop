import { pgTable, serial, varchar, unique } from "drizzle-orm/pg-core";

export const photographers = pgTable("photographers", {
    id: serial("id").primaryKey(),
    login: varchar("login", {length: 1000}).unique(),
    password: varchar("password", {length: 1000}),
    fullname: varchar("fullname", {length: 1000}),
    email: varchar("email", {length: 1000})
  });

