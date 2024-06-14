import { pgTable, serial, varchar, integer, timestamp, smallint, real } from "drizzle-orm/pg-core";

export const photographers = pgTable("photographers", {
  id: serial("id").primaryKey(),
  login: varchar("login", { length: 1000 }).unique(),
  password: varchar("password", { length: 1000 }),
  fullname: varchar("fullname", { length: 1000 }),
  email: varchar("email", { length: 1000 })
});

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  photographerId: integer("photographerId").notNull(),
  name: varchar("name", { length: 1000 }).notNull(),
  location: varchar("location", { length: 1000 }).notNull(),
  datapicker: varchar("datapicker", { length: 1000 }).default('[]'),
  price: real("price").notNull(),
  paid: smallint("paid").default(0).notNull()
})

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  albumId: integer("albumId").notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  clients: varchar("clients", { length: 1000 }).default('[]').notNull(),
  price: real("price").notNull(),
  paid: smallint("paid").default(0).notNull()
})

export const otps = pgTable("otps", {
  phoneNumber: varchar("phoneNumber", { length: 15 }).primaryKey().unique(),
  otp: varchar("otp", { length: 6 }).default('').notNull(),
  tryN: integer("tryN").default(0).notNull(),
  timeSent: timestamp("timeSent").notNull()
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 15 }).notNull().unique(),
  name: varchar("name", { length: 1000 }),
  email: varchar("email", { length: 1000 }).unique()
})

export const selfies = pgTable("selfies", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 15 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  isDeleted: smallint("isDeleted").default(0).notNull()
})

export const paymentIntents = pgTable("paymentIntents", {
  id: serial("id").primaryKey(),
  itemType: varchar("itemType", { length: 1000 }).notNull(),
  itemId: integer("itemId").notNull(),
  userId: integer("userId").notNull(),
  clientSecret: varchar("clientSecret", { length: 1000 }).notNull(),
  timeCreated: timestamp("timeCreated").notNull(),
  status: varchar("status", { length: 1000 }).notNull()
})