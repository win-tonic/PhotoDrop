import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const photographers = pgTable("photographers", {
    id: serial("id").primaryKey(),
    login: varchar("login", {length: 1000}).unique(),
    password: varchar("password", {length: 1000}),
    fullname: varchar("fullname", {length: 1000}),
    email: varchar("email", {length: 1000})
  });

export const albums = pgTable("albums", {
    id: serial("id").primaryKey(),
    photographerId: integer("photographerId").notNull(),
    name: varchar("name", {length:1000}).notNull(),
    location: varchar("location", {length:1000}).notNull(),
    datapicker: varchar("datapicker", {length:1000}).notNull(),
  })

